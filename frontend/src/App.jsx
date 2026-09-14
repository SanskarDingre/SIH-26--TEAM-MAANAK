import { useState } from 'react';
import UploadScreen from './components/UploadScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';

function App() {
  const [view, setView] = useState('upload');
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  function handleResult(data, previewUrl) {
    setResult(data);
    setImageUrl(previewUrl);
    setView('results');
  }

  function handleReset() {
    setResult(null);
    setImageUrl(null);
    setView('upload');
  }

  if (view === 'history') return <HistoryScreen onBack={() => setView('upload')} />;
  if (view === 'results') return <ResultsScreen result={result} imageUrl={imageUrl} onReset={handleReset} />;

  return (
    <div>
      <UploadScreen onResult={handleResult} />
      <button
        onClick={() => setView('history')}
        className="fixed top-4 right-4 text-slate-400 hover:text-white underline text-sm"
      >
        View History
      </button>
    </div>
  );
}

export default App;
