import { Document } from 'mongoose';

export default interface Code extends Document {
  codeId: number;
  chainId: string;
  creator: string;
  checksum: string;
  txHash: string;
  contracts: string[];
  contractSchema?: {
    instantiate: Record<string, string>;
    execute: Record<string, string>;
    query: Record<string, string>;
  };
  codeRef?: {
    repo_url: string;
    commit_hash: string;
  };
  version?: string;
  verified?: boolean;
  createdAt: string;
}

export interface CodeDetails {
  codeId: number;
  creator: string;
  checksum: string;
  height: number;
  txHash: string;
  createdAt: string;
}
