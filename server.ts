import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
// Import Server Modules
import { connectDB } from "./server/config/db.js";
import { taskRouter } from "./server/routes/tasks.js";
import { seedDatabase } from "./server/config/seed.js";
import "./server/queue/worker.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  await connectDB();
  await seedDatabase();

  const app = express();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: "*" }
  });

  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Socket.io WebSockets
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Attach io to req for use in routes if needed
  app.use((req, res, next) => {
    (req as any).io = io;
    next();
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/tasks", (req, res, next) => {
    if (req.method === 'GET') {
      import("mongoose").then(m => {
        const mongoose = m.default || m;
        if (mongoose.connection.readyState !== 1) {
          return res.json([
            { _id: "1", title: "Surplus Food Pickup", category: "Resource", urgency: 4, location: [28.6139, 77.2090], status: "pending", karma: 150 },
            { _id: "2", title: "Medical Supplies Delivery", category: "Medical", urgency: 5, location: [28.5355, 77.3910], status: "dispatched", karma: 300 },
            { _id: "3", title: "Emergency Blood Delivery", category: "Medical", urgency: 5, location: [28.6200, 77.1500], status: "pending", karma: 400 },
            { _id: "4", title: "Transport Elderly Patients", category: "Transport", urgency: 2, location: [28.5800, 77.2500], status: "pending", karma: 100 },
            { _id: "5", title: "Blanket Distribution", category: "Resource", urgency: 3, location: [28.6500, 77.2300], status: "pending", karma: 200 },
            { _id: "6", title: "Rescue Operation Aid", category: "Crisis", urgency: 5, location: [28.7000, 77.1000], status: "dispatched", karma: 500 },
            { _id: "7", title: "Community Kitchen Relief", category: "Resource", urgency: 3, location: [28.5500, 77.1800], status: "pending", karma: 150 },
            { _id: "8", title: "Medicine Restock", category: "Medical", urgency: 4, location: [28.6800, 77.2800], status: "pending", karma: 250 },
            { _id: "9", title: "Water Tanker Coordination", category: "Resource", urgency: 4, location: [28.6300, 77.1200], status: "pending", karma: 200 },
            { _id: "10", title: "Volunteer Relief Check", category: "Admin", urgency: 1, location: [28.5900, 77.2100], status: "pending", karma: 50 },
          ]);
        }
        next();
      });
    } else {
      next();
    }
  }, taskRouter);

  app.get("/api/volunteers", async (req, res) => {
    const m = await import("mongoose");
    const mongoose = m.default || m;
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        { _id: "1", name: "Rahul S.", skills: ["Driving", "First Aid"], matchScore: 94, status: "Available", location: [28.6050, 77.2000], isGigWorker: true },
        { _id: "2", name: "Priya M.", skills: ["Medical", "Hindi"], matchScore: 88, status: "Busy", location: [28.6150, 77.2150], isGigWorker: false },
        { _id: "3", name: "Amit K.", skills: ["Logistics"], matchScore: 75, status: "Available", location: [28.6250, 77.1900], isGigWorker: true },
        { _id: "4", name: "Neha R.", skills: ["Teaching"], matchScore: 60, status: "Offline", location: [28.5950, 77.2200], isGigWorker: false },
        { _id: "5", name: "Vikram J.", skills: ["Driving"], matchScore: 82, status: "Available", location: [28.6350, 77.1850], isGigWorker: true },
        { _id: "6", name: "Anjali D.", skills: ["First Aid", "Food Dist"], matchScore: 91, status: "Available", location: [28.5850, 77.2350], isGigWorker: false },
        { _id: "7", name: "Sunil T.", skills: ["Transport"], matchScore: 85, status: "Busy", location: [28.6450, 77.2050], isGigWorker: true },
        { _id: "8", name: "Kirti S.", skills: ["Medical", "Counseling"], matchScore: 95, status: "Available", location: [28.6550, 77.2450], isGigWorker: false },
      ]);
    }
    const { Volunteer } = await import("./server/models/Volunteer.js");
    const vols = await Volunteer.find();
    res.json(vols);
  });

  app.get("/api/transactions", async (req, res) => {
    const m = await import("mongoose");
    const mongoose = m.default || m;
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        { id: 1, type: "earn", action: "Medical Delivery to Sector 4", date: "Today, 14:30", points: "+150 KRM" },
        { id: 2, type: "spend", action: "Redeemed: Grocery Voucher", date: "Oct 12", points: "-500 KRM" }
      ]);
    }
    const { Transaction } = await import("./server/models/Transaction.js");
    const tx = await Transaction.find();
    res.json(tx);
  });

  app.get("/api/bounties", async (req, res) => {
    const m = await import("mongoose");
    const mongoose = m.default || m;
    if (mongoose.connection.readyState !== 1) {
      return res.json([
         { id: 1, title: "Pickup 30 surplus meals", location: "Kareem's Restaurant, Sector 2", drop: "Shelter Home, Sector 4", distance: "2.1 km detour", karma: 150, urgency: "high", time: "Expires in 45m" }
      ]);
    }
    // For demo purposes, we will fetch standard pending tasks and map them
    const { Task } = await import("./server/models/Task.js");
    const tasks = await Task.find({ status: "pending" });
    const mapped = tasks.map((t, idx) => ({
      id: t._id,
      title: t.title,
      location: `Lat ${t.location[0]}, Lng ${t.location[1]}`,
      drop: "Distribution Center", // mock
      distance: (Math.random() * 5).toFixed(1) + " km detour",
      karma: t.karma || 100,
      urgency: t.urgency > 3 ? "high" : "low",
      time: "Expires in 45m"
    }));
    res.json(mapped);
  });

  app.get("/api/latestTasks", async (req, res) => {
    const m = await import("mongoose");
    const mongoose = m.default || m;
    if (mongoose.connection.readyState !== 1) {
      return res.json([
        { id: "0x12aF...9c4B", title: "Sector 4 Relief Drop", status: "Logged on Polygon", time: "10 mins ago", explorer: "#" },
        { id: "0x89bE...3f1A", title: "Medical Supplies Route C", status: "Logged on Polygon", time: "2 hours ago", explorer: "#" },
      ]);
    }
    const { Task } = await import("./server/models/Task.js");
    const tasks = await Task.find().sort({ createdAt: -1 }).limit(10);
    const mapped = tasks.map((t, idx) => ({
      id: t.txHash || t._id.toString(),
      title: t.title,
      status: "Logged on Polygon",
      time: idx === 0 ? "10 mins ago" : `${idx + 2} hours ago`,
      explorer: "#"
    }));
    res.json(mapped);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
