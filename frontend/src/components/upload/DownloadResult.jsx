import { Download } from "lucide-react";

const DownloadResult = ({ imageUrl }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "hasil_citra.png";
    link.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Hasil Citra
      </h2>

      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Processed Result"
            className="rounded-xl shadow mb-4"
          />
          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition mx-auto"
          >
            <Download className="w-5 h-5" /> Download Hasil
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-center">
          Belum ada hasil citra yang diproses.
        </p>
      )}
    </div>
  );
};

export default DownloadResult;
