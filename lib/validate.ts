export function isValidEmail(email?: string): boolean {
    if (!email) return false;

    // Trim spaces
    const value = email.trim();

    // RFC 5322 compliant (safe + not overly strict)
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    return emailRegex.test(value);
}


export function isObjectId(value?: string): boolean {
  return (
    typeof value === "string" &&
    /^[a-fA-F0-9]{24}$/.test(value)
  );
}

/**
 * Checks if two objects are deeply equal
 * @param obj1 First object to compare
 * @param obj2 Second object to compare
 * @returns boolean - true if objects are deeply equal
 */
export function isEqualObjects(obj1: any, obj2: any): boolean {
  // Check if they are the same reference
  if (obj1 === obj2) return true;

  // Check if either is null or not an object
  if (obj1 === null || obj2 === null ||
    typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  }

  // Get keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if they have the same number of keys
  if (keys1.length !== keys2.length) return false;

  // Check if all keys and values are equal
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isEqualObjects(obj1[key], obj2[key])) return false;
  }

  return true;
}
