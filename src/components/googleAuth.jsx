import React, { useEffect, useState } from "react";
import { TitleBar, Button, Frame } from "@react95/core";
import { Explorer103 } from "@react95/icons";
import * as S from "./layoutStyling";

function GoogleAuth({ closeGoogleAuthModal, onAuthSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Function to handle the response from Google Sign-In
  const handleCredentialResponse = async (response) => {
    setIsLoading(true);
    
    try {
      // Decode the JWT credential
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const userData = {
        name: payload.name,
        email: payload.email,
        imageUrl: payload.picture,
        id_token: credential,
        // For demo purposes, we're setting a dummy access token since we're mocking email sending
        access_token: 'mock_access_token'
      };
      
      // Pass the authenticated user back to the parent component
      onAuthSuccess(userData);
      setIsLoading(false);
      
    } catch (error) {
      setError("Failed to process sign-in. Please try again.");
      console.error("Error processing Google sign-in:", error);
      setIsLoading(false);
    }
  };

  // Initialize Google Sign-In
  const initializeGoogleSignIn = () => {
    if (!window.google || !scriptLoaded) return;
    
    try {
      window.google.accounts.id.initialize({
        client_id: '923049542027-0ojfrq1ifif3l86dmn2382a9c7gdqnf4.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      
      // Display the Sign In With Google button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { 
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with'
        }
      );
    } catch (error) {
      setError("Failed to initialize Google Auth. Please try again.");
      console.error("Error initializing Google Auth:", error);
    }
  };

  // Load the Google Sign-In API script
  useEffect(() => {
    if (document.getElementById('google-identity-script')) {
      setScriptLoaded(true);
      initializeGoogleSignIn();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-identity-script';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
      initializeGoogleSignIn();
    };
    script.onerror = () => {
      setError("Failed to load Google authentication. Please try again later.");
    };
    
    document.head.appendChild(script);
    
    return () => {
      const scriptElement = document.getElementById('google-identity-script');
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [scriptLoaded]);

  return (
    <S.styledModal
      icon={<Explorer103 variant="16x16_4" />}
      title="Google Authentication"
      titleBarOptions={[
        <TitleBar.Close onClick={closeGoogleAuthModal} key="close" />,
      ]}
      width="350px"
    >
      <S.styledModalFrame bg="white" boxShadow="$in">
        <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ 
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'MS Sans Serif',
              marginBottom: '15px'
            }}>
              Sign in with Google
            </div>
            
            <div style={{ 
              fontSize: '12px',
              fontFamily: 'MS Sans Serif',
              color: '#444',
              marginBottom: '15px'
            }}>
              Please sign in to access the calendar
            </div>
          </div>
          
          {/* Loading indicator */}
          {isLoading && (
            <div style={{
              fontFamily: 'MS Sans Serif',
              fontSize: '12px',
              textAlign: 'center',
              marginBottom: '10px'
            }}>
              Loading, please wait...
            </div>
          )}
          
          {/* Google Sign-In Button will be rendered here */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div id="google-signin-button"></div>
          </div>
          
          {/* Error message */}
          {error && (
            <div style={{
              fontFamily: 'MS Sans Serif',
              fontSize: '11px',
              color: '#ff0000',
              textAlign: 'center',
              marginTop: '5px'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ 
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <Button 
              onClick={closeGoogleAuthModal}
              style={{
                fontFamily: 'MS Sans Serif',
                fontSize: '12px',
                padding: '4px 10px', 
                cursor: 'pointer',
                width: '100px'
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </S.styledModalFrame>
    </S.styledModal>
  );
}

export default GoogleAuth; 