import React from 'react';
import { Link } from 'react-router-dom';
import { homepageImages } from '../config/homepageImages';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-scrapbook-page">
      
      {/* FIX 1: HERO SECTION WITH SOFT SEAMLESS BLENDING SKY & CLOUD BACKGROUND */}
      <section 
        className="hero-scrapbook"
        style={{ backgroundImage: `url(${homepageImages.heroSkyBg})` }}
      >
        <div className="hero-sky-overlay"></div>

        <div className="hero-scrapbook-container">
          
          {/* LEFT POLAROID COLLAGE (SUBSTANTIALLY LARGER) */}
          <div className="polaroid-card polaroid-left-top">
            <div className="polaroid-tape"></div>
            <img src={homepageImages.heroLeftLarge} alt="Roommates talking" className="polaroid-img" />
            <div className="polaroid-caption">good vibes only ♡</div>
          </div>

          <div className="polaroid-card polaroid-left-mid">
            <div className="polaroid-tape"></div>
            <img src={homepageImages.heroLeftCity} alt="Indian city building" className="polaroid-img" />
            <div className="polaroid-caption">new home, new stories ♡</div>
          </div>

          <div className="polaroid-card polaroid-left-bot">
            <div className="polaroid-tape"></div>
            <img src={homepageImages.heroLeftRoom} alt="Cozy apartment interior" className="polaroid-img" />
            <div className="polaroid-caption">better together ☺</div>
          </div>

          {/* CENTRAL HERO CONTENT */}
          <div className="hero-central-content">
            <div className="hero-main-title">
              <span className="title-roomie">roomie</span>
              <span className="title-match-badge">match</span>
            </div>

            <p className="hero-subtitle">
              Find a roommate who actually fits your lifestyle.
            </p>

            <Link to="/register" className="hero-pill-btn">
              Find Your Match →
            </Link>
          </div>

          {/* RIGHT POLAROID COLLAGE (SUBSTANTIALLY LARGER) */}
          <div className="polaroid-card polaroid-right-top">
            <div className="polaroid-tape"></div>
            <img src={homepageImages.heroRightCity} alt="Sunlit city view" className="polaroid-img" />
            <div className="polaroid-caption">same city, new people ♡</div>
          </div>

          <div className="polaroid-card polaroid-right-bot">
            <div className="polaroid-tape"></div>
            <img src={homepageImages.heroRightDesk} alt="Study desk setup" className="polaroid-img" />
            <div className="polaroid-caption">roommates = friends ☺</div>
          </div>

        </div>
      </section>

      {/* SECTION 2: INTRODUCTION */}
      <section className="home-intro-section">
        <div className="container">
          <div className="intro-container">
            
            <div className="intro-frame-wrapper">
              <img src={homepageImages.introRoom} alt="Sunlit bedroom interior" />
              <div className="intro-tape-bottom"></div>
            </div>

            <div className="intro-content">
              <h2>Finding a roommate is more than finding a room.</h2>
              <p>
                Your budget, habits, sleep schedule and lifestyle all affect how well you live together. RoomieMatch helps you discover people whose everyday preferences are <span className="yellow-highlight">compatible with yours.</span>
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: LARGE IMAGE BANNER */}
      <section 
        className="home-banner-section"
        style={{ backgroundImage: `url(${homepageImages.bannerGroup})` }}
      >
        <div className="banner-dark-overlay"></div>
        <div className="banner-text-box">
          <h2 className="banner-headline">MATCH. CONNECT. LIVE TOGETHER.</h2>
          <p className="banner-subhead">Find people who fit the way you live.</p>
        </div>
      </section>

      {/* SECTION 4: HOW ROOMIEMATCH WORKS - 4 SEPARATE SPACIOUS CARDS */}
      <section className="home-how-section">
        <div className="container">
          
          <div className="how-header-row">
            <div className="paper-note">
              <div className="paper-note-tape"></div>
              same space,<br />better people ♡
            </div>

            <h2 className="how-title">How RoomieMatch Works</h2>

            <div className="how-polaroid-mini">
              <div className="polaroid-card">
                <div className="polaroid-tape"></div>
                <img src={homepageImages.howItWorksRight} alt="Cozy apartment scene" className="polaroid-img" />
                <div className="polaroid-caption">good company ♡</div>
              </div>
            </div>
          </div>

          {/* 4 Separate Spacious Cards Grid (utilizing full container width) */}
          <div className="how-steps-grid">
            
            <div className="how-step-card">
              <div className="how-step-header">
                <span className="step-num-pill">01</span>
                <svg className="step-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3>Create your profile</h3>
              <p>Tell us about your budget, location and lifestyle.</p>
            </div>

            <div className="how-step-card">
              <div className="how-step-header">
                <span className="step-num-pill">02</span>
                <svg className="step-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3>Share your preferences</h3>
              <p>Tell us about sleep, cleanliness, smoking, pets, cooking, guests and social preferences.</p>
            </div>

            <div className="how-step-card">
              <div className="how-step-header">
                <span className="step-num-pill">03</span>
                <svg className="step-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3>Discover compatible roommates</h3>
              <p>RoomieMatch compares lifestyle preferences and calculates a compatibility score.</p>
            </div>

            <div className="how-step-card">
              <div className="how-step-header">
                <span className="step-num-pill">04</span>
                <svg className="step-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3>Send a request</h3>
              <p>Connect with people you think could be a good fit.</p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: COMPATIBILITY */}
      <section className="home-compatibility-section">
        <div className="container">
          <div className="compatibility-grid">
            
            <div className="comp-info">
              <h2>Compatibility that goes beyond location.</h2>
              <p>RoomieMatch compares everyday preferences that can affect shared living.</p>
              <div className="comp-handwritten-note">
                based on lifestyle preferences ✓
              </div>
              <div className="comp-disclaimer-box">
                Compatibility is based on the preferences users provide. It does not represent trustworthiness or guarantee a successful relationship.
              </div>
            </div>

            {/* Paper Card Callout */}
            <div className="comp-paper-card">
              <div className="comp-big-score">94%</div>
              <div className="comp-highlight-badge">Compatible</div>
              
              <div className="comp-checklist-grid">
                <div className="comp-check-item"><span>✓</span> Sleep</div>
                <div className="comp-check-item"><span>✓</span> Budget</div>
                <div className="comp-check-item"><span>✓</span> Cleanliness</div>
                <div className="comp-check-item"><span>✓</span> Lifestyle</div>
              </div>
            </div>

            {/* Polaroid */}
            <div className="comp-polaroid-wrapper">
              <div className="polaroid-card">
                <div className="polaroid-tape"></div>
                <img src={homepageImages.compatibilityRoom} alt="Bedroom interior" className="polaroid-img" />
                <div className="polaroid-caption">better together ♡</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: LIFESTYLE IMAGE BANNER */}
      <section 
        className="home-lifestyle-banner"
        style={{ backgroundImage: `url(${homepageImages.cookingBanner})` }}
      >
        <div className="lifestyle-overlay"></div>
        <div className="lifestyle-caption-box">
          <h2>The right roommate can make a place feel like home. ♡</h2>
        </div>
      </section>

      {/* SECTION 7: WHY ROOMIEMATCH */}
      <section className="home-why-section">
        <div className="container">
          <h2 className="why-title">Built around real everyday compatibility.</h2>

          <div className="why-points-grid">
            <div className="why-point-card">
              <div className="why-point-icon">🏠</div>
              <h3>Lifestyle-first matching</h3>
              <p>Compare the habits that actually matter when sharing a home.</p>
            </div>

            <div className="why-point-card">
              <div className="why-point-icon">₹</div>
              <h3>Budget-aware discovery</h3>
              <p>Find people whose expected rent range fits yours.</p>
            </div>

            <div className="why-point-card">
              <div className="why-point-icon">⭐</div>
              <h3>Simple compatibility scores</h3>
              <p>Understand why a profile may be compatible with yours.</p>
            </div>

            <div className="why-point-card">
              <div className="why-point-icon">👥</div>
              <h3>Designed for shared living</h3>
              <p>A simple experience focused on practical roommate preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section 
        className="home-final-cta"
        style={{ backgroundImage: `url(${homepageImages.finalCtaBackdrop})` }}
      >
        <div className="final-overlay"></div>
        
        <div className="final-cta-box">
          <h2>Ready to find your roommate?</h2>
          <p>Create your profile and discover people who match the way you live.</p>
          <Link to="/register" className="final-yellow-btn">
            Get Started →
          </Link>
        </div>

        <div className="polaroid-card final-polaroid-bottom">
          <div className="polaroid-tape"></div>
          <img src={homepageImages.finalCtaPolaroid} alt="Evening city balcony" className="polaroid-img" />
          <div className="polaroid-caption">better together ♡</div>
        </div>
      </section>

    </div>
  );
};

export default Home;
