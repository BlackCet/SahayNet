import { useEffect, useState, useMemo, Fragment } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// @ts-ignore
window.L = L;
import "leaflet.heat";

function HeatmapLayer({ data }: { data: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (data.length === 0) return;

    let heatLayer: any = null;

    // Use a short timeout to let the container get its size in the DOM
    const timeout = setTimeout(() => {
      const size = map.getSize();
      // Only create and add the heat layer if the map has actual dimensions
      if (size.x > 0 && size.y > 0) {
        try {
          heatLayer = (L as any).heatLayer(data, {
            radius: 25,
            blur: 15,
            maxZoom: 15,
            max: 5, // max urgency is 5
            gradient: { 0.2: '#3b82f6', 0.4: '#10b981', 0.6: '#f59e0b', 0.8: '#f97316', 1.0: '#ef4444' }
          }).addTo(map);
        } catch (e) {
          console.error("Heatmap layer error:", e);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (heatLayer && map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, data]);

  return null;
}

const urgencyColors = {
  1: "#3b82f6",
  2: "#10b981",
  3: "#f59e0b",
  4: "#f97316",
  5: "#ef4444"
};

interface VolunteerPos {
  id: string;
  x: number;
  y: number;
  name: string;
  status: string;
  platform?: string;
  isGigWorker?: boolean;
}

const createCustomIcon = (color: string, isVolunteer: boolean) => {
  return L.divIcon({
    className: "custom-icon",
    html: `
      <div style="
        width: ${isVolunteer ? '12px' : '20px'};
        height: ${isVolunteer ? '12px' : '20px'};
        background-color: ${color};
        border-radius: 50%;
        border: ${isVolunteer ? '2px solid white' : 'none'};
        opacity: 0.9;
      "></div>
    `,
    iconSize: isVolunteer ? [12, 12] : [20, 20],
    iconAnchor: isVolunteer ? [6, 6] : [10, 10],
  });
};

export function MapView() {
  const center = useMemo(() => ({ lat: 28.6139, lng: 77.2090 }), []); // New Delhi

  const [tasks, setTasks] = useState<any[]>([]);
  const [volunteerPositions, setVolunteerPositions] = useState<VolunteerPos[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Fetch real data
    Promise.all([
      fetch("/api/tasks").then(res => res.json()),
      fetch("/api/volunteers").then(res => res.json())
    ]).then(([tasksData, volsData]) => {
      setTasks(tasksData);
      setVolunteerPositions(
        volsData.filter((v: any) => v.status !== "Offline").map((v: any) => ({
          id: v._id || v.id,
          x: v.location[0] || center.lat + (Math.random() - 0.5) * 0.1,
          y: v.location[1] || center.lng + (Math.random() - 0.5) * 0.1,
          name: v.name,
          status: v.status,
          isGigWorker: v.isGigWorker
        }))
      );
    }).catch(console.error);
  }, [center]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setVolunteerPositions((prev) =>
        prev.map((v) => ({
          ...v,
          x: v.x + (Math.random() - 0.5) * 0.001,
          y: v.y + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const activeTasks = tasks.filter((t: any) => t.status !== "Verified");
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Delay rendering heatmap slightly to let container take size
    const timer = setTimeout(() => setMapLoaded(true), 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-[#070b14] rounded-xl overflow-hidden border border-[#1a2540]">
      {/* Legend */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 bg-[#0d1221]/90 backdrop-blur-sm rounded-lg p-3 border border-[#1a2540]">
        <div className="text-[10px] text-slate-500 mb-1" style={{ letterSpacing: "0.1em" }}>LEGEND</div>
        {[5, 4, 3, 2, 1].map((lvl) => (
          <div key={lvl} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: urgencyColors[lvl as keyof typeof urgencyColors] }}
            />
            <span className="text-[10px] text-slate-400">Urgency {lvl}</span>
          </div>
        ))}
        <div className="mt-1 border-t border-[#1a2540] pt-1.5 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 opacity-80" />
          <span className="text-[10px] text-slate-400">Volunteer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
          <span className="text-[10px] text-slate-400">Gig Worker</span>
        </div>
      </div>

      {/* Map count */}
      <div className="absolute bottom-6 left-3 z-[1000] bg-[#0d1221]/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-[#1a2540]">
        <div className="text-[10px] text-slate-500" style={{ letterSpacing: "0.08em" }}>LIVE NODES</div>
        <div className="text-xl text-white" style={{ fontWeight: 700 }}>{activeTasks.length}</div>
      </div>

      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={12} 
        style={{ width: '100%', height: '100%', background: '#070b14' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {mapLoaded && <HeatmapLayer 
          data={activeTasks.map((t: any) => [
            t.location ? t.location[0] : center.lat,
            t.location ? t.location[1] : center.lng,
            t.urgency || 1
          ])} 
        />}

        {/* Render Volunteer positions as markers */}
        {volunteerPositions.map(v => (
          <Marker
            key={v.id}
            position={[v.x, v.y]}
            icon={createCustomIcon(v.isGigWorker ? "#facc15" : "#22d3ee", true)}
          />
        ))}

        {/* Render Task nodes */}
        {activeTasks.map((task, i) => {
          const lat = task.location ? task.location[0] : center.lat;
          const lng = task.location ? task.location[1] : center.lng;
          const color = urgencyColors[task.urgency as keyof typeof urgencyColors] || "#10b981";
          const uniqueKey = task._id || task.id || `task-${i}`;

          return (
            <Fragment key={uniqueKey}>
              {/* Pulse circle */}
              <Circle
                center={[lat, lng]}
                radius={task.urgency * 200 + (tick % 2) * 50}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.1,
                  color: color,
                  opacity: 0.3,
                  weight: 1,
                }}
              />
              <Marker
                position={[lat, lng]}
                icon={createCustomIcon(color, false)}
              >
                <Popup className="custom-popup">
                  <div className="bg-[#070b14] p-2 max-w-[200px] rounded text-slate-200">
                    <h4 className="font-bold text-sm mb-1 text-white">{task.title}</h4>
                    <p className="text-xs text-slate-400 mb-2">{task.category} • Urgency {task.urgency}</p>
                    <div 
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block"
                      style={{ 
                        backgroundColor: `${color}20`,
                        color: color,
                        border: `1px solid ${color}30` 
                      }}
                    >
                      {task.status}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
