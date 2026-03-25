const API_URL = import.meta.env.VITE_API_URL || "http://100.118.105.124:5000";

export function getToken() {
  return localStorage.getItem("token");
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

function authHeaders() {
  const token = getToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function api(path, options = {}) {
  const { body, method = "GET", isFormData = false } = options;

  const headers = { ...authHeaders() };
  if (!isFormData) headers["Content-Type"] = "application/json";

  const config = { method, headers };
  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, config);

  if (res.status === 401) {
    clearAuth();
    window.location.href = "/";
    throw new Error("Session expired");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

export function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}
