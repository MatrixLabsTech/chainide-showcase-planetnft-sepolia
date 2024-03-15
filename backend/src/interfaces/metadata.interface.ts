export type Metadatas = {
  metadatas: Metadata[];
};
export interface Metadata {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  owner: string;
  attributes: Attributes[];
}

export interface Attributes {
  trait_type: string;
  value: string;
}
