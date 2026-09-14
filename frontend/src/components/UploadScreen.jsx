import { useState } from 'react';
import { inspectImage } from '../api/inspectAPI';

function UploadScreen({ onResult }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  }

  async function handleSubmit() {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const result = await inspectImage(selectedFile);
      onResult(result, previewUrl);
    } catch (err) {
      setError('Something went wrong while checking this image. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Parakh AI</h1>
      <p className="text-slate-400 mb-8">Legal Metrology Compliance Checker</p>

      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md shadow-lg">
        <label className="block text-slate-300 mb-3 font-medium">
          Upload a product package photo
        </label>

                <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-slate-400 mb-4 cursor-pointer
                     file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0
                     file:text-sm file:font-semibold file:bg-blue-600 file:text-white
                     hover:file:bg-blue-500 file:cursor-pointer file:transition"
        />

        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="rounded-lg mb-4 max-h-64 mx-auto" />
        )}

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {loading ? 'Checking...' : 'Check Compliance'}
        </button>
      </div>
    </div>
  );
}

export default UploadScreen;
