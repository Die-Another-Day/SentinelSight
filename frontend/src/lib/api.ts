const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function runScan(data: any) {
  const res = await fetch(`${BASE_URL}/api/full-scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}
