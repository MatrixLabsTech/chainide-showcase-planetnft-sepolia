export type BlockEvents = {
  blockEvents: BlockEvent[];
};

export type BlockEvent = {
  tokenId: number;
  event: EventType;
  eventTime: number;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  from: string;
  to: string;
};

export enum EventType {
  Mint = 'Mint',
  Transfer = 'Transfer',
}
