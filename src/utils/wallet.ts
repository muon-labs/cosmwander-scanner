import { Chain } from '@chain-registry/types'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import ChainService from '~/services/chain.service'
import { RPC_ENDPOINT } from './config'

const chainService = new ChainService()

const MNEMONIC = process.env.MNEMONIC as string
if (!MNEMONIC) {
  throw new Error('MNEMONIC env var is required')
}

export async function getSigningClient (chain: Chain) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, {
    prefix: chain.bech32_prefix
  })
  const signingClient = await SigningCosmWasmClient.connectWithSigner(
    chainService.getBestRPC(chain.chain_id),
    wallet
  )

  return {
    signingClient,
    accounts: await wallet.getAccounts()
  }
}
