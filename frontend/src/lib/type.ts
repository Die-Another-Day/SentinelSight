export type ScanType = "probe" | "traceroute" | "full-scan";

export interface ScanPayload {
  target: string;
  count: number;
  scanType: ScanType;
}




export interface ProbeResult {
  seq: number;
  rtt_ms: number;
  ttl?: number;
}

export interface HopResult {
  hop: number;
  ip: string;
  ttl?: number;
  rtt_ms?: number;
  hostname?: string;
  source?: string;
  location?: string;
  country?: string;
  city?: string;
  status?: string;
}

export interface ScanResponse {
  target: string;
  probe_results: ProbeResult[];
  traceroute_results: HopResult[];
  summary: Record<string, any>;
}
