import { Schema, model } from 'mongoose';

export interface Contract {
  code_id: number;
  chain_id: string;
  init_msg: Record<string, unknown>;
  creator: string;
  label: string;
  ibcPortId?: string;
  migrations?: Record<string, string>;
}

const ContractSchema = new Schema(
  {
    code_id: {
      required: true,
      type: Number
    },
    address: {
      required: true,
      type: String
    },
    chain_id: {
      required: true,
      type: String
    },
    init_msg: {},
    creator: {
      required: true,
      type: String
    },
    label: {
      required: true,
      type: String
    },
    migrations: {},
    ibcPortId: String
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true
    }
  }
);

export const ContractModel = model<typeof ContractSchema>('Contract', ContractSchema);
