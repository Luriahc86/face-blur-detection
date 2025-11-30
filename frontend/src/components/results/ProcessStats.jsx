const ProcessStats = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Statistik Proses</h3>
      <p className="text-sm text-gray-500 mb-6">Informasi performa dan hasil</p>

      <div className="space-y-4">
        <StatItem
          icon="⏱️"
          label="Waktu Proses"
          value={
            stats.processingTime > 0
              ? `${stats.processingTime.toFixed(1)}s`
              : "-"
          }
          color="blue"
        />

        <StatItem
          icon="👤"
          label="Wajah Terdeteksi"
          value={stats.facesDetected > 0 ? stats.facesDetected : "-"}
          color="green"
        />

        <StatItem
          icon="⚡"
          label="Thread Digunakan"
          value={stats.threadsUsed > 0 ? `${stats.threadsUsed} Threads` : "-"}
          color="purple"
        />

        <StatItem
          icon="📊"
          label="Status"
          value={
            stats.status === "completed"
              ? "Selesai"
              : stats.status === "processing"
              ? "Memproses"
              : "Menunggu"
          }
          color={
            stats.status === "completed"
              ? "green"
              : stats.status === "processing"
              ? "blue"
              : "gray"
          }
        />
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center text-lg`}
        >
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-base font-bold text-gray-900">{value}</span>
    </div>
  );
};

export default ProcessStats;
