import { useState } from "react";
import "./style/tailwind.css";

import Header from "./components/layout/Header";
import Container from "./components/layout/Container";

import ImageUpload from "./components/upload/ImageUpload";
import ImagePreview from "./components/upload/ImagePreview";
import RealtimeDetection from "./components/upload/RealtimeDetection";
import DownloadResult from "./components/upload/DownloadResult";

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
      resetStats();
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    updateStats("processing");

    setTimeout(() => {
      setProcessedImage(uploadedImage);

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
    resetStats();
  };

  const updateStats = (status) => {
    setStats((prev) => ({ ...prev, status }));
  };

  const resetStats = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
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
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
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

              {uploadedImage && (
                <div className="mt-10 space-y-8">
                  <RealtimeDetection onFrame={() => {}} />
                  <DownloadResult imageUrl={processedImage} />
                </div>
              )}

              <FeatureList />
            </div>
          </section>

          <aside className="space-y-6">
            <ProcessSettings
              blurIntensity={blurIntensity}
              onBlurChange={setBlurIntensity}
              threadCount={threadCount}
              onThreadChange={setThreadCount}
            />

            <ProcessStats stats={stats} />
          </aside>
        </div>
      </Container>
    </div>
  );
}

const FeatureList = () => {
  const features = [
    {
      icon: "⚡",
      title: "Pemrosesan Cepat",
      description: "Multi-threading untuk performa optimal",
      color: "blue",
    },
    {
      icon: "🎯",
      title: "Deteksi Akurat",
      description: "AI detection untuk hasil maksimal",
      color: "purple",
    },
    {
      icon: "🎨",
      title: "Kualitas Terjaga",
      description: "Tidak menurunkan kualitas gambar",
      color: "green",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {features.map((f, i) => (
        <FeatureCard key={i} {...f} />
      ))}
    </div>
  );
};

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
