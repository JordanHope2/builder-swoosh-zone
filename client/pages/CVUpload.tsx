import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../components/ui/improved-navigation";
import { EnhancedCVUpload } from "../components/EnhancedCVUpload";
import { PageTransition } from "../components/ui/enhanced-motion";
import { CVAnalysisResult } from "../services/aiAnalysisService";

export default function CVUpload() {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const location = useLocation();
  const preloadedResult = location.state?.analysisResult as
    | CVAnalysisResult
    | undefined;

  useEffect(() => {
    if (preloadedResult) {
      setAnalysisComplete(true);
    }
  }, [preloadedResult]);

  const handleAnalysisComplete = (result: CVAnalysisResult) => {
    setAnalysisComplete(true);
    console.log("CV Analysis completed:", result);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
        <Navigation />

        <div className="container mx-auto px-4 py-12">
          <EnhancedCVUpload
            onUploadComplete={handleAnalysisComplete}
            className="mt-8"
          />
        </div>
      </main>
    </PageTransition>
  );
}
