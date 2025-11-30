const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🫣</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                FACE BLUR DETECTION
              </h1>
              <p className="text-sm text-gray-500">
                Pemrosesan Cepat dengan Teknologi Multi-Threading
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <span className="text-blue-600">⚡</span>
            <span className="text-sm font-medium text-gray-700">
              Powered by Parallel Processing
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
