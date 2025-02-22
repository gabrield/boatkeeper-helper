
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LogIn, User, Anchor } from "lucide-react";
import { signIn, signUp } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmEmail, setShowConfirmEmail] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowConfirmEmail(false);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: "Account created",
          description: "Please check your email to verify your account",
        });
        setShowConfirmEmail(true);
      } else {
        await signIn(email, password);
        navigate("/");
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage.includes("email_not_confirmed")) {
        setShowConfirmEmail(true);
        toast({
          title: "Email not confirmed",
          description: "Please check your email and click the confirmation link",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-marine-100 via-marine-200 to-marine-300 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Anchor className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-2">ShipShape</h1>
        <p className="text-marine-600">Your Complete Marina Management Solution</p>
      </div>
      
      <Card className="w-full max-w-md shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-primary">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center text-marine-600">
            {isSignUp
              ? "Enter your details to create your account"
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        {showConfirmEmail && (
          <div className="px-6">
            <Alert>
              <AlertDescription>
                Please check your email and click the confirmation link to verify your account.
                After confirming, you can sign in.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-marine-500" />
                <Input
                  id="email"
                  placeholder="your.email@example.com"
                  type="email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-marine-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200"
              disabled={loading}
              type="submit"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <div className="text-sm text-center text-marine-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setShowConfirmEmail(false);
                }}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
