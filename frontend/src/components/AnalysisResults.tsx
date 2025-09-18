import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info, Download, ListChecks, Lightbulb, MapPin, Phone, Clock, Star, ExternalLink, Loader2 } from 'lucide-react';
import { jsPDF } from "jspdf";

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

interface DermatologistPlace {
  name: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  regularOpeningHours?: {
    openNow?: boolean;
    weekdayDescriptions?: string[];
  };
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, isLoading }) => {
  const [dermatologists, setDermatologists] = useState<DermatologistPlace[]>([]);
  const [isLoadingDermatologists, setIsLoadingDermatologists] = useState(false);
  const [locationError, setLocationError] = useState<string>('');

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
  const doc = new jsPDF();
  let y = 20;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(24, 90, 157); // dark blue
  doc.setFont("helvetica", "bold");
  doc.text("Skin Condition Analysis Report", 105, y, { align: "center" });
  y += 20;

  results.forEach((result, idx) => {

    // Condition
    doc.setFontSize(14);
    doc.setTextColor(24, 90, 157);
    doc.text("Condition:", 20, y);
    y+=8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(result.condition, 25, y);
    y += 12;

    // Description
    doc.setFontSize(14);
    doc.setTextColor(24, 90, 157);
    doc.text("Description:", 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const descText = doc.splitTextToSize(result.description, 170);
    doc.text(descText, 25, y);
    y += descText.length * 6 + 8;

    // Symptoms
    if (result.symptoms && result.symptoms.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(24, 90, 157);
      doc.text("Symptoms:", 20, y);
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

    // Suggestions
    if (result.suggestions && result.suggestions.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(24, 90, 157);
      doc.text("Suggestions:", 20, y);
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
    if (y > 260) {  // add page if space runs out
      doc.addPage();
      y = 20;
    }
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("⚠ This is an AI-generated report, not medical advice.", 20, 280);

  // Save
  doc.save("Skin-Condition-Report.pdf");
};


  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        }
      );
    });
  };

  const findNearbyDermatologists = async () => {
    setIsLoadingDermatologists(true);
    setLocationError('');
    setDermatologists([]);

    try {
      // Get user's current location
      const location = await getCurrentLocation();
      
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY; //API Key <<<<<<<<<<<<-----------
      
      if (!apiKey) {
        throw new Error('Google Places API key not configured.');
      }

      // First try: Direct text search for dermatologists with expanded radius
      await searchDermatologistsByText(location, apiKey);
      
    } catch (error) {
      console.error('Error finding dermatologists:', error);
      setLocationError(error instanceof Error ? error.message : 'Failed to find nearby dermatologists. Please try again.');
    } finally {
      setIsLoadingDermatologists(false);
    }
  };

  const searchDermatologistsByText = async (location: { lat: number; lng: number }, apiKey: string) => {
    try {
      // Try multiple search queries to find the best results
      const searchQueries = [
        'dermatologist',
        'skin specialist',
        'dermatology clinic',
        'skin doctor',
        'dermatologist hospital'
      ];

      let allResults: any[] = [];

      // Search with each query
      for (const query of searchQueries) {
        const textSearchBody = {
          textQuery: query,
          maxResultCount: 10,
          locationBias: {
            circle: {
              center: {
                latitude: location.lat,
                longitude: location.lng,
              },
              radius: 50000.0, // Expanded to 50km as requested
            },
          },
          rankPreference: 'DISTANCE',
        };

        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.businessStatus,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.regularOpeningHours,places.types',
          },
          body: JSON.stringify(textSearchBody),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.places && data.places.length > 0) {
            allResults = [...allResults, ...data.places];
          }
        }
      }

      if (allResults.length > 0) {
        // Remove duplicates and filter for dermatology-related places
        const uniquePlaces = allResults.filter((place, index, self) => 
          index === self.findIndex((p) => p.displayName?.text === place.displayName?.text)
        );

        // Strong filtering for dermatology-related places
        const dermatologyPlaces = uniquePlaces.filter((place: any) => {
          const name = place.displayName?.text?.toLowerCase() || '';
          const address = place.formattedAddress?.toLowerCase() || '';
          
          // Exclude veterinary hospitals specifically
          if (name.includes('veterinary') || name.includes('animal') || name.includes('pet')) {
            return false;
          }
          
          // Include dermatology-specific terms
          return name.includes('dermat') || 
                 name.includes('skin') || 
                 address.includes('dermat') ||
                 (name.includes('clinic') && !name.includes('tb') && !name.includes('tuberculosis')) ||
                 (name.includes('hospital') && !name.includes('veterinary') && !name.includes('tb') && !name.includes('tuberculosis')) ||
                 name.includes('medical center') ||
                 name.includes('specialist');
        });

        // Sort by relevance (dermatology-specific first)
        const sortedPlaces = dermatologyPlaces.sort((a, b) => {
          const aName = a.displayName?.text?.toLowerCase() || '';
          const bName = b.displayName?.text?.toLowerCase() || '';
          
          const aScore = (aName.includes('dermat') ? 10 : 0) + 
                        (aName.includes('skin') ? 8 : 0) +
                        (a.rating ? a.rating : 0);
          const bScore = (bName.includes('dermat') ? 10 : 0) + 
                        (bName.includes('skin') ? 8 : 0) +
                        (b.rating ? b.rating : 0);
          
          return bScore - aScore;
        });

        if (sortedPlaces.length > 0) {
          setDermatologists(sortedPlaces.slice(0, 8));
        } else {
          // If no dermatology-specific places found, show general medical facilities
          const medicalFacilities = uniquePlaces.filter((place: any) => {
            const name = place.displayName?.text?.toLowerCase() || '';
            return !name.includes('veterinary') && 
                   !name.includes('animal') && 
                   !name.includes('pet') &&
                   (name.includes('clinic') || name.includes('hospital') || name.includes('medical'));
          });
          
          if (medicalFacilities.length > 0) {
            setDermatologists(medicalFacilities.slice(0, 5));
            setLocationError('No specialized dermatologists found nearby. Showing general medical facilities that may have dermatology services.');
          } else {
            setLocationError('No dermatologists found within 50km. Please search online for "dermatologist Mangaluru" or contact your healthcare provider for referrals.');
          }
        }
      } else {
        setLocationError('No dermatologists found within 50km. Please search online for "dermatologist Mangaluru" or contact your healthcare provider for referrals.');
      }
    } catch (error) {
      console.error('Text search error:', error);
      setLocationError('Search failed. Please try searching online for "dermatologist near Mangaluru" or contact your healthcare provider for referrals.');
    }
  };

  const formatOpeningHours = (hours: any) => {
    if (!hours || !hours.weekdayDescriptions) return null;
    return hours.weekdayDescriptions.slice(0, 3).join(', ') || null;
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
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full" 
                onClick={findNearbyDermatologists}
                disabled={isLoadingDermatologists}
              >
                {isLoadingDermatologists ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finding dermatologists...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Find nearby dermatologist clinics
                  </>
                )}
              </Button>
              
              {locationError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{locationError}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Dermatologists Results */}
      {dermatologists.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Nearby Dermatologists & Clinics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dermatologists.map((place, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">
                        {place.displayName?.text || place.name}
                      </h4>
                      {place.formattedAddress && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{place.formattedAddress}</span>
                        </div>
                      )}
                    </div>
                    
                    {place.rating && (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{place.rating}</span>
                        {place.userRatingCount && (
                          <span className="text-sm text-muted-foreground">
                            ({place.userRatingCount})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {place.businessStatus && (
                      <div className="flex items-center gap-1">
                        <div className={`h-2 w-2 rounded-full ${
                          place.businessStatus === 'OPERATIONAL' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className={place.businessStatus === 'OPERATIONAL' ? 'text-green-600' : 'text-red-600'}>
                          {place.businessStatus === 'OPERATIONAL' ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    )}

                    {place.regularOpeningHours?.openNow !== undefined && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className={place.regularOpeningHours.openNow ? 'text-green-600' : 'text-red-600'}>
                          {place.regularOpeningHours.openNow ? 'Open now' : 'Closed now'}
                        </span>
                      </div>
                    )}

                    {(place.nationalPhoneNumber || place.internationalPhoneNumber) && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{place.nationalPhoneNumber || place.internationalPhoneNumber}</span>
                      </div>
                    )}
                  </div>

                  {formatOpeningHours(place.regularOpeningHours) && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Hours:</strong> {formatOpeningHours(place.regularOpeningHours)}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {place.googleMapsUri && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(place.googleMapsUri, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on Google Maps
                      </Button>
                    )}
                    
                    {place.websiteUri && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(place.websiteUri, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit Website
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};