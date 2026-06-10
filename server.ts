import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { Jimp } from "jimp";

// Support ESM __dirname equivalents safely
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to generate missing high-quality PWA icons dynamically on server boot
async function ensurePwaIconsExist() {
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sizes = [192, 512];
  for (const size of sizes) {
    const filename = `icon-${size}.png`;
    const outputPath = path.join(publicDir, filename);
    
    // Skip if already generated to make boot times instant
    if (fs.existsSync(outputPath)) {
      continue;
    }

    try {
      console.log(`[PWA Icon Generator] Auto-creating brand asset: ${filename}...`);
      const image = new Jimp({ width: size, height: size, color: 0x000000ff });

      const centerX = size / 2;
      const centerY = size / 2;
      const maxRadius = size * 0.45;

      // Draw glowing radial gradient
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxRadius) {
            const glowFactor = 1 - (dist / maxRadius);
            const intensity = Math.pow(glowFactor, 2.2);
            
            const r = Math.round(239 * intensity);
            const g = Math.round(68 * intensity * 0.2);
            const b = Math.round(68 * intensity * 0.2);
            
            const rgbaColor = ((r << 24) | (g << 16) | (b << 8) | 255) >>> 0;
            image.setPixelColor(rgbaColor, x, y);
          }
        }
      }

      const scale = size / 512;
      
      // Paint radar scanner rings
      for (let angle = 0; angle < 360; angle += 1.5) {
        const rad = angle * Math.PI / 180;
        const rx = Math.round(centerX + Math.cos(rad) * 115 * scale);
        const ry = Math.round(centerY + Math.sin(rad) * 115 * scale);
        if (rx >= 0 && rx < size && ry >= 0 && ry < size) {
          if (angle % 6 < 3) {
            image.setPixelColor(0xef444455, rx, ry);
          }
        }
      }

      // Draw stylized aviation delta wing fuselage
      const noseX = centerX + 80 * scale;
      const noseY = centerY - 80 * scale;
      const tailX = centerX - 60 * scale;
      const tailY = centerY + 60 * scale;

      // Draw flight line
      for (let t = 0; t <= 1; t += 0.005) {
        const px = tailX + (noseX - tailX) * t;
        const py = tailY + (noseY - tailY) * t;
        const rSize = Math.max(1, Math.round(5 * scale));
        for (let iy = -rSize; iy <= rSize; iy++) {
          for (let ix = -rSize; ix <= rSize; ix++) {
            const cx = Math.round(px + ix);
            const cy = Math.round(py + iy);
            if (cx >= 0 && cx < size && cy >= 0 && cy < size) {
              image.setPixelColor(0xff4433ff, cx, cy);
            }
          }
        }
      }

      // Draw perpendicular wings
      const wingLX = centerX - 75 * scale;
      const wingLY = centerY - 15 * scale;
      const wingRX = centerX + 15 * scale;
      const wingRY = centerY + 75 * scale;

      for (let t = 0; t <= 1; t += 0.005) {
        const px = wingLX + (wingRX - wingLX) * t;
        const py = wingRY + (wingRY - wingLY) * t;
        const rSize = Math.max(1, Math.round(11 * scale));
        for (let iy = -rSize; iy <= rSize; iy++) {
          for (let ix = -rSize; ix <= rSize; ix++) {
            const cx = Math.round(px + ix);
            const cy = Math.round(py + iy);
            if (cx >= 0 && cx < size && cy >= 0 && cy < size) {
              image.setPixelColor(0xef4444ff, cx, cy);
            }
          }
        }
      }

      // Draw cockpit shines
      const rSize = Math.max(1, Math.round(4 * scale));
      for (let iy = -rSize; iy <= rSize; iy++) {
        for (let ix = -rSize; ix <= rSize; ix++) {
          const cx = Math.round(centerX + 30 * scale + ix);
          const cy = Math.round(centerY - 30 * scale + iy);
          if (cx >= 0 && cx < size && cy >= 0 && cy < size) {
            image.setPixelColor(0xffffffff, cx, cy);
          }
        }
      }

      await image.write(outputPath as any);
      console.log(`[PWA Icon Generator] Successfully generated asset: ${filename}`);
    } catch (iconErr) {
      console.error(`[PWA Icon Generator] Failed to draw PWA asset ${filename}:`, iconErr);
    }
  }
}


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
  // Ensure default brand assets exist
  await ensurePwaIconsExist();

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
