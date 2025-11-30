import { useEffect, useRef, useState } from "react";
import { Camera, PauseCircle, PlayCircle } from "lucide-react";

const RealtimeDetection = ({ onFrame }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;
      setRunning(true);
    } catch (error) {
      console.error("Camera Error:", error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((t) => t.stop());
    setRunning(false);
  };

  useEffect(() => {
    let animationFrame;

    const renderFrame = () => {
      if (!running || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 🔍 Panggil fungsi deteksi (diproses developer)
      if (onFrame) onFrame(ctx, canvas);

      animationFrame = requestAnimationFrame(renderFrame);
    };

    if (running) renderFrame();

    return () => cancelAnimationFrame(animationFrame);
  }, [running, onFrame]);

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center gap-2">
        <Camera className="w-6 h-6" /> Realtime Detection
      </h2>
      <p className="text-gray-500 mb-4">
        Sistem mendeteksi wajah secara realtime melalui kamera Anda.
      </p>

      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        ></video>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        ></canvas>
      </div>

      <div className="flex justify-center mt-6 gap-4">
        {!running ? (
          <button
            onClick={startCamera}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <PlayCircle className="w-5 h-5" /> Start Detection
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white flex items-center gap-2 hover:bg-red-700 transition"
          >
            <PauseCircle className="w-5 h-5" /> Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default RealtimeDetection;
