/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ChevronLeft, Loader2, KeyRound } from "lucide-react";
import { BettingSite } from "../types";
import { AviatorLogo } from "./AviatorLogo";

interface PredictorWorkspaceProps {
  site: BettingSite;
  onBack: () => void;
  hasVerifiedVoucher: boolean;
  setHasVerifiedVoucher: (val: boolean) => void;
}

export const PredictorWorkspace: React.FC<PredictorWorkspaceProps> = ({
  site,
  onBack,
  hasVerifiedVoucher,
  setHasVerifiedVoucher,
}) => {
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Voucher states
  const [voucherInput, setVoucherInput] = useState<string>("");
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  // Redirection Link
  const messageText = `╔══════════════════════╗
║ ⚡ HELLO YOBBY AM HERE FOR AVIATOR PREDATOR VOUCHER CODE ║
╚══════════════════════╝`;
  const whatsappUrl = `https://wa.me/254739320033?text=${encodeURIComponent(messageText)}`;

  // Handle Voucher Submission
  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanVoucher = voucherInput.trim();

    if (cleanVoucher === "SELIKI2612") {
      setHasVerifiedVoucher(true);
      setVoucherError(null);
      // Nice sound cue if browser allows
      try {
        const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioClass) {
          const ctx = new AudioClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        }
      } catch (_) {}
    } else {
      setVoucherError("The voucher code is invalid, get one from the developer");
      setIsRedirecting(true);

      // Trigger automatic redirection to WhatsApp after 2.5 seconds
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        setIsRedirecting(false);
      }, 2500);
    }
  };

  // Trigger simulated prediction
  const handleGetPrediction = () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setMultiplier(null);

    // Beep sound start
    try {
      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioClass) {
        const ctx = new AudioClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (_) {}

    // Simulate 3 seconds calculating
    setTimeout(() => {
      // Premium probability roll
      const roll = Math.random();
      let targetMult = 1.0;
      if (roll < 0.1) {
        targetMult = 1.01 + Math.random() * 0.15;
      } else if (roll < 0.6) {
        targetMult = 1.22 + Math.random() * 1.5;
      } else if (roll < 0.85) {
        targetMult = 2.8 + Math.random() * 6.0;
      } else {
        targetMult = 9.0 + Math.random() * 45.0;
      }

      setMultiplier(parseFloat(targetMult.toFixed(2)));
      setIsGenerating(false);

      // Beep success high note
      try {
        const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioClass) {
          const ctx = new AudioClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(950, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        }
      } catch (_) {}
    }, 2800);
  };

  return (
    <div id="predictor-workspace" className="w-full flex flex-col min-h-screen bg-black text-white relative">
      {/* Dynamic site selected and back button header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-red-950 bg-neutral-900/90 backdrop-blur sticky top-0 z-40">
        <button
          id="btn-back-to-lobby"
          onClick={onBack}
          className="flex items-center space-x-1 px-3 py-1.5 bg-neutral-800 text-gray-300 hover:text-white rounded-lg text-sm border border-neutral-700 hover:border-red-600 cursor-pointer duration-200"
        >
          <ChevronLeft className="w-4 h-4 text-red-500" />
          <span>Lobby</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-red-500 font-mono font-bold tracking-widest uppercase">
            ● BYPASS ACTIVE
          </span>
          <h1 className="text-sm font-semibold text-gray-200 tracking-tight uppercase">
            {site.name} Predictor
          </h1>
        </div>

        <div className="w-16"></div> {/* spacer */}
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        
        {/* VOUCHER VALIDATION BARRIER */}
        {!hasVerifiedVoucher ? (
          <div id="voucher-screen" className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-6 shadow-2xl flex flex-col space-y-4 animate-[fade-in_0.3s_ease-out]">
            <div className="flex items-center space-x-2 text-red-500 font-black tracking-tight text-sm uppercase">
              <KeyRound className="w-4 h-4" />
              <span>Voucher Code Key Required</span>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Before calculating predicting vectors for <strong className="text-white uppercase">{site.name}</strong>, you must authenticate authorization using a master Voucher Code.
            </p>

            <form onSubmit={handleVoucherSubmit} className="flex flex-col space-y-3">
              <input
                id="voucher-input"
                type="text"
                placeholder="Enter Voucher Code..."
                value={voucherInput}
                onChange={(e) => {
                  setVoucherInput(e.target.value);
                  setVoucherError(null);
                }}
                className="w-full px-3 py-2.5 bg-black border border-neutral-800 focus:border-red-500 focus:outline-none rounded text-center font-mono uppercase tracking-widest text-white text-sm"
              />

              <button
                id="voucher-btn-verify"
                type="submit"
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-sm font-extrabold uppercase tracking-wider rounded cursor-pointer transition active:scale-95 text-center"
              >
                Unlock Predictor Engine
              </button>
            </form>

            {/* Error messaging and Automatic WhatsApp navigation */}
            {voucherError && (
              <div className="p-3 bg-red-950/40 border border-red-900 rounded text-center text-xs text-red-400 flex flex-col items-center space-y-3">
                <p className="font-semibold leading-relaxed">{voucherError}</p>
                {isRedirecting && (
                  <span className="text-[10px] text-yellow-500 font-mono animate-pulse uppercase">
                    Redirecting to Developer on WhatsApp...
                  </span>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-full hover:bg-emerald-700 decoration-none inline-block shadow active:scale-95 transition"
                >
                  Contact Yobby on WhatsApp
                </a>
              </div>
            )}
          </div>
        ) : (
          
          /* ACTIVE PREDICTOR WORKSPACE PANEL */
          <div id="predictor-hud" className="w-full flex flex-col items-center space-y-8 py-4">
            
            {/* The Plane Wing Area */}
            <div className="relative flex items-center justify-center p-6 bg-neutral-950/80 rounded-full border border-neutral-900 shadow-3xl min-h-[160px] min-w-[160px]">
              <div className="absolute inset-0 bg-red-600/5 rounded-full blur-xl pointer-events-none"></div>
              <AviatorLogo size="lg" pulse={isGenerating} />
            </div>

            {/* Simulated Prediction Multiplier - Directly BELOW plane */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase mb-1">
                Predicted Alt Multiplier
              </span>

              <div className="flex items-center justify-center min-h-[80px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase animate-pulse">
                      Crashing Seed seed...
                    </span>
                  </div>
                ) : multiplier !== null ? (
                  <span className="text-6xl md:text-7xl font-black text-[#ef4444] font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,1)] transform scale-110 leading-none">
                    {multiplier.toFixed(2)}x
                  </span>
                ) : (
                  <span className="text-4xl font-extrabold text-neutral-700 font-mono italic">
                    --- x
                  </span>
                )}
              </div>
            </div>

            {/* GET PREDICTION Button */}
            <div className="w-full max-w-xs flex flex-col items-center">
              <button
                id="btn-get-prediction"
                onClick={handleGetPrediction}
                disabled={isGenerating}
                className="w-full py-4 px-6 bg-[#ef4444] hover:bg-[#dc2626] disabled:bg-neutral-800 text-white font-extrabold text-base rounded-xl shadow-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transform active:scale-95 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed text-center uppercase tracking-wider"
              >
                Get Prediction
              </button>
            </div>

            {/* Custom note to provide nice instructions */}
            <div className="text-[10px] text-gray-400 text-center font-mono leading-relaxed max-w-xs border-t border-neutral-900 pt-4">
              AVIATOR PREDICTOR PRO v12.0.5 SECURE ENGINE • LICENSE ACTIVE
            </div>

          </div>
        )}
      </main>
    </div>
  );
};
