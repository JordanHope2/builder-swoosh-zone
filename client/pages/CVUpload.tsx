import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { EnhancedCVUpload } from '../components/EnhancedCVUpload';
import { PageTransition } from '../components/ui/enhanced-motion';
import { CVAnalysisResult } from '../services/aiAnalysisService';

export default function CVUpload() {
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalysisComplete = (result: CVAnalysisResult) => {
    setAnalysisComplete(true);
    console.log('CV Analysis completed:', result);
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
