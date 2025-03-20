import React, { useState, useEffect } from "react";
import { List, Frame, Cursor, TaskBar, TitleBar } from "@react95/core";
import Janne_pixelated from "../assets/janne_pixelated.png";
import Shortcuts from "./desktopIcons";
import * as S from "./layoutStyling";
import "./styles.scss";
import { Shell3236, User, CdMusic, Progman34, Textchat, Explorer103, Awfxcg321303, Computer2 } from "@react95/icons";
import Portfolio from "./portfolio";
import CV from "./cv";
import Tunes from "./tunes";
import About from "./about";
import Skills from "./skills";
import Paint from "./paint";
import CalendarApp from "./calendar";
import GoogleAuth from "./googleAuth";
import AdminCalendar from "./adminCalendar";
import useModal from "./useModal";

function Desktop() {
  const [showAboutModal, handleOpenAboutModal, handleCloseAboutModal] = useModal(true);
  const [showSkillsModal, handleOpenSkillsModal, handleCloseSkillsModal] = useModal(false);
  const [showPhotoModal, handleOpenPhotoModal, handleClosePhotoModal] = useModal(false);
  const [showVaporwaveModal, handleOpenVaporwaveModal, handleCloseVaporwaveModal] = useModal(false);
  const [showPortfolioModal, handleOpenPortfolioModal, handleClosePortfolioModal] = useModal(false);
  const [showCVModal, handleOpenCVModal, handleCloseCVModal] = useModal(false);
  const [showTunesModal, handleOpenTunesModal, handleCloseTunesModal] = useModal(false);
  const [showPaintModal, handleOpenPaintModal, handleClosePaintModal] = useModal(false);
  const [showCalendarModal, handleOpenCalendarModal, handleCloseCalendarModal] = useModal(false);
  const [showGoogleAuthModal, handleOpenGoogleAuthModal, handleCloseGoogleAuthModal] = useModal(false);
  const [showAdminCalendarModal, handleOpenAdminCalendarModal, handleCloseAdminCalendarModal] = useModal(false);
  
  // Add state for tracking user authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Flag to identify admin users

  // Check for stored user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('googleUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Check if user is an admin (in a real app, this would be validated on the server)
        // For now, we'll consider users with specific email domains as admins
        if (parsedUser.email && (
          parsedUser.email === 'alex@example.com' || 
          parsedUser.email === 'cryptodemon.eng@gmail.com' ||
          parsedUser.email.endsWith('@admin.com')
        )) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('googleUser');
      }
    }
  }, []);

  // Handle Google Auth success
  const handleAuthSuccess = (userData) => {
    // Store minimal user info in state
    setUser(userData);
    setIsAuthenticated(true);
    
    // Check if user is an admin
    if (userData.email && (
      userData.email === 'aWittman.c@gmail.com' || 
      userData.email === 'cryptodemon.eng@gmail.com' ||
      userData.email.endsWith('@admin.com')
    )) {
      setIsAdmin(true);
    }
    
    // Store user in localStorage for persistence
    localStorage.setItem('googleUser', JSON.stringify(userData));
    
    // Close auth modal and open calendar
    handleCloseGoogleAuthModal();
    handleOpenCalendarModal();
  };

  // Handle opening calendar - check if user is authenticated
  const handleCalendarClick = () => {
    if (isAuthenticated) {
      handleOpenCalendarModal();
    } else {
      handleOpenGoogleAuthModal();
    }
  };
  
  // Handle admin calendar click - only accessible to admins
  const handleAdminCalendarClick = () => {
    if (isAdmin) {
      handleOpenAdminCalendarModal();
    } else {
      // For non-admin users, show a message or prompt login
      alert("You need admin access to use this feature.");
      if (!isAuthenticated) {
        handleOpenGoogleAuthModal();
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Try to sign out from Google if API is loaded
    if (window.google && window.google.accounts) {
      try {
        window.google.accounts.id.disableAutoSelect();
        console.log('User signed out of Google.');
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
    
    // Clear local state and storage regardless of Google API state
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('googleUser');
  };

  const socialMedia = [
    {
      id: 0,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/janneilkka/",
    },
    {
      id: 1,
      name: "Github",
      url: "https://www.github.com/janneilkka/",
    },
    {
      id: 2,
      name: "Bluesky",
      url: "https://bsky.app/profile/janne-koivisto.bsky.social",
    },
    {
      id: 3,
      name: "Mastodon",
      url: "https://mastodon.social/@jannekoivisto",
    },
  ];

  return (
    <>
      <TaskBar
        list={
          <List width={"200px"}>
            <List.Item
              className="listLink"
              icon={<Progman34 variant="32x32_4" />}
            >
              Socials
              <List>
                {socialMedia.map(({ id, name, url }) => (
                  <a
                    className="listLink"
                    as="a"
                    target="_blank"
                    href={url}
                    key={id}
                  >
                    <List.Item className={`${Cursor.Pointer} listLink`}>{name}</List.Item>
                  </a>
                ))}
              </List>
            </List.Item>
            <List.Item
              icon={<CdMusic variant="32x32_4" />}
              className="listLink"
            >
              Tunes
              <List width={"200px"}>
                <List.Item
                  onClick={handleOpenVaporwaveModal}
                  icon={<CdMusic variant="16x16_4" />}
                  className="listLink"
                >
                  Janne's Vaporwave Story from 2018
                </List.Item>
                <List.Item
                  onClick={handleOpenTunesModal}
                  icon={<CdMusic variant="16x16_4" />}
                  className="listLink"
                >
                  Janne's Ultimate House Playlist on Spotify
                </List.Item>
              </List>
            </List.Item>
            <List.Item
              icon={<Awfxcg321303 variant="32x32_4" />}
              onClick={handleOpenCVModal}
              className="listLink"
            >
              CV{" "}
            </List.Item>
            <List.Item
              icon={<Explorer103 variant="32x32_4" />}
              onClick={handleOpenPortfolioModal}
              className="listLink"
            >
              Portfolio{" "}
            </List.Item>
            <List.Item
              icon={<User variant="32x32_4" />}
              onClick={handleOpenPhotoModal}
              className="listLink"
            >
              Janne
            </List.Item>
            <List.Item
              icon={<Shell3236 variant="32x32_4" />}
              onClick={handleOpenSkillsModal}
              className="listLink"
            >
              Skills
            </List.Item>
            <List.Item
              icon={<Explorer103 variant="32x32_4" />}
              onClick={handleCalendarClick}
              className="listLink"
            >
              Book Calendar
            </List.Item>
            {isAdmin && (
              <List.Item
                icon={<Computer2 variant="32x32_4" />}
                onClick={handleAdminCalendarClick}
                className="listLink"
              >
                Admin Calendar
              </List.Item>
            )}
            {isAuthenticated && (
              <List.Item
                icon={<User variant="32x32_4" />}
                onClick={handleLogout}
                className="listLink"
              >
                Logout {user?.name?.split(' ')[0] || user?.name}
              </List.Item>
            )}
            <List.Divider />
            <List.Item
              icon={<Textchat variant="32x32_4" />}
              onClick={handleOpenAboutModal}
              className="listLink"
            >
              Welcome
            </List.Item>
          </List>
        }
      />

      <Shortcuts
        openPortfolio={handleOpenPortfolioModal}
        openCV={handleOpenCVModal}
        openTunes={handleOpenTunesModal}
        openPaint={handleOpenPaintModal}
        openCalendar={handleCalendarClick}
        openGoogleAuth={handleOpenGoogleAuthModal}
        openAdminCalendar={handleAdminCalendarClick}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        userImage={user?.imageUrl}
      />
      {showAboutModal && <About closeAboutModal={handleCloseAboutModal} />}
      {showSkillsModal && <Skills closeSkillsModal={handleCloseSkillsModal} />}
      {showPhotoModal && (
        <S.styledModal
          title={"janne_compressed_for_web.jpeg"}
          titleBarOptions={
            <TitleBar.Close
              onClick={handleClosePhotoModal}
              key="close"
            />
          }
          icon={<User variant="16x16_4" />}
        >
          <Frame
            boxShadow="none"
            className="fullWidthImage"
          >
            <img
              src={Janne_pixelated}
              aria-hidden
              alt="Janne as a pixelated image"
              className="fullWidthImage"
            ></img>
          </Frame>
        </S.styledModal>
      )}
      {showVaporwaveModal && (
        <S.styledModal
          height="100%"
          icon={<CdMusic variant="16x16_4" />}
          width={340}
          title="My_Alter_Ego.doc"
          titleBarOptions={[
            <TitleBar.Close
              onClick={handleCloseVaporwaveModal}
              key="close"
            />,
          ]}
        >
          <S.styledModalFrame
            bg="white"
            boxShadow="$in"
          >
            <h1>A Vaporwave Album</h1>
            <p>In 2018 I took part in a workshop in Lithuania at the Vilnius Art Academy in producing a Vaporwave Album with participants coming in from around Europe.</p>
            <p>Over the course of the weekend we produced music videos, songs and more. I produced two songs for the album and a music video. The album can be found on streaming services.</p>
            <a
              className={Cursor.Pointer}
              target="_blank"
              href="https://open.spotify.com/album/0pCqTDsI4zOZXZJnxx2yPT?si=JW5qpLJJQsO3eK2m65FQBQ"
            >
              The album on Spotify
            </a>
            <hr
              color="gray"
              align="left"
              width="100%"
            />
            <div>
              <iframe
                src="https://www.youtube.com/embed/7SyxEF-QG_M"
                width="100%"
                height={500}
                title="A Song from a Vaporwave Album"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </S.styledModalFrame>
        </S.styledModal>
      )}
      {showPortfolioModal && <Portfolio closePortfolio={handleClosePortfolioModal} />}
      {showCVModal && <CV closeCV={handleCloseCVModal} />}
      {showTunesModal && <Tunes closeTunes={handleCloseTunesModal} />}
      {showPaintModal && <Paint closePaint={handleClosePaintModal} />}
      {showCalendarModal && <CalendarApp closeCalendarModal={handleCloseCalendarModal} user={user} />}
      {showGoogleAuthModal && (
        <GoogleAuth 
          closeGoogleAuthModal={handleCloseGoogleAuthModal} 
          onAuthSuccess={handleAuthSuccess} 
        />
      )}
      {showAdminCalendarModal && (
        <AdminCalendar closeAdminCalendarModal={handleCloseAdminCalendarModal} />
      )}
    </>
  );
}

export default Desktop;
