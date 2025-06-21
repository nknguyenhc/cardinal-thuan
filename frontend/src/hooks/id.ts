const CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateRandomId = (): string => {
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
};

export const isValidId = (id: string): boolean => {
  if (typeof id !== 'string' || id.length !== 10) {
    return false;
  }
  const regex = /^[A-Za-z0-9]{10}$/;
  return regex.test(id);
};
