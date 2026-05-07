export interface ScanPayload {
  target: string;
  probes?: number;
  scanType: "probe" | "traceroute" | "full";
}

export interface ProbeResult {
  seq: number;
  rtt_ms: number;
  ttl?: number;
}

export interface HopResult {
  hop: number;
  ip: string;
  rtt_ms?: number;
  hostname?: string;
  country?: string;
  city?: string;
}

export interface ScanResponse {
  target: string;
  probe_results: ProbeResult[];
  traceroute_results: HopResult[];
  summary: Record<string, any>;
}
