import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResults } from '@/components/AnalysisResults';

interface AnalysisResult {
  condition: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  symptoms?: string[];
  suggestions?: string[];
}

const Index = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const imageUploadRef = useRef<HTMLDivElement>(null);

  // Helper: Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const base64Image = await fileToBase64(file);
      const mimeType = file.type;
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image, mimeType })
      });
      if (!response.ok) throw new Error("Failed to analyze image");
      const data = await response.json();
      const mappedResult: AnalysisResult = {
        condition: data.conditionName,
        description: data.description,
        symptoms: data.symptoms,
        suggestions: data.suggestions,
        severity: data.severity, // Now expects severity from backend
      };
      setAnalysisResults([mappedResult]);
    } catch (err) {
      setAnalysisResults(null);
      alert("Failed to analyze image. Please try again.");
    }
    setIsAnalyzing(false);
  };

  const scrollToImageUpload = () => {
    imageUploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <HeroSection onStartAnalysisClick={scrollToImageUpload} />
      
      <main className="container mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Upload Your Skin Image</h2>
          <p className="text-lg text-muted-foreground">
            Our AI will analyze your skin condition and provide preliminary insights in seconds. 
            Upload a clear, well-lit image for the most accurate results.
          </p>
        </div>

        <div ref={imageUploadRef}>
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
