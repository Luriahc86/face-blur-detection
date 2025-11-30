const ImagePreview = ({ originalImage, processedImage, isProcessing }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Preview Gambar</h2>
      <p className="text-gray-500 mb-6">
        Bandingkan gambar sebelum dan sesudah proses blurring
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Gambar Asli</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Original
            </span>
          </div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Processed Image */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Hasil Proses</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                processedImage
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {processedImage ? "Blurred" : "Belum Diproses"}
            </span>
          </div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            {isProcessing ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Menunggu proses...</p>
              </div>
            ) : processedImage ? (
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-400">Hasil akan muncul di sini</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
