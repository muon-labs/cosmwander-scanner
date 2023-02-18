export default interface Code {
  code_id: number;
  chain_id: string;
  creator: string;
  checksum: string;
  tx_hash: string;
  uploaded_at: Date;
  contracts: string[];
  full_schema?: {
    instantiate: Record<string, string>;
    execute: Record<string, string>;
    query: Record<string, string>;
  };
  code_ref?: {
    repo_url: string;
    commit_hash: string;
  };
  version?: string;
  verified?: boolean;
}
