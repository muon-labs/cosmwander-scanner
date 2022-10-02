export const isTypeError = (err: string) => {
  return err.includes('Invalid type');
};

export const isPropertyError = (err: string) => {
  return err.includes('missing field');
};

export const isExecutedError = (err: string) => {
  return err.includes('failed to execute message');
};
