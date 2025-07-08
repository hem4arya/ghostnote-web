import { useState } from "react";
import { Copy, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PrivateAccountSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivateAccountSetup = ({ open, onOpenChange }: PrivateAccountSetupProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Generate a random username
  const generateUsername = () => {
    const prefixes = ["ghost", "phantom", "shadow", "cipher", "void", "echo"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${randomPrefix}_${randomSuffix}`;
  };

  const [generatedUsername] = useState(generateUsername());

  const copyUsername = () => {
    navigator.clipboard.writeText(generatedUsername);
    // You might want to add a toast notification here
  };

  const handleCreateAccount = () => {
    if (!password) {
      console.error("Password required");
      return;
    }

    if (password !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      console.error("Password too short");
      return;
    }

    // Here you would typically call your authentication service
    console.log("Account created successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-card to-card/90 border-primary/20">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Enter Your Private Vault
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Create your anonymous account - secure, private, no traces.
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Generated Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">
              Your Anonymous Identity
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="username"
                value={generatedUsername}
                readOnly
                className="bg-muted/30 border-border/50 text-foreground font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyUsername}
                className="border-primary/30 hover:bg-primary/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Vault Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                className="pr-10 bg-input/50 border-border/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="pr-10 bg-input/50 border-border/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Warning Box */}
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  ⚠️ This is a private account
                </p>
                <p className="text-xs text-muted-foreground">
                  If you forget your password, your account and notes will be permanently deleted after 60 days of inactivity. No recovery options available.
                </p>
              </div>
            </div>
          </div>

          {/* Create Account Button */}
          <Button
            onClick={handleCreateAccount}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-lg py-6 font-medium"
          >
            Create Private Account
          </Button>

          {/* Convert to Permanent Account */}
          <div className="text-center">
            <button
              disabled
              className="text-sm text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors cursor-not-allowed"
            >
              Convert to Permanent Account (Coming Soon)
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivateAccountSetup;
