
import { RemarkResult } from './extract'


export enum RmrkEvent {
  MINT = 'MINT',
  MINTNFT = 'MINTNFT',
  LIST = 'LIST',
  BUY = 'BUY',
  CONSUME = 'CONSUME',
  CHANGEISSUER = 'CHANGEISSUER',
  SEND = 'SEND',
  EMOTE = 'EMOTE',

  BURN = 'BURN',  //Event Alias as CONSUME in Standard 2.0.0 

  CREATE = 'CREATE',  //Event Alias as MINT COLLECTION in Standard 2.0.0 


  //Event for new features in Standard 2.0.0 
  ACCEPT = 'ACCEPT',
  RESADD = 'RESADD',


  //misc
  EQUIP = 'EQUIP',
  EQUIPPABLE = 'EQUIPPABLE',
  SETPRIORITY = 'SETPRIORITY',
  SETPROPERTY = 'SETPROPERTY',
  LOCK = 'LOCK',

  //UNKNOWN
  UNKNOWN = 'UNKNOWN'
}

export const getNftId = (nft: any, blocknumber?: string | number): string => {
  return `${blocknumber ? blocknumber + '-' : ''}${nft.collection}-${nft.instance || nft.name}-${nft.sn}`
}
export const getNftId_V01 = (nft: any): string => {
  return `${nft.collection}-${nft.instance || nft.name}-${nft.sn}`
}


export interface RmrkInteraction {
  id: string;
  metadata?: string;
}
export enum RmrkSpecVersion {
  V01 = "0.1",
  V1 = "1.0.0",
  V2 = "2.0.0"
}
export enum RmrkAcceptType {
  RES = "RES",
  NFT = "NFT"
}
export interface RmrkAcceptInteraction {
  id1: string;
  entity: string;
  id2: string;
}
export interface RmrkSendInteraction {
  id: string;
  recipient: string;
}

export interface Collection {
  version: string;
  name: string;
  max: number;
  issuer: string;
  symbol: string;
  id: string;
  _id: string;
  metadata: string;
  blockNumber?: number;
}

export interface NFT {
  name: string;
  instance: string;
  transferable: number;
  collection: string;
  sn: string;
  _id: string;
  id: string;
  metadata: string;
  currentOwner: string;
  price?: string;
  disabled?: boolean;
  blockNumber?: number;
}


export interface RMRK {
  event: RmrkEvent;
  view: RmrkType;
}

export type RmrkType = Collection | NFT | RmrkInteraction
