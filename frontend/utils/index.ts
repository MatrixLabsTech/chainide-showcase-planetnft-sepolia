// format hex address

export function formatHexAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
