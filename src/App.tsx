/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AppScreen, BettingSite } from "./types";
import { AviatorLogo } from "./components/AviatorLogo";
import { BettingSiteGrid } from "./components/BettingSiteGrid";
import { PredictorWorkspace } from "./components/PredictorWorkspace";
import { Loader2, KeyRound, Mail, Share2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function App() {
  // --- CORE APP STATES ---
  const [screen, setScreen] = useState<AppScreen>("LOGIN");
  const [selectedSite, setSelectedSite] = useState<BettingSite | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionLog, setConnectionLog] = useState<string>("Connecting to security gateway...");

  // Login credentials states
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Voucher validation state (Does NOT persist on refresh or lobby transitions)
  const [hasVerifiedVoucher, setHasVerifiedVoucher] = useState<boolean>(false);

  // Mandatory WhatsApp Share checklist triggers
  const [hasShared, setHasShared] = useState<boolean>(false);

  const handleSetHasVerifiedVoucher = (val: boolean) => {
    setHasVerifiedVoucher(val);
  };

  // Boot progress and note status description logs (Mockup 1 page)
  const [bootLog, setBootLog] = useState<string>("Bypassing host firewall...");
  const [bootProgress, setBootProgress] = useState<number>(0);

  // --- SPLASH ANIMATION COUNTER (Description Page) ---
  useEffect(() => {
    if (screen !== "SPLASH") return;

    const bootLogs = [
      "Securing connection gateway...",
      "Intercepting active websocket ports...",
      "Decrypting client license keys...",
      "License Valid: Original Predictor unlocked!",
      "Handshaking Cloudflare protection rules...",
      "Ready to start!",
    ];

    let currentStep = 0;
    setBootProgress(0);
    const interval = setInterval(() => {
      if (currentStep < bootLogs.length) {
        setBootLog(bootLogs[currentStep]);
        setBootProgress((prev) => Math.min(100, prev + 18));
        currentStep++;
      } else {
        clearInterval(interval);
        setScreen("SITE_SELECT");
      }
    }, 700);

    return () => clearInterval(interval);
  }, [screen]);

  // --- LOGIN SUBMISSION ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailInput.trim()) {
      setLoginError("Please enter an email address or username");
      return;
    }

    if (passwordInput !== "8525") {
      setLoginError("Invalid password. Please request correct credentials.");
      return;
    }

    setLoginError(null);
    // Switch to Mandatory WhatsApp Share barrier page
    setScreen("SHARE");

    // Play authorization tone
    try {
      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioClass) {
        const ctx = new AudioClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(550, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (_) {}
  };

  // --- ROUTING ACTIONS ---
  const handleSiteSelection = async (site: BettingSite) => {
    setSelectedSite(site);
    setIsConnecting(true);
    setConnectionLog("Bypassing server firewalls...");

    // Selection beep sound
    try {
      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioClass) {
        const ctx = new AudioClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (_) {}

    const logs = [
      "Accessing betting network node...",
      `Routing through ${site.name} websocket channel...`,
      "Cracking seed sequence database...",
      "Syncing active multiplier vectors...",
      "Handshake OK. Access Granted!",
    ];

    let logStep = 0;
    const connectionInterval = setInterval(() => {
      if (logStep < logs.length) {
        setConnectionLog(logs[logStep]);
        logStep++;
      } else {
        clearInterval(connectionInterval);
        setIsConnecting(false);
        setScreen("PREDICTOR");
      }
    }, 550);
  };

  const handleBackToSiteSelection = () => {
    setSelectedSite(null);
    setScreen("SITE_SELECT");
    setHasVerifiedVoucher(false);
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-black">
      
      {/* ----------------- SCREEN 1: LOGIN PAGE ----------------- */}
      {screen === "LOGIN" && (
        <div id="login-view" className="flex flex-col min-h-screen justify-between bg-black relative">
          <header className="bg-red-600 w-full py-4 text-center sticky top-0 z-10 border-b border-red-700 shadow-md">
            <span className="text-white font-extrabold tracking-widest text-xs md:text-sm font-mono leading-none uppercase">
              AVIATOR PREDICTOR PRO v12.0.5 AUTH
            </span>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full py-10">
            <AviatorLogo size="md" pulse className="mb-6" />

            <div className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-6 shadow-2xl flex flex-col space-y-5">
              <div className="text-center">
                <h2 className="text-red-500 text-lg font-black tracking-tight uppercase">
                  Predictor Login
                </h2>
                <p className="text-neutral-500 text-[10px] uppercase tracking-wider mt-1">
                  Enter credentials to crack server seed
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="flex flex-col space-y-4">
                
                {/* Email field */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Email Address / User</span>
                  </label>
                  <input
                    id="login-email"
                    type="text"
                    required
                    placeholder="Enter any email or username..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-neutral-800 focus:border-red-500 focus:outline-none rounded text-white text-sm"
                  />
                </div>

                {/* Password field */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Secured Password</span>
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Enter 4-digit code (8525)..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-neutral-800 focus:border-red-500 focus:outline-none rounded text-white text-sm text-center tracking-widest font-bold"
                  />
                </div>

                {/* Error status notice */}
                {loginError && (
                  <div className="p-2.5 bg-red-950 border border-red-900 rounded text-center text-xs text-red-400 font-medium">
                    {loginError}
                  </div>
                )}

                <button
                  id="btn-login-submit"
                  type="submit"
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-extrabold uppercase tracking-wider rounded transition active:scale-95 cursor-pointer text-center"
                >
                  Verify License
                </button>

              </form>
            </div>
          </main>

          <footer className="py-4 bg-transparent text-center">
            <span className="text-neutral-800 text-[9px] font-mono select-none">
              LICENSE KEY COMPLIANT SECURED SIGN IN
            </span>
          </footer>
        </div>
      )}

      {/* ----------------- SCREEN SHARE: MANDATORY WHATSAPP SHARE ----------------- */}
      {screen === "SHARE" && (
        <div id="share-view" className="flex flex-col min-h-screen justify-between bg-black relative">
          <header className="bg-red-600 w-full py-4 text-center sticky top-0 z-10 border-b border-red-700 shadow-md">
            <span className="text-white font-extrabold tracking-widest text-xs md:text-sm font-mono leading-none uppercase">
              MANDATORY SECURITY GATEWAY - v12.0.5 SHARING REQUIREMENT
            </span>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-md mx-auto w-full py-6">
            <AviatorLogo size="md" pulse className="mb-4" />

            <div className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-5 shadow-2xl flex flex-col space-y-4">
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1.5 text-yellow-500 font-extrabold text-[11px] uppercase tracking-widest mb-1 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Activation Pending</span>
                </div>
                <h2 className="text-white text-base font-black tracking-tight uppercase">
                  SHARE TO WHATSAPP
                </h2>
                <p className="text-neutral-400 text-[10px] uppercase mt-1 leading-relaxed">
                  You must share to proceed instantly. If you do not share, your bypass credentials will expire.
                </p>
              </div>

              {/* Share Instruction Card */}
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-3.5 flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <span className="text-xs font-black text-red-500 uppercase tracking-wider block">
                    IMPORTANT DIRECTIONS:
                  </span>
                  <p className="text-[10.5px] text-gray-300 mt-1 leading-relaxed font-sans font-medium">
                    When you are redirected to WhatsApp, <strong className="text-red-400 underline">you must select and share the message to at least 2 Groups or Friends</strong>. After sharing, return immediately to this page to activate your license.
                  </p>
                </div>
              </div>

              {/* Share actions */}
              <div className="flex flex-col space-y-3">
                <button
                  id="btn-share-group-1"
                  onClick={() => {
                    const shareMessage = `TO ALL AVIATOR USSERS ! your problem is sorted here😊 do not risk your money anymore 😌 visit our site: https://aviator-predicto-ke.vercel.app/ 🫴 join this group and get your AVIATOR PREDICTOR software: https://chat.whatsapp.com/GBahjTqzBpZI4C0BRQSTbh. 🚀🚀🚀`;
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
                    window.open(whatsappUrl, "_blank");
                    setHasShared(true);
                    
                    // Notification sound cue
                    try {
                      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
                      if (AudioClass) {
                        const ctx = new AudioClass();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.frequency.setValueAtTime(600, ctx.currentTime);
                        gain.gain.setValueAtTime(0.05, ctx.currentTime);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.1);
                      }
                    } catch (_) {}
                  }}
                  className={`w-full py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer duration-200 flex items-center justify-between transition-all ${
                    hasShared 
                      ? "bg-neutral-900 border border-neutral-800 text-neutral-400" 
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-600/20 active:scale-95"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>SHARE ON WHATSAPP</span>
                  </span>
                  {hasShared ? (
                    <span className="flex items-center space-x-1 text-green-500 text-[10px] font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SHARED</span>
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded text-emerald-100 font-bold">
                      REQUIRED
                    </span>
                  )}
                </button>
              </div>

              {/* Master proceed button of the barrier */}
              <button
                id="btn-proceed-after-sharing"
                disabled={!hasShared}
                onClick={() => {
                  setScreen("SPLASH");
                }}
                className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition duration-200 flex items-center justify-center space-x-2 ${
                  hasShared
                    ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] active:scale-95 animate-pulse"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                }`}
              >
                {hasShared ? (
                  <span>🚀 ACTIVATE ENGINE & PROCEED</span>
                ) : (
                  <span>❌ COMPLETION REQUIRED TO PROCEED</span>
                )}
              </button>

            </div>
          </main>

          <footer className="py-4 bg-transparent text-center">
            <span className="text-neutral-900 text-[9px] font-mono select-none block text-center">
              SECURE DISTRIBUTION RIGHTS VERIFICATION ACTIVE
            </span>
          </footer>
        </div>
      )}

      {/* ----------------- SCREEN 2: DISCLAIMERS SPLASH (MOCKUP 1 / DESCRIPTION) ----------------- */}
      {screen === "SPLASH" && (
        <div id="splash-view" className="flex flex-col min-h-screen justify-between bg-black relative">
          
          <header className="bg-red-600 w-full py-4 text-center sticky top-0 z-10 border-b border-red-700 shadow-md">
            <span className="text-white font-extrabold tracking-widest text-xs md:text-sm font-mono leading-none uppercase">
              AVIATOR PREDICTOR PRO v12.0.5
            </span>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto py-10 w-full">
            <AviatorLogo size="lg" pulse className="mb-8" />

            <div className="flex flex-col space-y-3.5 text-center mt-4">
              <h2 className="text-[#ef4444] text-base md:text-lg font-black tracking-tight uppercase">
                This is the Original Aviator Predictor
              </h2>

              <span className="text-[#ef4444] text-sm font-black underline uppercase">
                Note
              </span>

              <ul className="text-[#ef4444] text-xs font-bold leading-relaxed space-y-2 max-w-sm">
                <li>1.The app works for only 3weeks</li>
                <li>2.Don&apos;t share●●●If you mistakenly share you will face Sever Error</li>
              </ul>
            </div>

            <div className="mt-14 flex flex-col items-center w-full">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin" strokeWidth={3} />
                <span className="absolute text-[8px] text-red-500 font-mono font-black animate-pulse">RNG</span>
              </div>
              
              <span className="text-[10px] text-gray-500 font-mono mt-3 uppercase tracking-widest text-center">
                {bootLog}
              </span>

              <div className="w-36 h-0.5 bg-neutral-900 rounded-full mt-2 overflow-hidden border border-neutral-800">
                <div
                  className="bg-red-600 h-full transition-all duration-300"
                  style={{ width: `${bootProgress}%` }}
                ></div>
              </div>
            </div>
          </main>

          <footer className="py-4 bg-transparent text-center">
            <span className="text-neutral-900 text-[10px] font-mono select-none">SYSTEMS PROTOCOLS OK</span>
          </footer>
        </div>
      )}

      {/* ----------------- SCREEN 3: SELECT BETTING SITE (MOCKUP 2 / LOBBY) ----------------- */}
      {screen === "SITE_SELECT" && !isConnecting && (
        <div id="site-select-view" className="flex flex-col min-h-screen justify-between bg-black relative">
          
          <header className="bg-red-600 w-full py-4 text-center sticky top-0 z-10 border-b border-red-700 shadow-md">
            <span className="text-white font-extrabold tracking-wider text-base uppercase leading-none">
              Choose Your Betting Site
            </span>
          </header>

          <main className="flex-1 max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center z-10 w-full">
            <h2 className="text-xl md:text-2xl font-black text-[#ef4444] uppercase tracking-wider text-center drop-shadow-[0_0_10px_rgba(239,68,68,0.3)] mb-6 select-none leading-none">
              AVIATOR PREDICTOR PRO v12.0.5
            </h2>

            <BettingSiteGrid onSelect={handleSiteSelection} />

            <div className="mt-6 flex flex-col items-center">
              <AviatorLogo size="sm" pulse />
            </div>
          </main>

          <footer className="w-full bg-red-600 py-3 px-4 text-center text-black font-semibold text-xs font-mono uppercase tracking-wide shadow-inner border-t border-red-700">
            Original Predictor License Secured • AVIATOR PREDICTOR PRO v12.0.5
          </footer>
        </div>
      )}

      {/* ----------------- SCREEN 4: CONNECTING LOADER PANEL (MOCKUP 3) ----------------- */}
      {isConnecting && selectedSite && (
        <div id="connection-overlay" className="flex flex-col min-h-screen justify-between bg-black relative">
          
          <header className="bg-red-600 w-full py-4 text-center sticky top-0 z-10 border-b border-red-700">
            <span className="text-white font-black uppercase text-xs tracking-widest leading-none">
              CONNECTING TO SECURED MATRIX
            </span>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto py-10 w-full">
            <h2 className="text-xl md:text-2xl font-black text-[#ef4444] uppercase tracking-wider text-center mb-1 font-mono leading-none">
              AVIATOR PREDICTOR PRO v12.0.5
            </h2>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center mb-8">
              {selectedSite.name.toUpperCase()} ACCELERATOR
            </p>

            <AviatorLogo size="md" pulse className="mb-10" />

            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-[#ef4444] animate-spin" strokeWidth={3} />
              
              <span className="text-[10px] text-gray-400 font-mono mt-4 uppercase tracking-widest font-bold text-center animate-pulse px-3">
                {connectionLog}
              </span>
            </div>
          </main>

          <footer className="py-4 bg-transparent text-center text-[10px] text-neutral-800 font-mono">
            WEBSOCKET ROUTER OK
          </footer>
        </div>
      )}

      {/* ----------------- SCREEN 5: THE REAL WORKSPACE PANELS ----------------- */}
      {screen === "PREDICTOR" && !isConnecting && selectedSite && (
        <PredictorWorkspace
          site={selectedSite}
          onBack={handleBackToSiteSelection}
          hasVerifiedVoucher={hasVerifiedVoucher}
          setHasVerifiedVoucher={handleSetHasVerifiedVoucher}
        />
      )}
    </div>
  );
}
