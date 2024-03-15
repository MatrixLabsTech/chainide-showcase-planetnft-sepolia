const BASE_API = "http://localhost:3001";

export function getTokenMetadata(tokenId: string): Promise<any> {
  return fetch(`${BASE_API}/metadata/${tokenId}`).then((res) => res.json());
}
