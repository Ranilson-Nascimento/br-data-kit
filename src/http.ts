
export type HttpOptions = {
  timeoutMs?: number;
  retries?: number;
  backoffMs?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export async function httpJson<T>(url: string, opts: HttpOptions = {}): Promise<T> {
  const { timeoutMs = 8000, retries = 2, backoffMs = 400, headers = {}, signal } = opts;

  let attempt = 0;
  let lastError: any;
  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { headers, signal: signal ?? controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    } catch (e) {
      clearTimeout(timer);
      lastError = e;
      if (attempt === retries) break;
      await new Promise((r) => setTimeout(r, backoffMs * Math.pow(2, attempt)));
      attempt++;
    }
  }
  throw lastError;
}
