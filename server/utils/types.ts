export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

export const hasArray = <K extends string>(
  v: unknown,
  key: K
): v is Record<K, unknown[]> => isRecord(v) && Array.isArray(v[key]);
