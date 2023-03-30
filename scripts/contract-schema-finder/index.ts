import { CHAIN_ID, RPC_URL } from './config';
import ContractSchemaFinder from './main/main';
import Code from '../../src/interfaces/code';
import Contract from '../../src/interfaces/contract';
import { CodeModel } from '../../src/models/code.model';
import { ContractModel } from '../../src/models/contract.model';

async function run_scan() {
  console.log('Starting contract schema scan');
  let finder = await ContractSchemaFinder.getInstance(RPC_URL, CHAIN_ID);

  const allCodes = await finder.getAllCodes();

  let codes: Code[] = [];

  for (let code of allCodes) {
    let addresses = await finder.getContractsFromCodeId(code.id);

    let contracts: Contract[] = [];
    for (let address of addresses) {
      let contract = await finder.getMetadataFromContract(address, code.id);

      // console.log({ contract, hist: contract.contractHistory[0].msg });
      let contractInfo: Contract = {
        code_id: code.id,
        chain_id: CHAIN_ID,
        init_msg: contract.contractHistory[0].msg,
        creator: contract.contract.creator,
        label: contract.contract.label
        // todo migrations
      };

      contracts.push(contractInfo);

      let newContract = await ContractModel.create(contractInfo);
      await newContract.save();
    }

    let codeInfo = {
      code_id: code.id,
      chain_id: CHAIN_ID,
      creator: code.creator,
      checksum: code.checksum,
      tx_hash: '', // how to get this?
      uploaded_at: new Date('0'),
      contracts: [...addresses]
    };
    codes.push(codeInfo);

    let newCode = await CodeModel.create(codeInfo);
    await newCode.save();
  }
}

run_scan();
