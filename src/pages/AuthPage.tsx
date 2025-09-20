
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Clear guest mode when arriving at auth page
  useEffect(() => {
    localStorage.removeItem('guest_mode');
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "Account exists",
              description: "An account with this email already exists. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link. Please check your email to complete registration.",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          // Successful sign-in - navigate immediately
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    // Set guest mode flag in localStorage
    localStorage.setItem('guest_mode', 'true');
    
    toast({
      title: "Welcome!",
      description: "You're now using the app as a guest.",
    });
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/90 to-primary-variant flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo/Title */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">Sync</h1>
          <h2 className="text-4xl font-bold italic">Space</h2>
          <div className="w-16 h-0.5 bg-white mx-auto mt-4"></div>
        </div>

        {/* Auth Card */}
        <Card className="p-6 bg-card/95 backdrop-blur-sm border-0 shadow-xl transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border-border focus:border-primary rounded-xl bg-background text-foreground transition-colors duration-300"
                required={isSignUp}
              />
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border focus:border-primary rounded-xl bg-background text-foreground transition-colors duration-300"
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border focus:border-primary rounded-xl bg-background text-foreground transition-colors duration-300"
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-3 font-medium transition-colors duration-300"
            >
              {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign in with email')}
            </Button>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-medium hover:underline transition-colors duration-300"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </button>
            </div>

            <Button
              type="button"
              onClick={handleGuestLogin}
              variant="outline"
              className="w-full border-2 border-border rounded-xl py-3 hover:bg-accent text-foreground transition-colors duration-300"
            >
              <User className="w-4 h-4 mr-2" />
              Continue as Guest
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
