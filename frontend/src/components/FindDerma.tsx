import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, AlertTriangle, ExternalLink, Phone, Clock, Star } from 'lucide-react';

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

const FindDerma: React.FC = () => {
  const [dermatologists, setDermatologists] = useState<DermatologistPlace[]>([]);
  const [isLoadingDermatologists, setIsLoadingDermatologists] = useState(false);
  const [locationError, setLocationError] = useState<string>('');

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
      const location = await getCurrentLocation();
      const response = await fetch('http://localhost:3000/find-dermatologists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to find nearby dermatologists.');
      }
      const data = await response.json();
      if (data.places && data.places.length > 0) {
        setDermatologists(data.places.slice(0, 8));
        setLocationError('');
      } else {
        setLocationError('No dermatologists found within 50km. Please search online for "dermatologist Mangaluru" or contact your healthcare provider for referrals.');
      }
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'Failed to find nearby dermatologists. Please try again.');
    } finally {
      setIsLoadingDermatologists(false);
    }
  };

  const formatOpeningHours = (hours: any) => {
    if (!hours || !hours.weekdayDescriptions) return null;
    return hours.weekdayDescriptions.slice(0, 3).join(', ') || null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
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

export default FindDerma;
