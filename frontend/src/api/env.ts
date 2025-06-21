const LOCALHOST_NAMES = ['localhost', '127.0.0.1'];

export const getMode = (): 'dev' | 'staging' | 'prod' => {
  const mode = import.meta.env.MODE;
  const baseUrl = location.hostname;
  if (mode === 'development') {
    return 'dev';
  } else if (LOCALHOST_NAMES.includes(baseUrl)) {
    return 'staging';
  } else {
    return 'prod';
  }
};
