import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LogIn, User } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-marine-100 to-marine-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-marine-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-marine-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
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
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-marine-600 hover:bg-marine-700">
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </Button>
          <div className="text-sm text-center text-marine-600">
            Don't have an account?{" "}
            <a href="#" className="text-marine-800 hover:underline font-medium">
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;