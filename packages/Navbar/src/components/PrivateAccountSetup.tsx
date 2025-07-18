import { AlertTriangle, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import useToast from "../hooks/use-toast";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import Label from "./ui/Label";

// React 19 compatibility
const CopyIcon = Copy as React.ElementType;
const EyeIcon = Eye as React.ElementType;
const EyeOffIcon = EyeOff as React.ElementType;
const AlertTriangleIcon = AlertTriangle as React.ElementType;

interface PrivateAccountSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivateAccountSetup = ({
  open,
  onOpenChange,
}: PrivateAccountSetupProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

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
    toast.success("Username copied to clipboard!");
  };

  const handleCreateAccount = () => {
    if (!password) {
      toast.error("Password required", {
        description: "Please enter a password to create your account.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure both password fields match.",
      });
      return;
    }

    if (password.length < 8) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    // Here you would typically call your authentication service
    toast.success("Account created successfully", {
      description: "Welcome to your private vault!",
    });

    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-gradient-to-br from-ghost-dark to-ghost-gray/90 border border-ghost-purple/20 rounded-xl p-6 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent mb-2">
            Enter Your Private Vault
          </h2>
          <p className="text-gray-400 text-sm">
            Create your anonymous account - secure, private, no traces.
          </p>
        </div>

        <div className="space-y-6">
          {/* Generated Username */}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-white"
            >
              Your Anonymous Identity
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="username"
                value={generatedUsername}
                readOnly
                className="bg-ghost-gray/30 border-ghost-purple/50 text-white font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyUsername}
                className="border-ghost-purple/30 hover:bg-ghost-purple/10"
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-white"
            >
              Vault Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                className="pr-10 bg-ghost-gray/50 border-ghost-purple/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-white"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="pr-10 bg-ghost-gray/50 border-ghost-purple/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {/* Warning Box */}
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-400">
                  ⚠️ This is a private account
                </p>
                <p className="text-xs text-gray-400">
                  If you forget your password, your account and notes will be
                  permanently deleted after 60 days of inactivity. No recovery
                  options available.
                </p>
              </div>
            </div>
          </div>

          {/* Create Account Button */}
          <Button
            onClick={handleCreateAccount}
            className="w-full bg-gradient-to-r from-ghost-purple to-ghost-neon hover:from-ghost-purple/80 hover:to-ghost-neon/80 text-lg py-6 font-medium"
          >
            Create Private Account
          </Button>

          {/* Convert to Permanent Account */}
          <div className="text-center">
            <button
              disabled
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors cursor-not-allowed"
            >
              Convert to Permanent Account (Coming Soon)
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PrivateAccountSetup;
