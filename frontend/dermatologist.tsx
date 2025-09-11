import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Info, Download, ExternalLink } from 'lucide-react';

interface AnalysisResult {
  condition: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Results */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            AI Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{result.condition}</h3>
                    <Badge variant={getSeverityColor(result.severity)}>
                      {getSeverityIcon(result.severity)}
                      {result.severity} risk
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{result.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{result.confidence}%</div>
                  <div className="text-sm text-muted-foreground">confidence</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence Level</span>
                  <span>{result.confidence}%</span>
                </div>
                <Progress value={result.confidence} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Medical Disclaimer */}
      <Card className="border-warning/20 bg-warning/5 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="font-semibold text-warning-foreground">Important Medical Disclaimer</h3>
              <p className="text-sm text-warning-foreground/80">
                This AI analysis is for educational and informational purposes only. It should not be used as a substitute 
                for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare 
                providers with any questions you may have regarding medical conditions.
              </p>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Find Dermatologists
                </Button>
                <Button variant="outline" size="sm">
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Consult a Professional</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Schedule an appointment with a board-certified dermatologist for proper diagnosis and treatment.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                See nearby dermatologist clinic
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Monitor Changes</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Keep track of any changes in size, color, or texture of the skin condition over time.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Set Reminder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};