"use client";

import { useCallback, useEffect, useState } from "react";
import { clinicApi } from "./api";
import { useClinic } from "./ClinicShell";

export function useAppointments() {
  const { clinicId, token } = useClinic();
  const [appointments, setAppointments] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const refresh = useCallback(async (signal) => {
    try {
      const [list, doctors] = await Promise.all([
        clinicApi.appointments(clinicId, token, signal),
        clinicApi.vets(clinicId, signal),
      ]);
      if (!signal?.aborted) { setAppointments(list); setVets(doctors); setError(""); }
    } catch (cause) { if (!signal?.aborted) setError(cause.message); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, [clinicId, token]);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => { if (!controller.signal.aborted) refresh(controller.signal); });
    return () => controller.abort();
  }, [refresh]);

  async function confirm(id) {
    setActionId(id);
    setError("");
    try {
      const updated = await clinicApi.confirm(id, token);
      setAppointments((current) => current.map((item) => item.id === id ? updated : item));
      return true;
    } catch (cause) { setError(cause.message); return false; }
    finally { setActionId(null); }
  }

  const reload = () => { setLoading(true); setError(""); return refresh(); };
  return { appointments, vets, loading, error, actionId, confirm, refresh: reload };
}
