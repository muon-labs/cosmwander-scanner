import { Schema, model } from 'mongoose';

export interface Code {
  code_id: number;
  creator: string;
  checksum: string;
  contracts: string[];
  definition?: {
    instantiate?: Record<string, string>;
    execute?: Record<string, string>;
    query?: Record<string, string>;
  };
  code_ref?: {
    repo_url: string;
    commit_hash: string;
  };
  verified?: boolean;
  last_verified?: Date;
}

const CodeSchema = new Schema(
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
    contracts: [String],
    definition: {
      instantiate: {},
      execute: {},
      query: {}
    },
    code_ref: {
      repo_url: String,
      commit_hash: String
    },
    verified: Boolean,
    last_verified: Date
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
