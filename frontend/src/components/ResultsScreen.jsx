import { verifyInspection } from '../api/inspectAPI';
import { useState } from 'react';
function ResultsScreen({ result, imageUrl, onReset }) {
    const [decision, setDecision] = useState(null);

  async function handleVerify(choice) {
    setDecision(choice);
    await verifyInspection(result.inspectionId, choice);
  }
  const isCompliant = result.status === 'compliant';

  const fieldLabels = {
    mrp: 'MRP',
    netQuantity: 'Net Quantity',
    manufacturer: 'Manufacturer / Packer',
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-white mt-4 mb-6">Inspection Result</h1>

      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-3xl shadow-lg grid md:grid-cols-2 gap-6">
        {/* Image with evidence boxes */}
        <div className="relative">
          <img src={imageUrl} alt="Inspected package" className="rounded-lg w-full" />
          {Object.entries(result.evidence || {}).map(([key, ev]) => {
            if (!ev) return null;
            return (
              <div
                key={key}
                className="absolute border-2 border-green-400"
                style={{
                  left: `${ev.box[0][0]}px`,
                  top: `${ev.box[0][1]}px`,
                  width: `${ev.box[1][0] - ev.box[0][0]}px`,
                  height: `${ev.box[2][1] - ev.box[0][1]}px`,
                }}
              />
            );
          })}
        </div>

        {/* Verdict and field list */}
        <div>
          <div
            className={`inline-block px-4 py-1.5 rounded-full font-semibold mb-4 ${
              isCompliant ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {isCompliant ? 'Compliant' : 'Non-Compliant'}
          </div>

          <ul className="space-y-2">
                        {Object.entries(result.extractedFields).map(([key, value]) => {
              const ev = result.evidence?.[key];
              return (
                <li key={key} className="flex items-center justify-between bg-slate-700/50 px-3 py-2 rounded-lg">
                  <span className="text-slate-200">{fieldLabels[key] || key}</span>
                  <span className={value === 'Present' ? 'text-green-400' : 'text-red-400'}>
                    {value}
                    {ev && <span className="text-slate-500 text-xs ml-2">({Math.round(ev.confidence * 100)}%)</span>}
                  </span>
                </li>
              );
            })}
          </ul>
                    <div className="mt-5 flex gap-3">
            <button
              onClick={() => handleVerify('confirmed')}
              disabled={decision !== null}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg transition"
            >
              {decision === 'confirmed' ? '✓ Confirmed' : 'Confirm Result'}
            </button>
            <button
              onClick={() => handleVerify('overridden')}
              disabled={decision !== null}
              className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg transition"
            >
              {decision === 'overridden' ? '✓ Flagged' : 'Override / Flag for Review'}
            </button>
          </div>

          {result.missingFields.length > 0 && (
            <div className="mt-4 text-sm text-slate-400">
              Missing: {result.missingFields.join(', ')}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-6 text-slate-400 hover:text-white underline"
      >
        Check another product
      </button>
    </div>
  );
}

export default ResultsScreen;
