import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { Volunteer } from '../models/Volunteer.js';
import { Transaction } from '../models/Transaction.js';

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("MongoDB is not connected. Skipping seed.");
      return;
    }
    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      console.log("Seeding Database...");
      await Task.insertMany([
      { title: "Surplus Food Pickup", category: "Resource", urgency: 4, location: [28.6139, 77.2090], status: "pending", txHash: "0x12a3f...4b8e", karma: 150 },
      { title: "Medical Supplies Delivery", category: "Medical", urgency: 5, location: [28.5355, 77.3910], status: "dispatched", txHash: "0x89c4d...e12a", karma: 300 },
      { title: "Transport Elderly Patients", category: "Transport", urgency: 3, location: [28.7041, 77.1025], status: "completed", txHash: "0x3f5b...9a8c", karma: 50 },
      { title: "Warehouse Volunteer", category: "Logistics", urgency: 2, location: [28.59, 77.3], status: "pending", txHash: null, karma: 75 }
    ]);

    await Volunteer.insertMany([
      { name: "Rahul S.", skills: ["Driving", "First Aid"], matchScore: 94, status: "Available", location: [28.6, 77.2], isGigWorker: true },
      { name: "Priya M.", skills: ["Medical", "Hindi"], matchScore: 88, status: "Busy", location: [28.61, 77.21], isGigWorker: false },
      { name: "Amit K.", skills: ["Local Knowledge"], matchScore: 72, status: "Offline", location: [28.55, 77.3], isGigWorker: false }
    ]);

    await Transaction.insertMany([
      { type: "earn", action: "Medical Delivery to Sector 4", date: "Today, 14:30", points: "+150 KRM" },
      { type: "earn", action: "Logistics Coordination", date: "Yesterday", points: "+50 KRM" },
      { type: "spend", action: "Redeemed: Grocery Voucher", date: "Oct 12", points: "-500 KRM" },
      { type: "earn", action: "Translation Services", date: "Oct 10", points: "+100 KRM" }
    ]);
  }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
