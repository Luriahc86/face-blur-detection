const BlurSlider = ({ value, onChange }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span className="text-blue-500">🌀</span>
          Intensitas Blur
        </label>
        <span className="text-lg font-bold text-blue-600">{value}px</span>
      </div>
      <input
        type="range"
        min="5"
        max="50"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">Rendah</span>
        <span className="text-xs text-gray-500">Tinggi</span>
      </div>
    </div>
  );
};

export default BlurSlider;
