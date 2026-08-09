import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ImageUpload from "./components/ImageUpload";
import InspectionResults from "./components/InspectionResults";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import { inspectImage } from "./api/inspectionApi";

function InspectionPage() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(file, category) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await inspectImage(file, category);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center py-16 px-6">
      <h1
  className="text-8xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight mb-3"
  style={{ fontFamily: "var(--font-title)" }}
>
  anomaly.
</h1>
<p
  className="text-base text-neutral-500 dark:text-neutral-400 mb-10 text-center max-w-md"
  style={{ fontFamily: "var(--font-subtitle)" }}
>
  Industrial Defect Detection & Maintenance Recommendation System
</p>

      <ImageUpload onSubmit={handleSubmit} isLoading={isLoading} />
      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">Error: {error}</p>
      )}
      <InspectionResults result={result} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen transition-colors">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<InspectionPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;