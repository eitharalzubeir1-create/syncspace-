import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Navigation, Clock, MapPin, ArrowUp, ArrowRight, ArrowLeft as TurnLeft, Building } from 'lucide-react';

interface DirectionStep {
  id: number;
  instruction: string;
  icon: React.ReactNode;
  distance: string;
  landmark?: string;
  floor?: number;
}

interface DirectionFlowScreenProps {
  destination: any;
  userLocation: { x: number; y: number };
  pathPoints?: {x: number, y: number}[] | null;
  onBack: () => void;
  onComplete: () => void;
}

const DirectionFlowScreen: React.FC<DirectionFlowScreenProps> = ({
  destination,
  userLocation,
  pathPoints,
  onBack,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // Generate realistic directions based on destination
  const generateDirections = (): DirectionStep[] => {
    const steps: DirectionStep[] = [
      {
        id: 1,
        instruction: "Head southeast on Gould Street",
        icon: <ArrowUp className="w-5 h-5" />,
        distance: "50m",
        landmark: "Start from your current location"
      },
      {
        id: 2,
        instruction: "Turn right at the main entrance",
        icon: <ArrowRight className="w-5 h-5" />,
        distance: "20m",
        landmark: "Pass by Tim Hortons on your left"
      }
    ];

    // Add building-specific steps
    if (destination.type === 'room' || destination.building_code) {
      steps.push({
        id: 3,
        instruction: `Enter ${destination.building_code || destination.name} building`,
        icon: <MapPin className="w-5 h-5" />,
        distance: "5m",
        landmark: "Main entrance with security desk"
      });

      if (destination.floor && destination.floor > 1) {
        steps.push({
          id: 4,
          instruction: `Take elevator to floor ${destination.floor}`,
          icon: <Building className="w-5 h-5" />,
          distance: "30s",
          floor: destination.floor
        });
      }

      if (destination.number) {
        steps.push({
          id: 5,
          instruction: `Walk to room ${destination.number}`,
          icon: <ArrowRight className="w-5 h-5" />,
          distance: "25m",
          landmark: `Room is on the ${destination.floor > 1 ? 'right' : 'left'} side of the hallway`
        });
      }
    }

    steps.push({
      id: steps.length + 1,
      instruction: "You have arrived at your destination",
      icon: <MapPin className="w-5 h-5 text-green-600" />,
      distance: "0m"
    });

    return steps;
  };

  const [directions] = useState<DirectionStep[]>(generateDirections());
  const estimatedTime = Math.ceil(directions.length * 1.5); // Rough estimate

  const startNavigation = () => {
    setIsNavigating(true);
  };

  const nextStep = () => {
    if (currentStep < directions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <div className="glass-effect backdrop-blur-xl bg-background/90 border-b border-border/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-muted/50 rounded-full">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">Directions</h1>
            <p className="text-xs text-muted-foreground">
              To {destination.name || destination.number || 'Destination'}
            </p>
          </div>
          <div className="w-10 h-10"></div>
        </div>

        {/* Enhanced Route Summary */}
        <Card className="glass-effect border-border/20 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Walking Route</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{estimatedTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{directions.length - 1} steps</span>
                  </div>
                </div>
              </div>
            </div>
            {!isNavigating && (
              <Button 
                onClick={startNavigation}
                className="gradient-primary hover:opacity-90 text-white rounded-full px-6 shadow-lg"
              >
                Start
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Enhanced Map Preview with Blue Path */}
      <div className="px-4 mb-4">
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-card h-64">
          <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
            {/* Blue Navigation Path */}
            {pathPoints && (
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                <path
                  d={`M ${pathPoints.map(p => `${p.x * 2.4} ${p.y * 2.56}`).join(' L ')}`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="12 6"
                  className="path-animated path-glow"
                />
                {/* Start point */}
                <circle 
                  cx={pathPoints[0]?.x * 2.4} 
                  cy={pathPoints[0]?.y * 2.56} 
                  r="6" 
                  fill="hsl(var(--primary))"
                  className="animate-pulse"
                />
                {/* End point */}
                <circle 
                  cx={pathPoints[pathPoints.length - 1]?.x * 2.4} 
                  cy={pathPoints[pathPoints.length - 1]?.y * 2.56} 
                  r="8" 
                  fill="hsl(var(--secondary))"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            )}
            
            {/* Progress indicator */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="w-full h-2 bg-muted rounded-full relative">
                <div 
                  className="h-full gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / directions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Step {currentStep + 1} of {directions.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Current Step */}
      {isNavigating && (
        <div className="px-4 mb-4">
          <Card className="gradient-primary text-white border-0 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {directions[currentStep]?.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{directions[currentStep]?.instruction}</p>
                <p className="text-white/80 text-sm">{directions[currentStep]?.distance}</p>
                {directions[currentStep]?.landmark && (
                  <p className="text-white/70 text-xs mt-1">{directions[currentStep]?.landmark}</p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
              >
                Previous
              </Button>
              <Button 
                onClick={nextStep}
                className="flex-1 bg-white text-primary hover:bg-white/90 font-semibold"
              >
                {currentStep === directions.length - 1 ? 'Complete' : 'Next Step'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Enhanced All Steps List */}
      <div className="px-4 pb-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">All Directions</h3>
        <div className="space-y-3">
          {directions.map((step, index) => (
            <Card 
              key={step.id}
              className={`border-0 shadow-sm rounded-xl p-4 transition-all animate-fade-in-up ${
                index === currentStep && isNavigating 
                  ? 'bg-primary/10 border-2 border-primary/30' 
                  : index < currentStep && isNavigating
                  ? 'bg-success/10 border-2 border-success/30'
                  : 'bg-card'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  index === currentStep && isNavigating
                    ? 'gradient-primary text-white shadow-lg'
                    : index < currentStep && isNavigating
                    ? 'bg-success text-white shadow-lg'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{step.instruction}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-muted/50">
                      {step.distance}
                    </Badge>
                    {step.floor && (
                      <Badge variant="outline" className="text-xs bg-muted/50">
                        Floor {step.floor}
                      </Badge>
                    )}
                  </div>
                  {step.landmark && (
                    <p className="text-sm text-muted-foreground mt-1">{step.landmark}</p>
                  )}
                </div>
                <div className="text-muted-foreground text-sm font-medium">
                  {index + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectionFlowScreen;