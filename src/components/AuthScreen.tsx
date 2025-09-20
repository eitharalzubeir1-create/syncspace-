
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

const AuthScreen = ({ onAuth }: { onAuth: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleSignIn = () => {
    onAuth();
  };

  const handleCreateAccount = () => {
    setIsCreatingAccount(!isCreatingAccount);
  };

  const handleGuestLogin = () => {
    onAuth();
  };

  const handleGoogleSignIn = () => {
    onAuth();
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
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border focus:border-primary rounded-xl bg-background text-foreground transition-colors duration-300"
            />
            
            <div className="relative">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border focus:border-primary rounded-xl pr-10 bg-background text-foreground transition-colors duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                👁️
              </button>
            </div>

            <Button
              onClick={handleSignIn}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-3 font-medium transition-colors duration-300"
            >
              {isCreatingAccount ? 'Create Account' : 'Sign in with email'}
            </Button>

            <div className="text-center">
              <button 
                onClick={handleCreateAccount}
                className="text-primary font-medium hover:underline transition-colors duration-300"
              >
                {isCreatingAccount ? 'Back to Sign In' : 'Create Account'}
              </button>
            </div>

            <Button
              onClick={handleGuestLogin}
              variant="outline"
              className="w-full border-2 border-border rounded-xl py-3 hover:bg-accent text-foreground transition-colors duration-300"
            >
              <User className="w-4 h-4 mr-2" />
              Continue as Guest
            </Button>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full border-2 border-border rounded-xl py-3 hover:bg-accent text-foreground transition-colors duration-300"
            >
              <span className="mr-2">G</span>
              Sign in with Google
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthScreen;
