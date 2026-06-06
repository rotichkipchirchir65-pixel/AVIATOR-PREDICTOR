import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

// Support ESM __dirname equivalents safely
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SyncSession {
  pin: string;
  lastActive: number;
  currentSite: string | null;
  screenState: "SPLASH" | "SITE_SELECT" | "PREDICTOR";
  prediction: {
    multiplier: number | null;
    isGenerating: boolean;
    timeGenerated: number | null;
    history: number[];
  };
}

// In-Memory storage for sync sessions
const sessionsObject = new Map<string, SyncSession>();

// Cleanup helper to keep memory footprint flat (evict sessions older than 30 mins)
setInterval(() => {
  const now = Date.now();
  for (const [pin, session] of sessionsObject.entries()) {
    if (now - session.lastActive > 30 * 60 * 1000) {
      sessionsObject.delete(pin);
    }
  }
}, 5 * 60 * 1000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Create a new synchronization session/room
  app.post("/api/sync/create", (req, res) => {
    let pinStr = "";
    // Ensure uniqueness
    for (let attempts = 0; attempts < 10; attempts++) {
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      if (!sessionsObject.has(generated)) {
        pinStr = generated;
        break;
      }
    }
    if (!pinStr) {
      pinStr = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const newSession: SyncSession = {
      pin: pinStr,
      lastActive: Date.now(),
      currentSite: null,
      screenState: "SPLASH",
      prediction: {
        multiplier: null,
        isGenerating: false,
        timeGenerated: null,
        history: [1.84, 4.25, 1.12, 12.05, 2.50, 1.05],
      },
    };

    sessionsObject.set(pinStr, newSession);
    res.json({ success: true, pin: pinStr, session: newSession });
  });

  // Join an existing synchronisation session
  app.post("/api/sync/join", (req, res) => {
    const { pin } = req.body;
    if (!pin) {
      res.status(400).json({ error: "PIN is required" });
      return;
    }
    const cleanPin = pin.toString().trim();
    const session = sessionsObject.get(cleanPin);
    if (!session) {
      res.status(404).json({ error: "Active session not found. Please verify the 6-digit PIN." });
      return;
    }
    session.lastActive = Date.now();
    res.json({ success: true, session });
  });

  // Update a sync session state
  app.post("/api/sync/update", (req, res) => {
    const { pin, currentSite, screenState, prediction } = req.body;
    if (!pin) {
      res.status(400).json({ error: "PIN is required" });
      return;
    }
    const cleanPin = pin.toString().trim();
    const session = sessionsObject.get(cleanPin);
    if (!session) {
      res.status(404).json({ error: "Active session not found" });
      return;
    }

    session.lastActive = Date.now();
    if (currentSite !== undefined) session.currentSite = currentSite;
    if (screenState !== undefined) session.screenState = screenState;
    if (prediction !== undefined) {
      session.prediction = {
        ...session.prediction,
        ...prediction,
      };
    }

    res.json({ success: true, session });
  });

  // Query status of session
  app.get("/api/sync/status/:pin", (req, res) => {
    const { pin } = req.params;
    const cleanPin = pin ? pin.trim() : "";
    const session = sessionsObject.get(cleanPin);
    if (!session) {
      res.status(404).json({ error: "Active session not found" });
      return;
    }
    session.lastActive = Date.now();
    res.json({ success: true, session });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
