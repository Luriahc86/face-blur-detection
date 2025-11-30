import BlurSlider from "./BlurSlider";
import ThreadSlider from "./ThreadSlider";

const ProcessSettings = ({
  blurIntensity,
  onBlurChange,
  threadCount,
  onThreadChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Pengaturan Proses
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Sesuaikan parameter pemrosesan sesuai kebutuhan
      </p>

      <div className="space-y-6">
        <BlurSlider value={blurIntensity} onChange={onBlurChange} />
        <ThreadSlider value={threadCount} onChange={onThreadChange} />
      </div>
    </div>
  );
};

export default ProcessSettings;
