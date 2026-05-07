"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { HopInfo } from "../../lib/types";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface GeoMapProps {
  data: HopInfo[];
}

const defaultCenter = [20, 0] as const;

export function GeoMap({ data }: GeoMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const points = useMemo(
    () =>
      data
        .map((hop) => {
          const loc = (hop as any).loc as string | undefined;
          if (!loc) return null;
          const [lat, lng] = loc.split(",").map(Number);
          if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
          return { ttl: hop.ttl, lat, lng, source: hop.source, rtt: hop.rtt_ms, city: hop.city, country: hop.country };
        })
        .filter(Boolean) as Array<{ ttl: number; lat: number; lng: number; source?: string; rtt?: number; city?: string; country?: string }>,
    [data]
  );

  if (!mounted) {
    return <div className="flex h-full items-center justify-center text-slate-500">Loading map...</div>;
  }

  if (!points.length) {
    return <div className="flex h-full items-center justify-center text-slate-500">No geographic coordinates available.</div>;
  }

  return (
    <MapContainer center={defaultCenter} zoom={2} className="h-full w-full rounded-[1.75rem]" scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((point) => (
        <CircleMarker key={point.ttl} center={[point.lat, point.lng]} radius={8} pathOptions={{ color: "#2ee3a4", fillColor: "#2ee3a4", fillOpacity: 0.5 }}>
          <Popup>
            <div className="space-y-1 text-xs text-slate-900">
              <p className="font-semibold">Hop {point.ttl}</p>
              <p>{point.source}</p>
              <p>{point.city ?? "Unknown"}, {point.country ?? "Unknown"}</p>
              <p>RTT: {point.rtt ? `${point.rtt.toFixed(2)} ms` : "N/A"}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
