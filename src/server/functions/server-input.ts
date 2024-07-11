import cuid from "cuid";

export function isValidCuid(input: string) {
  return input.length > 20 && input.length < 30 && cuid.isCuid(input);
}

export function isValidUserId(userId: string) {
  return userId.length > 20 && userId.length < 40;
}

export function isValidEnum(enumType: any, values: any[]) {
  return values.includes(enumType);
}

export function isValidInteger(input: string) {
  return !isNaN(parseInt(input));
}

export function isValidURL(input: string) {
  try {
    new URL(input);
    return true;
  } catch (e) {
    return false;
  }
}
