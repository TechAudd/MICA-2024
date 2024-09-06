export const getPlatFormFee = (currency: string): number => {
  return currency === "USD" ? 1 : 7;
};
