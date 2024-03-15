export type BlockInfos = {
  blockInfos: BlockInfo[];
};

export type BlockInfo = {
  oldBlockNumber: number;
  newBlockNumber: number;
  status: BlockSyncStatus;
  time: number;
};

export enum BlockSyncStatus {
  InProgress = 'InProgress',
  Finished = 'Finished',
}
