/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BettingSite } from "../types";

const SITES: BettingSite[] = [
  { id: "betway", name: "betway", logoBg: "bg-black", textColor: "text-white", styleType: "betway" },
  { id: "lottostar", name: "lottostar", logoBg: "bg-[#1f2024]", textColor: "text-white", styleType: "lottostar" },
  { id: "msport", name: "M.SPORT", logoBg: "bg-[#ffd400]", textColor: "text-black", styleType: "msport" },
  { id: "pinup", name: "Pin-Up.bet", logoBg: "bg-[#181a20]", textColor: "text-white", styleType: "pinup" },
  { id: "betking", name: "BetKing", logoBg: "bg-[#000540]", textColor: "text-[#00ffcc]", styleType: "betking" },
  { id: "superbet", name: "superbet", logoBg: "bg-[#e21a22]", textColor: "text-white", styleType: "superbet" },
  { id: "onewin", name: "1win", logoBg: "bg-[#0b121c]", textColor: "text-white", styleType: "onewin" },
  { id: "hollywood", name: "HOLLYWOOD bets", logoBg: "bg-[#330066]", textColor: "text-white", styleType: "hollywood" },
  { id: "onexbet", name: "1XBET", logoBg: "bg-[#0c192d]", textColor: "text-white", styleType: "one_xbet" },
  { id: "sportybet", name: "SportyBet", logoBg: "bg-[#121212]", textColor: "text-[#e41e26]", styleType: "sportybet" },
  { id: "melbet", name: "MELBET", logoBg: "bg-[#252525]", textColor: "text-[#ffbc00]", styleType: "melbet" },
  { id: "premier", name: "PREMIER Bet", logoBg: "bg-[#006e3a]", textColor: "text-white", styleType: "premier" },
  { id: "odibets", name: "OdiBets", logoBg: "bg-[#39b54a]", textColor: "text-white", styleType: "odibets" },
  { id: "wezabet", name: "Wezabet", logoBg: "bg-[#090b0c]", textColor: "text-white", styleType: "wezabet" },
  { id: "betika", name: "Betika", logoBg: "bg-[#ffd200]", textColor: "text-black", styleType: "betika" },
  { id: "bangbet", name: "BangBet", logoBg: "bg-[#fbcb02]", textColor: "text-black", styleType: "bangbet" },
];

interface BettingSiteGridProps {
  onSelect: (site: BettingSite) => void;
}

export const BettingSiteGrid: React.FC<BettingSiteGridProps> = ({ onSelect }) => {
  const renderLogo = (site: BettingSite) => {
    switch (site.styleType) {
      case "betway":
        return (
          <div className="flex items-center justify-center font-sans tracking-tight py-4">
            <span className="text-3xl font-extrabold text-white lowercase">bet</span>
            <span className="text-3xl font-light text-[#00ff00] lowercase">way</span>
          </div>
        );

      case "lottostar":
        return (
          <div className="flex items-center justify-center space-x-1 py-4 font-sans uppercase">
            <span className="text-2xl font-semibold tracking-wide text-[#33e6ff]">lotto</span>
            <span className="text-2xl font-bold italic text-white flex items-center">
              star
              <span className="text-yellow-400 ml-1 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] text-xl">★</span>
            </span>
          </div>
        );

      case "msport":
        return (
          <div className="flex flex-col items-center justify-center py-3 font-sans font-black italic tracking-tighter">
            <div className="flex items-center space-x-0.5">
              <span className="text-2xl text-black">M.</span>
              <span className="text-2xl text-[#123078]">SPORT</span>
            </div>
            <span className="text-[9px] font-bold text-gray-800 tracking-widest leading-none">MOB-SPEED-MORE</span>
          </div>
        );

      case "pinup":
        return (
          <div className="flex items-center justify-center space-x-1.5 py-4">
            <span className="text-2xl font-bold tracking-tight text-[#ff3366] italic font-serif">Pin-Up</span>
            <span className="px-1.5 py-0.5 bg-[#00e5ff] text-black font-extrabold text-[11px] rounded tracking-wide uppercase">
              .bet
            </span>
          </div>
        );

      case "betking":
        return (
          <div className="flex flex-col items-center justify-center py-2.5 font-sans relative">
            <span className="text-amber-400 text-xs animate-bounce select-none">👑</span>
            <div className="flex items-center space-x-0.5">
              <span className="text-xl font-black text-white uppercase italic">Bet</span>
              <span className="text-xl font-black text-[#ffd700] uppercase italic">King</span>
            </div>
          </div>
        );

      case "superbet":
        return (
          <div className="flex items-center justify-center space-x-1 py-4 font-serif">
            <span className="text-3xl font-extrabold text-white tracking-widest lowercase">super</span>
            <span className="text-2xl font-medium text-red-100 uppercase italic bg-white/20 px-1 rounded">bet</span>
          </div>
        );

      case "onewin":
        return (
          <div className="flex items-center justify-center space-x-0.5 py-4">
            <span className="text-3xl font-black text-[#3498db] tracking-tighter">1</span>
            <span className="text-3xl font-extrabold text-white tracking-tight italic">win</span>
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping ml-1 self-start mt-3"></div>
          </div>
        );

      case "hollywood":
        return (
          <div className="flex flex-col items-center justify-center py-3.5 leading-none font-sans">
            <div className="flex items-center space-x-1 text-[#ffcc00] font-sans text-[11px] uppercase tracking-wider">
              <span>★</span>
              <span>HOLLYWOOD</span>
              <span>★</span>
            </div>
            <span className="text-2xl font-bold font-serif text-white italic">bets</span>
          </div>
        );

      case "one_xbet":
        return (
          <div className="flex items-center justify-center space-x-0.5 py-4 font-sans tracking-tighter">
            <span className="text-2xl font-black text-[#00aaff]">1X</span>
            <span className="text-2xl font-extrabold text-white">BET</span>
          </div>
        );

      case "sportybet":
        return (
          <div className="flex flex-col items-center justify-center py-3 font-sans tracking-tight">
            <span className="text-2xl font-black text-[#e41e26] italic">SportyBet</span>
            <span className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
              Redefining Sports
            </span>
          </div>
        );

      case "melbet":
        return (
          <div className="flex items-center justify-center space-x-1 py-4 font-sans">
            <span className="text-2xl font-black text-white italic tracking-tighter uppercase">MEL</span>
            <span className="text-2xl font-black text-[#ffbc00] italic tracking-tighter uppercase">BET</span>
          </div>
        );

      case "premier":
        return (
          <div className="flex flex-col items-center justify-center py-3 font-serif">
            <span className="text-xl font-extrabold text-[#ffd700] uppercase tracking-wide italic">PREMIER</span>
            <div className="flex items-center space-x-1 mt-0.5 text-xs font-sans tracking-wider text-white">
              <span className="bg-amber-500 rounded px-1.5 py-0.5 font-extrabold text-[10px] text-green-900">
                BET
              </span>
            </div>
          </div>
        );

      case "odibets":
        return (
          <div className="flex flex-col items-center justify-center py-1 font-sans">
            <span className="text-4xl font-extrabold text-white tracking-widest lowercase leading-none select-none">
              odi
            </span>
            <span className="text-xs font-black text-[#f1f509] uppercase tracking-widest leading-none mt-1 select-none">
              BETS
            </span>
          </div>
        );

      case "wezabet":
        return (
          <div className="flex items-center justify-center py-4 font-sans tracking-tight">
            <span className="text-2xl font-black text-[#a6ff00] italic uppercase mr-0.5 select-none text-shadow-glow">
              WEZA
            </span>
            <span className="bg-[#a6ff00] text-black px-1.5 py-0.5 text-[9px] font-black tracking-widest uppercase rounded leading-none select-none">
              BET
            </span>
          </div>
        );

      case "betika":
        return (
          <div className="flex flex-col items-center justify-center py-2 font-sans">
            <span className="text-3xl font-black text-[#0f2d6e] tracking-tight italic select-none leading-none drop-shadow-[1px_1px_0_rgba(255,255,255,0.8)]">
              Betika<span className="text-red-500 font-extrabold">!</span>
            </span>
            <span className="text-[9px] font-bold text-[#0f2d6e] uppercase tracking-widest leading-none mt-1 select-none">
              .com
            </span>
          </div>
        );

      case "bangbet":
        return (
          <div className="flex items-center justify-center py-4 space-x-1 font-sans">
            <span className="text-xl font-black text-black tracking-tight uppercase select-none">
              BANG
            </span>
            <svg className="w-5 h-5 text-[#2ca521] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] flex-shrink-0" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" />
            </svg>
            <span className="text-xl font-black text-black tracking-tight uppercase select-none">
              BET
            </span>
          </div>
        );

      default:
        return <span className="text-xl font-bold tracking-wider">{site.name}</span>;
    }
  };

  return (
    <div id="betting-site-grid" className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-sm mx-auto p-2">
      {SITES.map((site) => (
        <button
          key={site.id}
          id={`site-btn-${site.id}`}
          onClick={() => onSelect(site)}
          className={`group flex flex-col justify-center rounded-lg ${site.logoBg} ${site.textColor} border-2 border-neutral-800 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 transform active:scale-95 text-center cursor-pointer min-h-[76px] overflow-hidden p-2`}
        >
          {renderLogo(site)}
        </button>
      ))}
    </div>
  );
};
