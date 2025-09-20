import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { AnalysisResult } from './AnalysisResults';
interface DownloadReportProps {
  results: AnalysisResult[];
}

const DownloadReport: React.FC<DownloadReportProps> = ({ results }) => {
  const downloadPDF = () => {
    if (!results || results.length === 0) return;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(20);
    doc.setTextColor(24, 90, 157);
    doc.setFont('helvetica', 'bold');
    doc.text('Skin Condition Analysis Report', 105, y, { align: 'center' });
    y += 20;
    results.forEach((result) => {
      doc.setFontSize(14);
      doc.setTextColor(24, 90, 157);
      doc.text('Condition:', 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(result.condition, 25, y);
      y += 12;
      doc.setFontSize(14);
      doc.setTextColor(24, 90, 157);
      doc.text('Description:', 20, y);
      y += 8;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const descText = doc.splitTextToSize(result.description, 170);
      doc.text(descText, 25, y);
      y += descText.length * 6 + 8;
      if (result.symptoms && result.symptoms.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(24, 90, 157);
        doc.text('Symptoms:', 20, y);
        y += 8;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        result.symptoms.forEach((s) => {
          const symptomText = doc.splitTextToSize(`- ${s}`, 160);
          doc.text(symptomText, 25, y);
          y += symptomText.length * 6;
        });
        y += 8;
      }
      if (result.suggestions && result.suggestions.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(24, 90, 157);
        doc.text('Suggestions:', 20, y);
        y += 8;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        result.suggestions.forEach((s) => {
          const suggestionText = doc.splitTextToSize(`- ${s}`, 160);
          doc.text(suggestionText, 25, y);
          y += suggestionText.length * 6;
        });
        y += 8;
      }
      y += 10;
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    });
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('⚠ This is an AI-generated report, not medical advice.', 20, 280);
    doc.save('Skin-Condition-Report.pdf');
  };
  return (
    <Button variant="outline" size="sm" onClick={downloadPDF}>
      <Download className="h-4 w-4 mr-2" />
      Download Report
    </Button>
  );
};

export default DownloadReport;
