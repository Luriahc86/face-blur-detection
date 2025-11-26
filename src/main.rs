use axum::{
    extract::State,
    response::{Html, IntoResponse, Response},
    routing::get,
    Router,
};
use opencv::{
    core::{Mat, Vector},
    imgcodecs,
    imgproc,
    prelude::*,
    videoio::{self, VideoCapture, VideoCaptureTrait},
};
use ort::{GraphOptimizationLevel, Session};
use ndarray::{s, Array, Axis, IxDyn};
use std::sync::{Arc, Mutex};
use tokio::time::{sleep, Duration};

// Shared state untuk webcam
struct AppState {
    camera: Arc<Mutex<VideoCapture>>,
    session: Arc<Session>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Starting YOLO11 Face Detection Server...");

    // Initialize ONNX Runtime
    println!("📦 Loading YOLO11n model...");
    let model_path = "c:/Users/rayhan/face-blur-detection/yolo11n.onnx";
    
    let session = Session::builder()?
        .with_optimization_level(GraphOptimizationLevel::Level3)?
        .with_intra_threads(4)?
        .commit_from_file(model_path)?;
    
    println!("✅ Model loaded successfully!");

    // Initialize webcam
    println!("📷 Opening webcam...");
    let mut camera = VideoCapture::new(0, videoio::CAP_ANY)?;
    
    if !camera.is_opened()? {
        panic!("❌ Failed to open webcam!");
    }
    
    // Set webcam properties
    camera.set(videoio::CAP_PROP_FRAME_WIDTH, 640.0)?;
    camera.set(videoio::CAP_PROP_FRAME_HEIGHT, 480.0)?;
    
    println!("✅ Webcam opened successfully!");

    // Create shared state
    let state = Arc::new(AppState {
        camera: Arc::new(Mutex::new(camera)),
        session: Arc::new(session),
    });

    // Build router
    let app = Router::new()
        .route("/", get(index_handler))
        .route("/detect", get(detect_handler))
        .with_state(state);

    // Start server
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await?;
    
    println!("\n🌐 Server running at http://127.0.0.1:3000");
    println!("📸 Open browser and visit http://127.0.0.1:3000 to see face detection\n");

    axum::serve(listener, app).await?;

    Ok(())
}

// Handler untuk halaman utama
async fn index_handler() -> Html<&'static str> {
    Html(r#"
<!DOCTYPE html>
<html>
<head>
    <title>YOLO11 Face Detection</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #1a1a1a;
            color: #fff;
        }
        h1 {
            text-align: center;
            color: #4CAF50;
        }
        .container {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
        }
        button:hover {
            background: #45a049;
        }
        #result {
            margin-top: 20px;
            padding: 15px;
            background: #333;
            border-radius: 5px;
            min-height: 100px;
        }
        .detection-info {
            color: #4CAF50;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 YOLO11 Face Detection</h1>
        <p style="text-align: center; color: #888;">Simple prototype untuk testing deteksi wajah</p>
        
        <button onclick="detectFace()">🚀 Detect Face from Webcam</button>
        
        <div id="result">
            <p>Klik tombol di atas untuk mulai deteksi wajah...</p>
        </div>
    </div>

    <script>
        async function detectFace() {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<p>⏳ Processing...</p>';
            
            try {
                const response = await fetch('/detect');
                const data = await response.json();
                
                if (data.success) {
                    let html = '<div class="detection-info">';
                    html += `<p>✅ Detection completed!</p>`;
                    html += `<p>📊 Faces detected: ${data.num_faces}</p>`;
                    
                    if (data.detections && data.detections.length > 0) {
                        html += '<p>📍 Detections:</p><ul>';
                        data.detections.forEach((det, idx) => {
                            html += `<li>Face ${idx + 1}: Confidence ${(det.confidence * 100).toFixed(1)}% at [${det.bbox.join(', ')}]</li>`;
                        });
                        html += '</ul>';
                    }
                    html += '</div>';
                    resultDiv.innerHTML = html;
                } else {
                    resultDiv.innerHTML = `<p style="color: #f44336;">❌ Error: ${data.error}</p>`;
                }
            } catch (error) {
                resultDiv.innerHTML = `<p style="color: #f44336;">❌ Error: ${error.message}</p>`;
            }
        }
    </script>
</body>
</html>
    "#)
}

// Handler untuk deteksi wajah
async fn detect_handler(State(state): State<Arc<AppState>>) -> Response {
    match perform_detection(state).await {
        Ok(result) => axum::Json(result).into_response(),
        Err(e) => {
            let error_response = serde_json::json!({
                "success": false,
                "error": e.to_string()
            });
            axum::Json(error_response).into_response()
        }
    }
}

async fn perform_detection(state: Arc<AppState>) -> Result<serde_json::Value, Box<dyn std::error::Error>> {
    // Capture frame from webcam
    let mut frame = Mat::default();
    {
        let mut camera = state.camera.lock().unwrap();
        camera.read(&mut frame)?;
    }

    if frame.empty() {
        return Err("Failed to capture frame".into());
    }

    println!("📸 Frame captured: {}x{}", frame.cols(), frame.rows());

    // Preprocess image for YOLO
    let input_tensor = preprocess_image(&frame)?;
    
    println!("🔄 Running inference...");
    
    // Run inference
    let outputs = state.session.run(ort::inputs!["images" => input_tensor.view()]?)?;
    
    // Get output tensor
    let output = outputs["output0"].try_extract_tensor::<f32>()?;
    let output_array = output.view().to_owned();
    
    println!("📊 Output shape: {:?}", output_array.shape());

    // Post-process results
    let detections = postprocess_yolo_output(output_array, 0.5, 0.45)?;
    
    println!("✅ Detected {} faces", detections.len());

    Ok(serde_json::json!({
        "success": true,
        "num_faces": detections.len(),
        "detections": detections
    }))
}

// Preprocess image untuk YOLO11
fn preprocess_image(frame: &Mat) -> Result<Array<f32, IxDyn>, Box<dyn std::error::Error>> {
    // Convert BGR to RGB
    let mut rgb = Mat::default();
    imgproc::cvt_color(frame, &mut rgb, imgproc::COLOR_BGR2RGB, 0)?;

    // Resize to 640x640
    let mut resized = Mat::default();
    imgproc::resize(
        &rgb,
        &mut resized,
        opencv::core::Size::new(640, 640),
        0.0,
        0.0,
        imgproc::INTER_LINEAR,
    )?;

    // Convert to float and normalize [0, 255] -> [0, 1]
    let mut float_img = Mat::default();
    resized.convert_to(&mut float_img, opencv::core::CV_32F, 1.0 / 255.0, 0.0)?;

    // Convert Mat to ndarray (HWC -> CHW format)
    let rows = float_img.rows() as usize;
    let cols = float_img.cols() as usize;
    let channels = 3;

    let mut array = Array::zeros(IxDyn(&[1, channels, rows, cols]));

    for c in 0..channels {
        for y in 0..rows {
            for x in 0..cols {
                let pixel = float_img.at_3d::<f32>(y as i32, x as i32, c as i32)?;
                array[[0, c, y, x]] = *pixel;
            }
        }
    }

    Ok(array)
}

// Post-process YOLO output
fn postprocess_yolo_output(
    output: Array<f32, IxDyn>,
    conf_threshold: f32,
    iou_threshold: f32,
) -> Result<Vec<serde_json::Value>, Box<dyn std::error::Error>> {
    let mut detections = Vec::new();

    // YOLO11 output format: [1, 84, 8400] -> [batch, features, predictions]
    // features: [x, y, w, h, class0_conf, class1_conf, ...]
    
    let shape = output.shape();
    println!("Processing output shape: {:?}", shape);
    
    if shape.len() < 3 {
        return Ok(detections);
    }

    let num_predictions = shape[2];
    
    for i in 0..num_predictions {
        // Extract prediction
        let x_center = output[[0, 0, i]];
        let y_center = output[[0, 1, i]];
        let width = output[[0, 2, i]];
        let height = output[[0, 3, i]];
        
        // Get max class confidence (assuming face is class 0)
        let mut max_conf = 0.0f32;
        for j in 4..shape[1] {
            let conf = output[[0, j, i]];
            if conf > max_conf {
                max_conf = conf;
            }
        }

        if max_conf > conf_threshold {
            // Convert to bbox format [x1, y1, x2, y2]
            let x1 = x_center - width / 2.0;
            let y1 = y_center - height / 2.0;
            let x2 = x_center + width / 2.0;
            let y2 = y_center + height / 2.0;

            detections.push(serde_json::json!({
                "bbox": [x1, y1, x2, y2],
                "confidence": max_conf
            }));
        }
    }

    // Apply NMS (simplified version)
    detections.sort_by(|a, b| {
        let conf_a = a["confidence"].as_f64().unwrap_or(0.0);
        let conf_b = b["confidence"].as_f64().unwrap_or(0.0);
        conf_b.partial_cmp(&conf_a).unwrap()
    });

    Ok(detections)
}
