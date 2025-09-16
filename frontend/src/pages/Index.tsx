import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResults } from '@/components/AnalysisResults';

interface AnalysisResult {
  condition: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const Index = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const imageUploadRef = useRef<HTMLDivElement>(null); // ✅ added ref

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const mockResults: AnalysisResult[] = [
        {
          condition: "Seborrheic Keratosis",
          confidence: 87,
          severity: 'low',
          description: "A common, benign skin growth that appears as brown, black, or tan patches. Usually harmless but should be monitored for changes."
        },
        {
          condition: "Common Mole (Nevus)",
          confidence: 76,
          severity: 'low',
          description: "A benign pigmented lesion. Most moles are harmless, but regular monitoring is recommended for any changes in size, color, or shape."
        }
      ];
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  const scrollToImageUpload = () => {
    imageUploadRef.current?.scrollIntoView({ behavior: 'smooth' }); // ✅ scroll function
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <HeroSection onStartAnalysisClick={scrollToImageUpload} /> {/* ✅ pass function */}
      
      <main className="container mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Upload Your Skin Image</h2>
          <p className="text-lg text-muted-foreground">
            Our AI will analyze your skin condition and provide preliminary insights in seconds. 
            Upload a clear, well-lit image for the most accurate results.
          </p>
        </div>

        <div ref={imageUploadRef}> {/* ✅ attach ref here */}
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>

        {(isAnalyzing || analysisResults) && (
          <div className="pt-8">
            <AnalysisResults 
              results={analysisResults || []}
              isLoading={isAnalyzing}
            />
          </div>
        )}
      </main>

      <footer className="bg-card border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 DermaAI. For educational purposes only. Not a substitute for professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
