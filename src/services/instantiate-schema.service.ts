import { MsgInstantiateContractEncodeObject } from '@cosmjs/cosmwasm-stargate';
import { MsgInstantiateContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toUtf8 } from '@cosmjs/encoding';
import { sleep } from '~/utils/sleep';
import toJsonSchema from 'to-json-schema';
import { isObject } from '~/utils/isObject';
import CosmWasmClient from './cosmwasm.service';
import { HttpError } from '~/utils/http-error';

class InstantiateSchemaService {
  codeId: number;
  client: CosmWasmClient;
  lastPropertyError?: string;
  aborted?: boolean;
  constructor(client: CosmWasmClient, codeId: number) {
    this.client = client;
    this.codeId = codeId;
  }
  static async getInstantiateSchemaFromCodeId(chainId: string, codeId: number) {
    const client = await CosmWasmClient.connectWithSigner(chainId);
    const service = new InstantiateSchemaService(client, codeId);
    const msgProperties = await service.simulate({});
    const instantiateSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'InstantiateMsg',
      isAborted: !!service.aborted,
      ...toJsonSchema(msgProperties)
    };

    return instantiateSchema;
  }

  async simulate(msg: Record<string, unknown>) {
    console.log(msg);
    try {
      const sender = await this.client.getAddress();
      const encodeMsg: MsgInstantiateContractEncodeObject = {
        typeUrl: '/cosmwasm.wasm.v1.MsgInstantiateContract',
        value: MsgInstantiateContract.fromPartial({
          label: 'test',
          sender,
          codeId: this.codeId,
          msg: toUtf8(JSON.stringify(msg)),
          funds: []
        })
      };
      await this.client.simulate(sender, encodeMsg);
      return msg;
    } catch (e) {
      await sleep(5000);
      const { message: error } = e as { message: string };
      console.log(error);
      if (this.isExecutedError(error)) return msg;
      if (this.isNestedError(error)) return await this.errorNestedHandler(error, msg);
      if (this.isTypeError(error)) return await this.errorTypeHandler(msg);
      if (this.isPropertyError(error)) return await this.errorPropertyHandler(error, msg);
    }
  }

  async errorTypeHandler(msg: Record<string, unknown>) {
    const properties = Object.keys(msg);
    const property = properties[properties.length - 1];
    if (isObject(msg[property])) {
      this.aborted = true;
      return msg;
    }
    const nextValue = this.getNextType(msg[property]);
    return await this.simulate({ ...msg, [property]: nextValue });
  }

  async errorPropertyHandler(error: string, msg: Record<string, unknown>) {
    const property = this.getPropertyFromError(error);
    this.lastPropertyError = property;
    return await this.simulate({ ...msg, [property]: 'string' });
  }

  async errorNestedHandler(error: string, msg: Record<string, any>) {
    const property = this.getPropertyFromError(error);
    delete msg[property];
    const properties = Object.keys(msg);
    const lastProperty = properties[properties.length - 1];
    const value = Object.assign(msg[lastProperty], { [property]: 'string' });
    this.lastPropertyError = undefined;
    return await this.simulate({ ...msg, [lastProperty]: value });
  }

  getNextType(property: unknown): string | number | [] | {} {
    switch (typeof property) {
      case 'string':
        return 10;
      case 'number':
        return [];
      case 'object':
        return {};
    }
    throw new HttpError(500, 'Invalid type');
  }

  getPropertyFromError(error: string): string {
    const [propertyMatch] = [...error.matchAll(/(?<=`)[^`]+(?=`(?:[^`]*`[^`]*`)*[^`]*$)/g)];
    const [property] = propertyMatch;
    return property;
  }

  isTypeError(error: string): boolean {
    return error.includes('Invalid type');
  }

  isNestedError(error: string): boolean {
    return error.includes('missing field') && this.lastPropertyError === this.getPropertyFromError(error);
  }

  isPropertyError(error: string): boolean {
    return error.includes('missing field');
  }

  isExecutedError(error: string): boolean {
    return error.includes('length');
  }
}

export default InstantiateSchemaService;
