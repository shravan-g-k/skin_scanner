import React from 'react';
import { Shield, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Skini</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Skin Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/how-it-works">
            <Button variant="outline" size="sm" >
              How It Works
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};