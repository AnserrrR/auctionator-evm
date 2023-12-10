export const isValidJSONArray = (value: string | undefined) => {
  try {
    return Array.isArray(JSON.parse(value ?? ''));
  } catch (e) {
    return false;
  }
};
