import React, { useEffect, useState } from "react";
import { TitleBar, Button } from "@react95/core";
import * as S from "./layoutStyling";

function GoogleAuth({ closeGoogleAuthModal, onAuthSuccess }) {
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [tryDirectMethod, setTryDirectMethod] = useState(false);
  
  // Function to handle direct login redirect (alternative method)
  const handleDirectGoogleLogin = () => {
    // Get the client ID from your configuration
    const clientId = "859727566663-25k9u7if8dftsl5o5qicoh8560eg42oa.apps.googleusercontent.com";
    
    // Define OAuth 2.0 endpoint
    const oauthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    
    // Define the redirect URI (this should match what's configured in Google Cloud Console)
    const redirectUri = window.location.origin;
    
    // Define required scopes
    const scope = "email profile";
    
    // Construct the authorization URL
    const authUrl = `${oauthEndpoint}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=token&prompt=consent`;
    
    // Redirect the browser to the authorization URL
    window.location.href = authUrl;
  };
  
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
      console.log("Full URL:", window.location.href);
      console.log("Protocol:", window.location.protocol);
      console.log("Hostname:", window.location.hostname);
      console.log("Port:", window.location.port);
      console.log("Add this origin to Google Cloud Console:", currentOrigin);
      
      // List all possible origins to try adding to Google Cloud Console
      const hostname = window.location.hostname;
      const possibleOrigins = [
        currentOrigin,
        `http://${hostname}`,
        `https://${hostname}`,
        `http://${hostname}:5173`,
        `https://${hostname}:5173`,
        `http://${hostname}:3000`,
        `https://${hostname}:3000`,
        `http://localhost`,
        `https://localhost`,
        `http://localhost:5173`,
        `https://localhost:5173`,
        `http://localhost:3000`,
        `https://localhost:3000`,
      ];
      
      console.log("Try adding these origins to the Google Cloud Console:");
      possibleOrigins.forEach(origin => console.log(" - " + origin));
      console.log("Google Cloud Console > APIs & Services > Credentials > Edit your OAuth 2.0 Client ID");
      
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: "signin",
          ux_mode: "redirect",
          login_uri: window.location.href,
          debug: true,
          itp_support: true
        });
        
        console.log("Google Sign-In initialized successfully");
        
        const buttonElement = document.getElementById("googleSignInDiv");
        if (buttonElement) {
          window.google.accounts.id.renderButton(
            buttonElement,
            { 
              type: "standard",
              theme: "outline", 
              size: "large", 
              text: "signin_with",
              shape: "rectangular",
              logo_alignment: "left",
              width: 250
            }
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
          
          {error && (
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <p style={{ 
                fontFamily: "MS Sans Serif", 
                fontSize: "12px", 
                color: "#666",
                marginBottom: "10px"
              }}>
                Having trouble? Try the direct method:
              </p>
              <Button 
                onClick={handleDirectGoogleLogin}
                style={{
                  fontFamily: "MS Sans Serif",
                  fontSize: "12px",
                  padding: "4px 10px", 
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                Direct Google Login
              </Button>
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