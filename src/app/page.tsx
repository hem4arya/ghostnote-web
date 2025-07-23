"use client";

import { Homepage } from "@/components/homepage/Homepage";

export default function Home() {
  const handleLoginClick = () => {
    // Handle login click
    console.log('Login clicked');
  };

  const handleSignUpClick = () => {
    // Handle signup click
    console.log('Signup clicked');
  };

  return (
    <Homepage 
      onLoginClick={handleLoginClick} 
      onSignUpClick={handleSignUpClick} 
    />
  );
}
