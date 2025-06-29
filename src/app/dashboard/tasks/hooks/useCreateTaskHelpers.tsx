// hooks/useCreateTaskHelpers.ts
import { useState, useEffect } from "react";

export interface Option { value: string; label: string; }

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useCreateTaskHelpers() {
  const [users, setUsers] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [uRes, pRes] = await Promise.all([
          fetch(`${API_BASE}/users`),
          fetch(`${API_BASE}/projects`),
        ]);
        if (!uRes.ok || !pRes.ok) throw new Error("Option fetch error");
        const [uData, pData] = await Promise.all([uRes.json(), pRes.json()]);
        setUsers(uData.map((u: any) => ({ value: u.id, label: u.name })));
        setProjects(pData.map((p: any) => ({ value: p.id, label: p.name })));
      } catch (err) {
        console.error(err);
      }
    }
    fetchOptions();
  }, []);

  return { users, projects };
}
