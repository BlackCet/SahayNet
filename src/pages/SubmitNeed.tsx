import { useState } from "react";
import React from "react";
import { Link2, MessageSquare, Camera, Send, Check, Cpu, Upload, Globe, ChevronRight } from "lucide-react";

type Tab = "webhook" | "nlp" | "ocr";

interface ParsedEntity {
  item: string;
  quantity: string;
  location: string;
  urgency: string;
  language?: string;
}

function WebhookForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    source: "KoboToolbox",
    location: "",
    lat: "",
    lng: "",
    category: "Critical Resource",
    urgency: "3",
    description: "",
    contact: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
          <Check size={28} className="text-green-400" />
        </div>
        <div className="text-center">
          <h3 className="text-white">Webhook Payload Ingested</h3>
          <p className="text-sm text-slate-400 mt-1">Task ID <span className="text-blue-400 font-mono">T-011</span> created and queued for AI triage</p>
        </div>
        <div className="bg-[#070b14] border border-[#1a2540] rounded-xl p-4 w-full max-w-md font-mono text-xs text-green-400">
          <div className="text-slate-500 mb-2">{"// Structured JSON payload:"}</div>
          <div>{`{`}</div>
          <div className="pl-4">{`"id": "T-011",`}</div>
          <div className="pl-4">{`"source": "${form.source}",`}</div>
          <div className="pl-4">{`"category": "${form.category}",`}</div>
          <div className="pl-4">{`"location": { "type": "Point", "coordinates": [${form.lng || "72.88"}, ${form.lat || "19.07"}] },`}</div>
          <div className="pl-4">{`"urgency": ${form.urgency},`}</div>
          <div className="pl-4">{`"description": "${form.description || "Community need reported"}",`}</div>
          <div className="pl-4">{`"status": "Pending",`}</div>
          <div className="pl-4">{`"timestamp": "${new Date().toISOString()}"`}</div>
          <div>{`}`}</div>
        </div>
        <button onClick={() => setSubmitted(false)} className="text-sm text-blue-400 hover:text-blue-300">Submit another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <Link2 size={16} className="text-blue-400 mt-0.5 shrink-0" />
        <div className="text-sm text-slate-300">
          Large NGOs using <span className="text-blue-400">ODK</span> or <span className="text-blue-400">KoboToolbox</span> can point their webhook to our API endpoint. JSON payloads are ingested automatically whenever field workers sync to Wi-Fi.
          <div className="mt-2 font-mono text-xs text-slate-500 bg-[#070b14] rounded-lg p-2 border border-[#1a2540]">
            POST https://api.sahaynet.io/v1/ingest/webhook
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 mb-1 block" style={{ letterSpacing: "0.08em" }}>DATA SOURCE</label>
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="w-full text-sm bg-[#070b14] border border-[#1a2540] rounded-lg text-white py-2.5 px-3 focus:outline-none focus:border-blue-500/50"
          >
            <option>KoboToolbox</option>
            <option>ODK (Open Data Kit)</option>
            <option>Direct API</option>
            <option>Custom Webhook</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block" style={{ letterSpacing: "0.08em" }}>CATEGORY</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full text-sm bg-[#070b14] border border-[#1a2540] rounded-lg text-white py-2.5 px-3 focus:outline-none focus:border-blue-500/50"
          >
            <option>Critical Resource</option>
            <option>Infrastructure</option>
            <option>Skill-Based</option>
            <option>Micro-Task</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block" style={{ letterSpacing: "0.08em" }}>LOCATION NAME</label>
          <input
            type="text"
            placeholder="e.g. Sector 7, West District"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full text-sm bg-[#070b14] border border-[#1a2540] rounded-lg text-white py-2.5 px-3 focus:outline-none focus:border-blue-500/50 placeholder-slate-600"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block" style={{ letterSpacing: "0.08em" }}>URGENCY LEVEL (1–5)</label>
          <input
            type="range"
            min={1}
            max={5}
            value={form.urgency}
            onChange={(e) => setForm({ ...form, urgency: e.target.value })}
            className="w-full accent-red-500 mt-2"
          />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1">
            <span>1 — Minimal</span><span>3 — Medium</span><span>5 — Critical</span>
          </div>
          <div className="text-center text-sm text-red-400 mt-1" style={{ fontWeight: 700 }}>U{form.urgency}</div>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block" style={{ letterSpacing: "0.08em" }}>DESCRIPTION / CONTEXTUAL DETAILS</label>
        <textarea
          rows={4}
          placeholder="Describe the community need in detail..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full text-sm bg-[#070b14] border border-[#1a2540] rounded-lg text-white py-2.5 px-3 focus:outline-none focus:border-blue-500/50 placeholder-slate-600 resize-none"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-slate-400 mb-1 block" style={{ letterSpacing: "0.08em" }}>LATITUDE</label>
          <input
            type="text"
            placeholder="19.0760"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
            className="w-full text-sm bg-[#070b14] border border-[#1a2540] rounded-lg text-white py-2.5 px-3 focus:outline-none focus:border-blue-500/50 placeholder-slate-600"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-slate-400 mb-1 block" style={{ letterSpacing: "0.08em" }}>LONGITUDE</label>
          <input
            type="text"
            placeholder="72.8777"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
            className="w-full text-sm bg-[#070b14] border border-[#1a2540] rounded-lg text-white py-2.5 px-3 focus:outline-none focus:border-blue-500/50 placeholder-slate-600"
          />
        </div>
      </div>

      <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors flex items-center justify-center gap-2" style={{ fontWeight: 600 }}>
        <Send size={15} />
        Ingest Webhook Payload
      </button>
    </form>
  );
}

function NLPChatForm() {
  const [messages, setMessages] = useState([
    { from: "system", text: "Hello! Send a WhatsApp-style message in any language describing your community need. I'll extract the key entities automatically." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedEntity | null>(null);

  const sampleMessages = [
    "Need 50 blankets at Sector 4 urgently",
    "सेक्टर 7 में पानी की भारी कमी है, कृपया मदद करें",
    "আমাদের এলাকায় ৩০টি শিশু খাদ্য সংকটে আছে",
    "Urgent: flood blocking road near Rampur village",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      // Simulate NLP parsing
      const lower = userMsg.toLowerCase();
      let entity: ParsedEntity = { item: "General Aid", quantity: "Unspecified", location: "Unspecified", urgency: "3" };

      if (lower.includes("blanket")) entity = { item: "Blankets", quantity: "50", location: "Sector 4", urgency: "4" };
      else if (lower.includes("water") || lower.includes("पानी")) entity = { item: "Water Supply", quantity: "Community", location: "Sector 7", urgency: "5" };
      else if (lower.includes("flood") || lower.includes("road")) entity = { item: "Medical Supplies", quantity: "Emergency", location: "Rampur Village", urgency: "5" };
      else if (lower.includes("শিশু") || lower.includes("food")) entity = { item: "Infant Formula / Food", quantity: "30", location: "Local Area", urgency: "5" };

      let langDetect = "English";
      if (/[\u0900-\u097F]/.test(userMsg)) langDetect = "Hindi → Translated";
      if (/[\u0980-\u09FF]/.test(userMsg)) langDetect = "Bengali → Translated";
      entity.language = langDetect;

      setParsed(entity);
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text: `✅ NLP processed (${langDetect}). Entities extracted:\n• Item: ${entity.item}\n• Quantity: ${entity.quantity}\n• Location: ${entity.location}\n• Urgency: U${entity.urgency}\n\nStructured task ticket created. Deduplication check passed — plotting on heatmap.`,
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex items-start gap-3">
        <Globe size={16} className="text-purple-400 mt-0.5 shrink-0" />
        <div className="text-sm text-slate-300">
          Supports WhatsApp voice notes, SMS, and text in <span className="text-purple-400">Hindi, Bengali, Tamil, Telugu, Urdu, and English</span>. Powered by Groq (Llama 3) for blazing-fast NLP.
        </div>
      </div>

      {/* Sample messages */}
      <div>
        <p className="text-xs text-slate-500 mb-2" style={{ letterSpacing: "0.08em" }}>TRY A SAMPLE MESSAGE:</p>
        <div className="flex flex-wrap gap-2">
          {sampleMessages.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-[#070b14] border border-[#1a2540] text-slate-400 hover:text-white hover:border-purple-500/40 transition-colors"
            >
              {s.length > 40 ? s.slice(0, 38) + "..." : s}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="bg-[#070b14] border border-[#1a2540] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1a2540] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-slate-400">SahayNet NLP Engine — Online</span>
          <Cpu size={12} className="ml-auto text-purple-400 animate-pulse" />
        </div>
        <div className="p-4 space-y-3 h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-line ${
                  msg.from === "user"
                    ? "bg-purple-600/30 text-purple-100 rounded-tr-none"
                    : msg.from === "ai"
                    ? "bg-[#0d1221] border border-green-500/20 text-green-300 rounded-tl-none"
                    : "bg-[#0d1221] border border-[#1a2540] text-slate-400 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl px-4 py-2.5 text-sm text-slate-500">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-[#1a2540] p-3 flex gap-2">
          <input
            type="text"
            placeholder="Type your need in any language..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 text-sm bg-transparent text-white placeholder-slate-600 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Parsed entities */}
      {parsed && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="text-xs text-green-400 mb-3" style={{ letterSpacing: "0.08em", fontWeight: 700 }}>EXTRACTED ENTITIES — UNIFIED SCHEMA</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Item", value: parsed.item },
              { label: "Quantity", value: parsed.quantity },
              { label: "Location", value: parsed.location },
              { label: "Urgency", value: `U${parsed.urgency}` },
            ].map((e) => (
              <div key={e.label} className="bg-[#070b14] rounded-lg p-2.5 border border-[#1a2540]">
                <div className="text-[10px] text-slate-500">{e.label}</div>
                <div className="text-sm text-white mt-0.5" style={{ fontWeight: 600 }}>{e.value}</div>
              </div>
            ))}
          </div>
          {parsed.language && (
            <div className="mt-2 text-[11px] text-slate-500">Language detected: <span className="text-purple-400">{parsed.language}</span></div>
          )}
        </div>
      )}
    </div>
  );
}

function OCRForm() {
  const [stage, setStage] = useState<"upload" | "processing" | "done">("upload");
  const [dragging, setDragging] = useState(false);

  const handleUpload = () => {
    setStage("processing");
    setTimeout(() => setStage("done"), 2500);
  };

  if (stage === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/40 border-t-cyan-400 animate-spin" />
        <div className="text-center">
          <h3 className="text-white">Gemini Vision Processing...</h3>
          <p className="text-sm text-slate-400 mt-1">Running OCR on handwritten document</p>
        </div>
        <div className="text-xs text-slate-600 space-y-1 text-center">
          <div className="text-cyan-400">→ Detecting text regions...</div>
          <div>→ Mapping fields to unified schema...</div>
          <div>→ Extracting: Location, Category, Urgency...</div>
        </div>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Check size={28} className="text-cyan-400" />
          </div>
          <div className="text-center">
            <h3 className="text-white">OCR Complete</h3>
            <p className="text-sm text-slate-400 mt-1">Paper form digitized successfully by Gemini 1.5 Flash</p>
          </div>
        </div>
        <div className="bg-[#070b14] border border-[#1a2540] rounded-xl p-4 space-y-3">
          <div className="text-xs text-cyan-400 mb-2" style={{ letterSpacing: "0.08em", fontWeight: 700 }}>DIGITIZED FORM DATA</div>
          {[
            { field: "Center Name", value: "Rural Health Center, Block C" },
            { field: "Date", value: "April 22, 2026" },
            { field: "Need Item", value: "Infant Formula (Stage 2)" },
            { field: "Quantity", value: "20 units (urgent)" },
            { field: "Beneficiaries", value: "20 infants aged 6–12 months" },
            { field: "Field Worker", value: "Meera Nair (Sig. verified)" },
            { field: "GPS Tag", value: "19.0550°N, 72.8600°E" },
          ].map((row) => (
            <div key={row.field} className="flex items-start gap-3 text-sm">
              <span className="text-slate-500 w-36 shrink-0">{row.field}</span>
              <span className="text-white">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2 text-sm text-green-400">
          <Check size={14} />
          Task T-009 created and plotted on heatmap with U5 urgency
        </div>
        <button onClick={() => setStage("upload")} className="text-sm text-cyan-400 hover:text-cyan-300">Upload another</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 flex items-start gap-3">
        <Camera size={16} className="text-cyan-400 mt-0.5 shrink-0" />
        <div className="text-sm text-slate-300">
          Field workers at rural centers take a <span className="text-cyan-400">smartphone photo</span> of paper clipboards. Gemini 1.5 Flash performs OCR and maps handwritten fields into the standard MongoDB schema — no typing required.
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleUpload(); }}
        className={`border-2 border-dashed rounded-xl py-16 flex flex-col items-center gap-4 cursor-pointer transition-colors ${
          dragging ? "border-cyan-400/60 bg-cyan-400/5" : "border-[#1a2540] hover:border-cyan-500/30 hover:bg-cyan-500/5"
        }`}
        onClick={handleUpload}
      >
        <div className="w-16 h-16 rounded-full bg-[#0d1221] border border-[#1a2540] flex items-center justify-center">
          <Upload size={24} className="text-slate-500" />
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-300">Drop a photo of a paper form here</p>
          <p className="text-xs text-slate-600 mt-1">or click to simulate an upload</p>
        </div>
        <button className="text-xs px-4 py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-600/30 transition-colors">
          Simulate OCR Upload
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {["JPG / PNG", "PDF Scan", "Live Camera"].map((fmt) => (
          <div key={fmt} className="bg-[#070b14] border border-[#1a2540] rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400">{fmt}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">Supported</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubmitNeed() {
  const [tab, setTab] = useState<Tab>("webhook");

  const tabs = [
    { id: "webhook" as Tab, icon: Link2, label: "Webhook / ODK", desc: "Structured NGO platforms", color: "blue" },
    { id: "nlp" as Tab, icon: MessageSquare, label: "WhatsApp / SMS NLP", desc: "Natural language + multilingual", color: "purple" },
    { id: "ocr" as Tab, icon: Camera, label: "OCR Photo Scan", desc: "Paper forms → digital", color: "cyan" },
  ];

  const activeColors = { blue: "border-blue-500/50 text-blue-400 bg-blue-500/10", purple: "border-purple-500/50 text-purple-400 bg-purple-500/10", cyan: "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" };
  const inactiveStyle = "border-[#1a2540] text-slate-400 hover:border-[#253050] hover:text-slate-300 bg-[#070b14]";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Submit a Community Need</h1>
        <p className="text-sm text-slate-500 mt-0.5">The Omni-Ingestor Pipeline accepts data in any format — choose your ingestion method below</p>
      </div>

      {/* Flow Steps */}
      <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
        {["Ingest", "AI Parse", "Deduplicate", "Urgency Score", "Heatmap Plot", "Smart Dispatch"].map((step, i, arr) => (
          <div key={step} className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#0d1221] border border-[#1a2540] text-slate-400">{step}</span>
            {i < arr.length - 1 && <ChevronRight size={12} className="text-slate-700" />}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tabs.map((t) => {
          const isActive = tab === t.id;
          const activeColor = activeColors[t.color as keyof typeof activeColors];
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`p-4 rounded-xl border text-left transition-all ${isActive ? activeColor : inactiveStyle}`}
            >
              <t.icon size={18} className="mb-2" />
              <div className="text-sm" style={{ fontWeight: 600 }}>{t.label}</div>
              <div className="text-[11px] opacity-70 mt-0.5">{t.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-[#0d1221] border border-[#1a2540] rounded-2xl p-6">
        {tab === "webhook" && <WebhookForm />}
        {tab === "nlp" && <NLPChatForm />}
        {tab === "ocr" && <OCRForm />}
      </div>
    </div>
  );
}
