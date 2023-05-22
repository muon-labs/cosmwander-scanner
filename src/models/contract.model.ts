import { Schema, model } from 'mongoose';
import Contract from '~/interfaces/contract';

const ContractSchema: Schema = new Schema(
  {
    codeId: {
      required: true,
      type: Number
    },
    height: {
      required: true,
      type: Number
    },
    txHash: {
      required: true,
      type: String
    },
    address: {
      required: true,
      type: String
    },
    chainId: {
      required: true,
      type: String
    },
    initMsg: {},
    creator: {
      required: true,
      type: String
    },
    name: String,
    version: String,
    createdAt: Date
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true
    }
  }
);

export const ContractModel = model<Contract>('Contract', ContractSchema);
