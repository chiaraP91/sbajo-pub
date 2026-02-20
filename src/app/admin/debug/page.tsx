"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function DebugEventiPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDebugData() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("Not authenticated - please login first");
          return;
        }

        const token = await user.getIdToken();
        const res = await fetch("/api/admin/eventos-debug", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err?.message || "Error loading debug data");
      } finally {
        setLoading(false);
      }
    }

    loadDebugData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>DEBUG: Firestore Events</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {data && (
        <>
          <p>
            <strong>Total events in Firestore: {data.total}</strong>
          </p>
          <details>
            <summary>Raw JSON Data</summary>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </details>

          {data.events.length > 0 ? (
            <>
              <h2>Events Table</h2>
              <table border={1} style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Disponibile</th>
                    <th>DateISO</th>
                    <th>ImageUrl</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.map((e: any) => (
                    <tr key={e.id}>
                      <td style={{ wordBreak: "break-all" }}>{e.id}</td>
                      <td>{e.title || "(empty)"}</td>
                      <td>{String(e.disponibile)}</td>
                      <td>{e.dateISO || "(none)"}</td>
                      <td style={{ wordBreak: "break-all" }}>
                        {e.imageUrl
                          ? e.imageUrl.substring(0, 50) + "..."
                          : "(none)"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>No events found in Firestore</p>
          )}
        </>
      )}
    </div>
  );
}
