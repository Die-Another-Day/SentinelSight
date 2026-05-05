from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, validator
import ipaddress


class ProbeRequest(BaseModel):
    target: str
    count: int = Field(default=3, ge=1, le=10)

    @validator("target")
    def validate_target(cls, value):
        try:
            ipaddress.ip_address(value)
        except ValueError:
            # allow hostname/dns name
            if " " in value or len(value) > 253:
                raise ValueError("Invalid IP address or hostname")
        return value


class TracerouteRequest(BaseModel):
    target: str
    max_ttl: int = Field(default=30, ge=1, le=64)

    @validator("target")
    def validate_target(cls, value):
        try:
            ipaddress.ip_address(value)
        except ValueError:
            if " " in value or len(value) > 253:
                raise ValueError("Invalid IP address or hostname")
        return value


class FullScanRequest(BaseModel):
    target: str
    count: int = Field(default=3, ge=1, le=10)
    max_ttl: int = Field(default=30, ge=1, le=64)

    @validator("target")
    def validate_target(cls, value):
        try:
            ipaddress.ip_address(value)
        except ValueError:
            if " " in value or len(value) > 253:
                raise ValueError("Invalid IP address or hostname")
        return value


class ProbeResult(BaseModel):
    success: bool
    source: Optional[str]
    icmp_type: Optional[int]
    icmp_code: Optional[int]
    rtt_ms: Optional[float]
    message: Optional[str]


class HopInfo(BaseModel):
    ttl: int
    source: Optional[str]
    icmp_type: Optional[int]
    icmp_code: Optional[int]
    rtt_ms: Optional[float]
    city: Optional[str]
    country: Optional[str]
    asn: Optional[str]
    status: str


class ScanResponse(BaseModel):
    target: str
    probe_results: List[ProbeResult]
    traceroute_results: List[HopInfo]
    summary: Dict[str, Any]
