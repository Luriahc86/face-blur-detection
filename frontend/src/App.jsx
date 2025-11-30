import { useState } from "react";
import "./style/tailwind.css";
import Header from "./components/layout/Header";
import Container from "./components/layout/Container";
import ImageUpload from "./components/upload/ImageUpload";
import ImagePreview from "./components/upload/ImagePreview";
import ProcessSettings from "./components/processing/ProcessSettings";
import ProcessStats from "./components/results/ProcessStats";
import Button from "./components/ui/Button";

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blurIntensity, setBlurIntensity] = useState(20);
  const [threadCount, setThreadCount] = useState(4);
  const [stats, setStats] = useState({
    processingTime: 0,
    facesDetected: 0,
    threadsUsed: 0,
    status: "waiting",
  });

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setStats({ ...stats, status: "processing" });

    // Simulate processing - Replace with actual API call
    setTimeout(() => {
      setProcessedImage(uploadedImage); // Temporary
      setStats({
        processingTime: 2.5,
        facesDetected: 1,
        threadsUsed: threadCount,
        status: "completed",
      });
      setIsProcessing(false);
    }, 2500);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setStats({
      processingTime: 0,
      facesDetected: 0,
      threadsUsed: 0,
      status: "waiting",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <Container>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Upload & Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {!uploadedImage ? (
                <ImageUpload onUpload={handleImageUpload} />
              ) : (
                <ImagePreview
                  originalImage={uploadedImage}
                  processedImage={processedImage}
                  isProcessing={isProcessing}
                />
              )}

              {uploadedImage && (
                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    variant="primary"
                    fullWidth
                  >
                    {isProcessing ? "⏳ Memproses..." : "▶ Mulai Proses"}
                  </Button>
                  <Button onClick={handleReset} variant="secondary">
                    🔄 Reset
                  </Button>
                </div>
              )}

              {/* Features Section */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeatureCard
                  icon="⚡"
                  title="Pemrosesan Cepat"
                  description="Multi-threading untuk performa optimal"
                  color="blue"
                />
                <FeatureCard
                  icon="🎯"
                  title="Deteksi Akurat"
                  description="AI detection untuk hasil maksimal"
                  color="purple"
                />
                <FeatureCard
                  icon="🎨"
                  title="Kualitas Terjaga"
                  description="Tidak menurunkan kualitas gambar"
                  color="green"
                />
              </div>
            </div>
          </div>

          {/* Right Section - Settings & Stats */}
          <div className="space-y-6">
            <ProcessSettings
              blurIntensity={blurIntensity}
              onBlurChange={setBlurIntensity}
              threadCount={threadCount}
              onThreadChange={setThreadCount}
            />
            <ProcessStats stats={stats} />
          </div>
        </div>
      </Container>
    </div>
  );
}

const FeatureCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
      <div
        className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3 text-xl`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default App;
