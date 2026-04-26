export type TaskCategory = "Food" | "Medical" | "Transport" | "Other" | "Critical Resource" | "Infrastructure" | "Skill-Based" | "Micro-Task";

export const urgencyColors: Record<number, string> = {
  1: "#3b82f6",
  2: "#10b981",
  3: "#f59e0b",
  4: "#f97316",
  5: "#ef4444"
};

export const categoryColors: Record<string, string> = {
  "Food": "#fbbf24",
  "Medical": "#ef4444",
  "Transport": "#3b82f6",
  "Other": "#9ca3af",
  "Critical Resource": "#ef4444",
  "Infrastructure": "#f97316", 
  "Skill-Based": "#3b82f6",
  "Micro-Task": "#10b981"
};

export const inputMethodIcons: Record<string, string> = {
  "webhook": "webhook",
  "nlp": "nlp",
  "ocr": "ocr",
  "social": "social"
};

export const tasks = [
  { 
    id: "T-001", urgency: 5, status: "Pending", title: "Medical Emergency", 
    category: "Critical Resource" as TaskCategory, inputMethod: "nlp", location: "Block C", assignedTo: "V-001",
    upvotes: 12, timestamp: new Date().toISOString(), description: "Requires immediate medical attention.",
    mapX: 28.6139, mapY: 77.209
  },
  { 
    id: "T-002", urgency: 4, status: "Pending", title: "Water Shortage", 
    category: "Food" as TaskCategory, inputMethod: "webhook", location: "Sector 7", assignedTo: null,
    upvotes: 8, timestamp: new Date(Date.now() - 3600000).toISOString(), description: "No drinking water for 2 days.",
    clusterCount: 3, mapX: 28.7139, mapY: 77.109, blockchainHash: "0x8f2a3b..."
  },
  { 
    id: "T-003", urgency: 3, status: "Verified", title: "Transport needed", 
    category: "Transport" as TaskCategory, inputMethod: "social", location: "East Zone", assignedTo: null,
    upvotes: 2, timestamp: new Date(Date.now() - 7200000).toISOString(), description: "Need transport to evacuate families.",
    mapX: 28.6239, mapY: 77.219
  },
  { 
    id: "T-004", urgency: 5, status: "Pending", title: "Urgent O2 Cylinder Delivery", 
    category: "Micro-Task" as TaskCategory, inputMethod: "webhook", location: "South Ext Hospital", assignedTo: null,
    upvotes: 45, timestamp: new Date(Date.now() - 1800000).toISOString(), description: "Drop O2 cylinder on the way to your delivery. Zero detour matched.",
    mapX: 28.5678, mapY: 77.2272
  },
  { 
    id: "T-005", urgency: 2, status: "Pending", title: "Verify structural damage", 
    category: "Micro-Task" as TaskCategory, inputMethod: "ocr", location: "Connaught Place", assignedTo: null,
    upvotes: 5, timestamp: new Date(Date.now() - 4000000).toISOString(), description: "Take a picture of the collapsed wall on your route.",
    mapX: 28.6304, mapY: 77.2177
  },
  { 
    id: "T-006", urgency: 4, status: "Pending", title: "Drop emergency food packet", 
    category: "Food" as TaskCategory, inputMethod: "nlp", location: "Lajpat Nagar", assignedTo: null,
    upvotes: 18, timestamp: new Date(Date.now() - 5000000).toISOString(), description: "Pick up food packet from community kitchen and drop it nearby.",
    mapX: 28.5677, mapY: 77.2433
  }
];

export const volunteers = [
  { id: "V-001", name: "Raj Kumar", status: "Available", isGigWorker: false, locationString: "Sector 4", location: [28.6139, 77.209], platform: "", skills: ["First Aid", "Driving"], languages: ["Hindi", "English"], vehicleType: "Bike", completedTasks: 42, matchScore: 92, karmaPoints: 1850 },
  { id: "V-002", name: "Priya Singh", status: "On Task", isGigWorker: true, platform: "Uber", locationString: "South Extension", location: [28.5678, 77.2272], skills: ["Logistics", "Heavy Lifting"], languages: ["Hindi", "Punjabi"], vehicleType: "Van", completedTasks: 18, matchScore: 78, karmaPoints: 920 },
  { id: "V-003", name: "Amit Patel", status: "Available", isGigWorker: false, platform: "", locationString: "Rohini", location: [28.7041, 77.1025], skills: ["Medical", "Translation"], languages: ["Hindi", "English", "Gujarati"], vehicleType: "Car", completedTasks: 105, matchScore: 85, karmaPoints: 5400 },
  { id: "V-004", name: "Sunita Roy", status: "Available", isGigWorker: true, platform: "Zomato", locationString: "Dawarka", location: [28.5921, 77.0460], skills: ["First Aid", "Distribution"], languages: ["Hindi", "Bengali"], vehicleType: "Scooter", completedTasks: 67, matchScore: 88, karmaPoints: 3100 },
  { id: "V-005", name: "Dev Singh", status: "Available", isGigWorker: true, platform: "Rapido", locationString: "Gurugram", location: [28.4595, 77.0266], skills: ["Driving", "First Aid"], languages: ["Hindi", "English"], vehicleType: "Bike", completedTasks: 84, matchScore: 95, karmaPoints: 2100 },
  { id: "V-006", name: "Neha Sharma", status: "Offline", isGigWorker: false, platform: "", locationString: "Noida", location: [28.5355, 77.3910], skills: ["Translation"], languages: ["Hindi", "English", "Spanish"], vehicleType: "None", completedTasks: 12, matchScore: 65, karmaPoints: 500 },
  { id: "V-007", name: "Rahul Verma", status: "On Task", isGigWorker: true, platform: "Swiggy", locationString: "Vasant Kunj", location: [28.5293, 77.1531], skills: ["Logistics"], languages: ["Hindi"], vehicleType: "Bike", completedTasks: 124, matchScore: 80, karmaPoints: 4800 },
  { id: "V-008", name: "Aisha Khan", status: "Available", isGigWorker: false, platform: "", locationString: "Okhla", location: [28.5562, 77.2764], skills: ["Medical", "Nursing"], languages: ["Hindi", "Urdu", "English"], vehicleType: "Scooter", completedTasks: 55, matchScore: 90, karmaPoints: 2600 },
];

export const karmaRecords = [
  {
    id: "K-001",
    taskTitle: "Medical Emergency Response",
    volunteerName: "Dev Singh",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    points: 150,
    redeemed: false
  },
  {
    id: "K-002",
    taskTitle: "Food Distribution - Block C",
    volunteerName: "Dev Singh",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    points: 80,
    redeemed: false
  },
  {
    id: "K-003",
    taskTitle: "Fuel Voucher Redemption",
    volunteerName: "Dev Singh",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    points: -200,
    redeemed: true,
    redemptionType: "Fuel Voucher"
  },
  {
    id: "K-004",
    taskTitle: "Elderly Care Transport",
    volunteerName: "Dev Singh",
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    points: 120,
    redeemed: false
  }
];

export const blockchainRecords = [
  {
    id: "R-001",
    taskTitle: "Medical Emergency",
    verificationStatus: "Verified",
    hash: "0x8f2a3b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1",
    donorVisible: true,
    volunteerName: "Raj Kumar",
    gpsMetadata: "28.6139° N, 77.2090° E",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    photo: true,
  },
  {
    id: "R-002",
    taskTitle: "Food Delivery",
    verificationStatus: "Verified",
    hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
    donorVisible: true,
    volunteerName: "Priya Singh",
    gpsMetadata: "28.5678° N, 77.2272° E",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    photo: true,
  },
  {
    id: "R-003",
    taskTitle: "Transport to Hospital",
    verificationStatus: "Pending",
    hash: "0x0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a",
    donorVisible: false,
    volunteerName: "Amit Patel",
    gpsMetadata: "28.7041° N, 77.1025° E",
    timestamp: new Date().toISOString(),
    photo: false,
  }
];
