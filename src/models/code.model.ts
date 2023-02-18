import { Schema, model } from 'mongoose';
import Code from '~/interfaces/code';

const CodeSchema: Schema = new Schema(
  {
    code_id: {
      required: true,
      type: Number
    },
    chain_id: {
      required: true,
      type: String
    },
    creator: {
      required: true,
      type: String
    },
    checksum: {
      required: true,
      type: String
    },
    tx_hash: String,
    uploaded_at: Date,
    contracts: [String],
    full_schema: {
      instantiate: {},
      execute: {},
      query: {}
    },
    code_ref: {
      repo_url: String,
      commit_hash: String
    },
    version: String,
    verified: Boolean
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
      }
    }
  }
);

export const CodeModel = model<Code>('Code', CodeSchema);
