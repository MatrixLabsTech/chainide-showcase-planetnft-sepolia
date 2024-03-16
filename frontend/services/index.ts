import config from "../config";

const BASE_API = config.baseApi;

export function getTokenMetadata(tokenId: string): Promise<any> {
  return fetch(`${BASE_API}/metadata/${tokenId}`).then((res) => res.json());
}

export function batchGetTokenMetadata(tokenIds: any[]): Promise<any> {
  return fetch(`${BASE_API}/metadata/batchGet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenIds }),
  }).then((res) => res.json());
}

export function uploadMetadata(metadata: any): Promise<any> {
  return fetch(`${BASE_API}/metadata`, {
    method: "POST",
    body: metadata,
  }).then((res) => res.json());
}

export function getItemEvents(tokenId: string): Promise<any> {
  return fetch(`${BASE_API}/event/${tokenId}`).then((res) => res.json());
}
