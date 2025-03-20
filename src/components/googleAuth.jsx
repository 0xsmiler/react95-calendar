import React, { useEffect, useState } from "react";
import { TitleBar, Button } from "@react95/core";
import * as S from "./layoutStyling";

function GoogleAuth({ closeGoogleAuthModal, onAuthSuccess }) {
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  useEffect(() => {
    console.log("GoogleAuth component mounted");
    
    // Load the Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("Google Sign-In script loaded successfully");
      setScriptLoaded(true);
      
      // Verify the client ID format before initializing
      // IMPORTANT: Replace this with your actual client ID from Google Cloud Console
      const clientId = "859727566663-25k9u7if8dftsl5o5qicoh8560eg42oa.apps.googleusercontent.com";
      console.log("Using Client ID:", clientId);
      
      if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
        setError("Invalid client ID format. Please check your configuration.");
        return;
      }
      
      // Log current origin to help with debugging
      const currentOrigin = window.location.origin;
      console.log("Current origin:", currentOrigin);
      console.log("Add this origin to Google Cloud Console:", currentOrigin);
      console.log("Google Cloud Console > APIs & Services > Credentials > Edit your OAuth 2.0 Client ID");
      
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: "signin",
          ux_mode: "popup",
          // Log all events for debugging
          debug: true
        });
        
        console.log("Google Sign-In initialized successfully");
        
        const buttonElement = document.getElementById("googleSignInDiv");
        if (buttonElement) {
          window.google.accounts.id.renderButton(
            buttonElement,
            { theme: "outline", size: "large", width: "100%" }
          );
          console.log("Google Sign-In button rendered");
        } else {
          console.error("Google Sign-In button container not found");
          setError("Button container not found");
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

          <div id="googleSignInDiv" style={{ marginBottom: "20px" }}></div>
          
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