import React, { useEffect, useState } from "react";
import { TitleBar, Button } from "@react95/core";
import * as S from "./layoutStyling";

function GoogleAuth({ closeGoogleAuthModal, onAuthSuccess }) {
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [fedCMDisabled, setFedCMDisabled] = useState(false);
  
  // We're keeping the function for potential future use
  const handleSignInWithGoogle = () => {
    if (!window.google || !window.google.accounts) {
      setError("Google Sign-In API not loaded yet. Please try again in a moment.");
      return;
    }
    
    try {
      window.google.accounts.id.prompt();
      console.log("Google One Tap prompt initiated");
    } catch (err) {
      console.error("Error with Google One Tap:", err);
      setError("Could not initiate sign-in. Please try the Sign-In button instead.");
    }
  };
  
  // Direct login method as fallback
  const handleDirectLogin = () => {
    // Get the client ID from your configuration
    const clientId = "859727566663-25k9u7if8dftsl5o5qicoh8560eg42oa.apps.googleusercontent.com";
    
    // Define required scopes and parameters
    const scope = "email profile";
    const redirectUri = window.location.origin;
    
    // Open sign-in in a popup window
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=select_account`;
    
    const popup = window.open(
      authUrl,
      'googleSignIn',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    // Check for popup blocker
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setError("Popup was blocked by your browser. Please allow popups for this site.");
      return;
    }
    
    // Listen for message from popup
    window.addEventListener('message', function(event) {
      if (event.origin !== window.location.origin) return;
      
      if (event.data && event.data.type === 'google-auth') {
        const userData = event.data.user;
        setUser(userData);
        onAuthSuccess(userData);
        popup.close();
      }
    }, false);
  };
  
  useEffect(() => {
    console.log("GoogleAuth component mounted");
    
    // Add listener for FedCM errors
    const handleFedCMError = (event) => {
      if (event.message && (
          event.message.includes("FedCM was disabled") || 
          event.message.includes("NetworkError") ||
          event.message.includes("FedCM get() rejects")
        )) {
        console.log("FedCM error detected:", event.message);
        setFedCMDisabled(true);
      }
    };
    
    window.addEventListener('error', handleFedCMError);
    window.addEventListener('unhandledrejection', handleFedCMError);
    
    // Load the Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("Google Sign-In script loaded successfully");
      setScriptLoaded(true);
      
      // Verify the client ID format before initializing
      const clientId = "859727566663-25k9u7if8dftsl5o5qicoh8560eg42oa.apps.googleusercontent.com";
      console.log("Using Client ID:", clientId);
      
      if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
        setError("Invalid client ID format. Please check your configuration.");
        return;
      }
      
      // Log current origin info for debugging
      console.log("Current origin:", window.location.origin);
      console.log("Current URL:", window.location.href);
      
      try {
        // Initialize Google Sign-In - simpler configuration
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          // Add FedCM related options
          use_fedcm_for_prompt: false // Try to avoid FedCM for prompt
        });
        
        console.log("Google Sign-In initialized successfully");
        
        // Customize the One Tap UI (optional)
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log("One Tap UI not displayed:", notification.getNotDisplayedReason());
            // Check for FedCM related issues
            if (notification.getNotDisplayedReason() === "credential_returned" || 
                notification.getNotDisplayedReason() === "browser_not_supported" ||
                notification.getNotDisplayedReason() === "api_disabled") {
              setFedCMDisabled(true);
            }
          } else if (notification.isSkippedMoment()) {
            console.log("One Tap UI skipped:", notification.getSkippedReason());
          } else {
            console.log("One Tap UI displayed");
          }
        });
        
        // Render standard button
        const buttonElement = document.getElementById("googleSignInDiv");
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with",
            width: 250
          });
          console.log("Google Sign-In button rendered");
        }
      } catch (err) {
        console.error("Error initializing Google Sign-In:", err);
        setError(`Failed to initialize Google Sign-In: ${err.message}`);
      }
    };
    
    script.onerror = (err) => {
      console.error("Failed to load Google Sign-In script:", err);
      setError("Failed to load Google authentication. Please try again later.");
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      window.removeEventListener('error', handleFedCMError);
      window.removeEventListener('unhandledrejection', handleFedCMError);
    };
  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Received credential response:", response);
    
    if (!response) {
      console.error("Empty response received");
      setError("Authentication failed: Empty response received");
      return;
    }
    
    if (response.credential) {
      try {
        // Decode the JWT token
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        console.log("Decoded payload:", payload);
        
        // Create a user object with the necessary information
        const userData = {
          name: payload.name,
          email: payload.email,
          imageUrl: payload.picture,
          id: payload.sub
        };

        setUser(userData);
        // Call the success handler with the user data
        console.log("Authentication successful:", userData);
        onAuthSuccess(userData);
      } catch (error) {
        console.error("Error processing Google Sign-In response:", error);
        setError("There was an error processing your sign-in. Please try again.");
      }
    } else {
      console.error("No credential in the response");
      setError("Authentication failed: No credential received");
    }
  };

  return (
    <S.styledModal
      title="Sign in with Google"
      closeModal={closeGoogleAuthModal}
      buttons={[
        {
          value: "Close",
          onClick: closeGoogleAuthModal,
        },
      ]}
    >
      <S.styledModalFrame bg="white" boxShadow="$in">
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2 style={{ 
              fontFamily: "MS Sans Serif", 
              fontSize: "16px", 
              marginBottom: "10px" 
            }}>
              Welcome to Janne's Calendar
            </h2>
            <p style={{ 
              fontFamily: "MS Sans Serif", 
              fontSize: "12px", 
              color: "#666",
              marginBottom: "20px"
            }}>
              Please sign in with your Google account to continue
            </p>
          </div>

          {error && (
            <div style={{
              border: "1px solid #ff0000",
              backgroundColor: "#ffeeee",
              padding: "10px",
              marginBottom: "15px",
              fontFamily: "MS Sans Serif",
              fontSize: "12px", 
              color: "#cc0000"
            }}>
              Error: {error}
            </div>
          )}

          {fedCMDisabled && (
            <div style={{
              border: "1px solid #ff9900",
              backgroundColor: "#ffffee",
              padding: "10px",
              marginBottom: "15px",
              fontFamily: "MS Sans Serif",
              fontSize: "12px",
              color: "#663300"
            }}>
              Note: Federated sign-in appears to be disabled in your browser settings. 
              You may need to enable FedCM in your browser settings or try using the button below.
            </div>
          )}

          {/* This div is for the Google button */}
          <div id="googleSignInDiv" style={{ marginBottom: "20px" }}></div>
          
          {fedCMDisabled && (
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <Button 
                onClick={handleDirectLogin}
                style={{
                  fontFamily: "MS Sans Serif",
                  fontSize: "12px",
                  padding: "4px 10px", 
                  cursor: "pointer",
                  width: "80%",
                  margin: "0 auto"
                }}
              >
                Alternative Google Sign-In
              </Button>
            </div>
          )}
          
          {!scriptLoaded && (
            <div style={{
              textAlign: "center",
              padding: "10px",
              fontFamily: "MS Sans Serif",
              fontSize: "12px"
            }}>
              Loading Google Sign-In...
            </div>
          )}

          <div style={{ 
            fontSize: "11px", 
            color: "#666", 
            textAlign: "center",
            fontFamily: "MS Sans Serif"
          }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </S.styledModalFrame>
    </S.styledModal>
  );
}

export default GoogleAuth; 