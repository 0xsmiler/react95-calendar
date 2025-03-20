import React from "react";
import { Cursor } from "@react95/core";
import "./styles.scss";
import { Shell32133, Explorer103, CdMusic, Mspaint, User, Computer2 } from "@react95/icons";

function Shortcuts({ openPortfolio, openCV, openTunes, openPaint, openCalendar, openGoogleAuth, openAdminCalendar, isAuthenticated, isAdmin, userImage }) {
  return (
    <div style={{ width: 100, marginLeft: 10, marginTop: 10 }}>
      <div className={Cursor.Pointer} onClick={() => openPortfolio()}>
        <Explorer103
          variant="32x32_4"
          style={{ marginLeft: 32, marginTop: 15 }}
        />
        <p
          style={{
            fontFamily: "MS Sans Serif",
            fontSize: 13,
            justifyContent: "center",
            marginTop: 5,
            width: 100,
            textAlign: "center",
            color: "black",
          }}
        >
          Portfolio
        </p>
      </div>
      <div className={Cursor.Pointer} onClick={() => openCV()}>
        <Shell32133
          variant="32x32_4"
          style={{ marginLeft: 32, marginTop: 15 }}
        />
        <p
          style={{
            fontFamily: "MS Sans Serif",
            fontSize: 13,
            justifyContent: "center",
            marginTop: 5,
            width: 100,
            textAlign: "center",
            color: "black",
          }}
        >
          CV
        </p>
      </div>
      <div className={Cursor.Pointer} onClick={() => openTunes()}>
        <CdMusic variant="32x32_4" style={{ marginLeft: 32, marginTop: 15 }} />
        <p
          style={{
            fontFamily: "MS Sans Serif",
            fontSize: 13,
            justifyContent: "center",
            marginTop: 5,
            width: 100,
            textAlign: "center",
            color: "black",
          }}
        >
          Tunes
        </p>
      </div>
      <div className={Cursor.Pointer} onClick={() => openPaint()}>
        <Mspaint variant="32x32_4" style={{ marginLeft: 32, marginTop: 15 }} />
        <p
          style={{
            fontFamily: "MS Sans Serif",
            fontSize: 13,
            justifyContent: "center",
            marginTop: 5,
            width: 100,
            textAlign: "center",
            color: "black",
          }}
        >
          Paint
        </p>
      </div>
      <div className={Cursor.Pointer} onClick={() => openCalendar()}>
        {isAuthenticated && userImage ? (
          <div 
            style={{ 
              width: 32, 
              height: 32, 
              marginLeft: 32, 
              marginTop: 15, 
              borderRadius: '4px',
              border: '2px solid #d4d0c8',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img 
              src={userImage} 
              alt="User profile" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          </div>
        ) : (
          <Explorer103 variant="32x32_4" style={{ marginLeft: 32, marginTop: 15 }} />
        )}
        <p
          style={{
            fontFamily: "MS Sans Serif",
            fontSize: 13,
            justifyContent: "center",
            marginTop: 5,
            width: 100,
            textAlign: "center",
            color: "black",
          }}
        >
          Calendar
          {!isAuthenticated && <span style={{ color: 'red', fontSize: 10 }}> (Login required)</span>}
        </p>
      </div>
      {isAdmin && (
        <div className={Cursor.Pointer} onClick={() => openAdminCalendar()}>
          <Computer2 variant="32x32_4" style={{ marginLeft: 32, marginTop: 15 }} />
          <p
            style={{
              fontFamily: "MS Sans Serif",
              fontSize: 13,
              justifyContent: "center",
              marginTop: 5,
              width: 100,
              textAlign: "center",
              color: "black",
            }}
          >
            Admin Calendar
          </p>
        </div>
      )}
      {!isAuthenticated && (
        <div className={Cursor.Pointer} onClick={() => openGoogleAuth()}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 32,
            height: 32,
            marginLeft: 32,
            marginTop: 15,
            backgroundColor: 'white',
            borderRadius: '50%',
            border: '1px solid #ccc',
          }}>
            <span style={{ color: '#4285F4', fontSize: '16px', fontWeight: 'bold' }}>G</span>
          </div>
          <p
            style={{
              fontFamily: "MS Sans Serif",
              fontSize: 13,
              justifyContent: "center",
              marginTop: 5,
              width: 100,
              textAlign: "center",
              color: "black",
            }}
          >
            Google Login
          </p>
        </div>
      )}
    </div>
  );
}

export default Shortcuts;
