import { useEffect, useState } from 'react';
import { getHistory } from '../api/inspectAPI';

function HistoryScreen({ onBack }) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(setInspections)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Inspection History</h1>
          <button onClick={onBack} className="text-slate-400 hover:text-white underline">
            New Inspection
          </button>
        </div>

        {loading && <p className="text-slate-400">Loading...</p>}
        {!loading && inspections.length === 0 && (
          <p className="text-slate-400">No inspections yet — go check a product.</p>
        )}

        <div className="space-y-3">
          {inspections.map((item) => (
            <div key={item._id} className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-200 text-sm">{new Date(item.createdAt).toLocaleString()}</p>
                {item.missingFields?.length > 0 && (
                  <p className="text-slate-500 text-xs mt-1">Missing: {item.missingFields.join(', ')}</p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.status === 'compliant' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {item.status === 'compliant' ? 'Compliant' : 'Non-Compliant'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryScreen;
