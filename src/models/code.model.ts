import { Schema, model } from 'mongoose';
import Code from '~/interfaces/code';

const CodeSchema: Schema = new Schema(
  {
    codeId: {
      required: true,
      type: Number
    },
    chainId: {
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
    height: {
      required: true,
      type: Number
    },
    txHash: {
      required: true,
      type: String
    },
    createdAt: {
      required: true,
      type: Date
    },
    contractSchema: {
      instantiate: {},
      execute: {},
      query: {}
    },
    codeRef: {
      repo_url: String,
      commit_hash: String
    },
    name: String,
    version: String,
    verified: Boolean
  },
  {
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
