export type AnyObject = { [key: string]: unknown };
export function removeEmptyKeys(obj: AnyObject): AnyObject {
  return Object.keys(obj).reduce((acc: AnyObject, key: string) => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
export function roundToNearest(num: number, nearest?: 10 | 100 | 1000) {
  if (nearest == 10) return Math.round(num / 10) * 10;
  if (nearest == 100) return Math.round(num / 100) * 100;
  if (nearest == 1000) return Math.round(num / 1000) * 1000;
  return Math.round(num / 10) * 10;
}

export const bytesToMB = (bytes: number): number => {
  return Number((bytes / (1024 * 1024)).toFixed(2));
};


export const shortText = (text?: string, maxLength = 30) =>
  (text?.length || 0) >= maxLength ? `${text?.substring(0, maxLength)}...` : text;


export const getRandomIndex = (length: number) =>
  Math.ceil(Math.random() * length - 1);

export const generateNumbers = (from: number, to: number) => {
  const acc = [];
  for (let i = from; i <= to; i++) {
    acc.push(i);
  }
  return acc;
};
export const getInitials = (text?: string | string[], length = 2) => {
  if (!text) return '';
  const list = typeof text == 'string' ? text.trim().split(' ') : text;
  const initials = list?.map((l) => l.trim()[0]);
  return initials.join('').substring(0, length);
};


export const getSafeUrl = (url: string) => {
  if (!url) return '';
  const purified = url.startsWith('https://')
    ? url
    : url.startsWith('http://')
      ? `https://${url.substring(7)}`
      : `https://${url}`;
  return purified;
};

 

export const getUrlToShare = () => typeof window !== 'undefined' ? window.location.href : "";


