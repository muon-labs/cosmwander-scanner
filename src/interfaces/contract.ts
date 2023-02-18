export default interface Contract {
  code_id: number;
  chain_id: string;
  init_msg: Record<string, unknown>;
  creator: string;
  label: string;
  migrations?: Record<string, string>;
}
