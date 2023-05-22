import { Document } from 'mongoose';

export default interface Contract extends Document {
  codeId: number;
  chainId: string;
  initMsg: Record<string, unknown>;
  creator: string;
  name: string;
  txHash: string;
  address: string;
  height: string;
  createdAt: string;
}

export interface ContractDetails {
  address: string;
  codeId: number;
  creator: string;
  admin: string | undefined;
  label: string;
  ibcPortId: string | undefined;
  initMsg: unknown;
  height: number;
  txHash: string;
  createdAt: string;
}
