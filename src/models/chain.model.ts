import { Schema, model } from 'mongoose';

export interface Chain {
  pinned_codes: number[];
  chain_id: string;
}

const ChainSchema = new Schema(
  {
    chain_id: {
      required: true,
      type: String
    },
    pinned_codes: [Number],
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

export const ChainModel = model<typeof ChainSchema>('Chain', ChainSchema);
