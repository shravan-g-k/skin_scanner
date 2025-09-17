
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Info, Download, ListChecks, Lightbulb } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface AnalysisResult {
  condition: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  symptoms?: string[];
  suggestions?: string[];
}

interface AnalysisResultsProps {
  results: AnalysisResult[];
  isLoading?: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-card">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h3 className="text-lg font-semibold">Analyzing your image...</h3>
            <p className="text-muted-foreground">Our AI is examining the skin condition. This may take a few moments.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const downloadPDF = () => {
    if (!results || results.length === 0) return;
    const result = results[0];
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(20);
    doc.setTextColor(24, 90, 157);
    doc.setFont("helvetica", "bold");
    doc.text("Skin Condition Analysis Report", 105, y, { align: "center" });
    y += 20;
    doc.setFontSize(14);
    doc.setTextColor(24, 90, 157);
    doc.text("Condition:", 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(result.condition, 25, y);
    y += 15;
    doc.setFontSize(14);
    doc.setTextColor(24, 90, 157);
    doc.text("Description:", 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const descText = doc.splitTextToSize(result.description, 170);
    doc.text(descText, 25, y);
    y += descText.length * 7 + 10;
    if (result.symptoms && result.symptoms.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(24, 90, 157);
      doc.text("Symptoms:", 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      result.symptoms.forEach((s: string) => {
        const symptomText = doc.splitTextToSize(`- ${s}`, 160);
        doc.text(symptomText, 25, y);
        y += symptomText.length * 7;
      });
      y += 10;
    }
    if (result.suggestions && result.suggestions.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(24, 90, 157);
      doc.text("Suggestions:", 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      result.suggestions.forEach((s: string) => {
        const suggestionText = doc.splitTextToSize(`- ${s}`, 160);
        doc.text(suggestionText, 25, y);
        y += suggestionText.length * 7;
      });
    }
    y += 15;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("⚠ This is an AI-generated report, not medical advice.", 20, y);
    doc.save("Skin-Condition-Report.pdf");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {results.map((result, index) => (
        <Card className="shadow-card" key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getSeverityIcon(result.severity)}
              </div>
              <span className="text-xl font-bold">{result.condition}</span>
              <Badge variant={getSeverityColor(result.severity)} className="ml-2">
                {result.severity} risk
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="text-muted-foreground mb-2">{result.description}</p>
            </div>
            {result.symptoms && result.symptoms.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ListChecks className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Symptoms</h4>
                </div>
                <ul className="list-disc list-inside ml-2 text-sm text-muted-foreground">
                  {result.symptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.suggestions && result.suggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Suggestions</h4>
                </div>
                <ul className="list-disc list-inside ml-2 text-sm text-muted-foreground">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Medical Disclaimer */}
      <Card className="border-warning/20 bg-warning/5 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="font-semibold text-warning-foreground" style={{color:'black'}}>Important Medical Disclaimer</h3>
              <p className="text-sm text-warning-foreground/80" style={{color:'black'}}>
                This AI analysis is for educational and informational purposes only. It should not be used as a substitute 
                for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare 
                providers with any questions you may have regarding medical conditions.
              </p>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={downloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mx-auto">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Consult a Professional</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Schedule an appointment with a board-certified dermatologist for proper diagnosis and treatment.
              </p>
              <Button variant="outline" size="lg" className="w-full">
                Find nearby dermatologist clinics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};