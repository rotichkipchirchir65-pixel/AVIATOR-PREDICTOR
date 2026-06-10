/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppScreen = "LOGIN" | "SHARE" | "SPLASH" | "SITE_SELECT" | "PREDICTOR";

export interface BettingSite {
  id: string;
  name: string;
  logoBg: string; // Background class/style
  textColor: string; // Text color class
  styleType:
    | "betway"
    | "lottostar"
    | "msport"
    | "pinup"
    | "betking"
    | "superbet"
    | "onewin"
    | "hollywood"
    | "one_xbet"
    | "sportybet"
    | "melbet"
    | "premier"
    | "odibets"
    | "wezabet"
    | "betika"
    | "bangbet";
}

export interface SyncSession {
  pin: string;
  lastActive: number;
  currentSite: string | null;
  screenState: AppScreen;
  prediction: {
    multiplier: number | null;
    isGenerating: boolean;
    timeGenerated: number | null;
    history: number[];
  };
}

export interface ClientSyncState {
  role: "SOLO" | "HOST" | "CLIENT";
  pin: string | null;
  status: "disconnected" | "connecting" | "connected" | "error";
  errorMessage: string | null;
}
