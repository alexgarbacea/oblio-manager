export const encryptCredentials = (credentials: { clientId: string; clientSecret: string }): string => {
  const encoder = new TextEncoder();
  const data = JSON.stringify(credentials);
  const encoded = encoder.encode(data);
  const base64 = btoa(String.fromCharCode(...encoded));
  return base64;
};

export const decryptCredentials = (encrypted: string): { clientId: string; clientSecret: string } => {
  const decoded = atob(encrypted);
  const bytes = new Uint8Array(decoded.split('').map(char => char.charCodeAt(0)));
  const decoder = new TextDecoder();
  const data = decoder.decode(bytes);
  return JSON.parse(data);
};

export const encryptToken = (token: string): string => {
  return btoa(token);
};

export const decryptToken = (encrypted: string): string => {
  return atob(encrypted);
};
