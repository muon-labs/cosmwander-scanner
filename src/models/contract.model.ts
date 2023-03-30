import { Schema, model } from 'mongoose';
import Contract from '~/interfaces/contract';

const ContractSchema: Schema = new Schema(
  {
    code_id: {
      required: true,
      type: Number
    },
    tx_hash: String,
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
    deployed_name: String,
    migrations: {}
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true
    }
  }
);

export const ContractModel = model<Contract>('Contract', ContractSchema);
