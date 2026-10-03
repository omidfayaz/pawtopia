const prefix = "/clinic-api";

export async function apiRequest(path, { token, signal, ...options } = {}) {
  const response = await fetch(`${prefix}${path}`, {
    ...options,
    signal,
    cache: "no-store",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let problem;
    try { problem = await response.json(); } catch { /* Server returned no JSON. */ }
    const error = new Error(problem?.detail || problem?.title || `خطای سرویس (${response.status})`);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}

export const clinicApi = {
  login: (email, password) => apiRequest("/auth/login", {
    method: "POST", body: JSON.stringify({ email, password }),
  }),
  me: (token, signal) => apiRequest("/auth/me", { token, signal }),
  clinics: (signal) => apiRequest("/clinics", { signal }),
  members: (clinicId, token, signal) => apiRequest(`/clinics/${clinicId}/members`, { token, signal }),
  vets: (clinicId, signal) => apiRequest(`/clinics/${clinicId}/vets`, { signal }),
  appointments: (clinicId, token, signal) => apiRequest(`/clinics/${clinicId}/appointments`, { token, signal }),
  confirm: (appointmentId, token) => apiRequest(`/appointments/${appointmentId}/confirm`, { method: "POST", token }),
};

export const SESSION_KEY = "pawtopia.clinic.accessToken";
