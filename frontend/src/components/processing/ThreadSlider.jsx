const ThreadSlider = ({ value, onChange }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span className="text-purple-500">⚡</span>
          Thread Paralel
        </label>
        <span className="text-lg font-bold text-purple-600">
          {value} Threads
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="8"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">1 Thread</span>
        <span className="text-xs text-gray-500">8 Threads</span>
      </div>
    </div>
  );
};

export default ThreadSlider;
