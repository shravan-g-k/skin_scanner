import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-medical.jpg';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-background to-medical-light overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="success" className="mb-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                FDA Guidelines Compliant
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                AI-Powered
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Skin Analysis
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                Get instant preliminary skin condition assessment using advanced computer vision and machine learning. 
                Fast, accurate, and secure analysis to guide your healthcare decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1 bg-primary/10 rounded">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1 bg-primary/10 rounded">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1 bg-primary/10 rounded">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span>24/7 Available</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Start Analysis
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground/120">
                <strong>Medical Disclaimer:</strong> This tool provides preliminary analysis only. 
                Always consult qualified healthcare professionals for diagnosis and treatment.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="AI-powered dermatological analysis visualization" 
                className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-3xl transform translate-x-4 translate-y-4 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};