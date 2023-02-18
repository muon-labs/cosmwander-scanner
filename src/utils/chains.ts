export type Chain = typeof chains[number];

export const chains = [
  {
    chain_id: 'stargaze-1',
    chain_name: 'stargaze',
    pretty_name: 'Stargaze',
    bech32_prefix: 'stars',
    rpc_url: 'https://rpc.cosmos.directory/stargaze',
    rest_url: 'https://rest.cosmos.directory/stargaze',
    bip44: {
      coinType: 118
    },
    default_fee_token: 'ustars',
    fee_tokens: [
      {
        denom: 'ustars',
        coinDecimals: 6
      }
    ],
    staking_token: 'ustars',
    default_gas_price: 0.025,
    gas_price_step: {
      low: 0.01,
      average: 0.025,
      high: 0.04
    }
  },
  {
    chain_id: 'osmosis-1',
    chain_name: 'osmosis',
    pretty_name: 'Osmosis',
    bech32_prefix: 'osmo',
    rpc_url: 'https://rpc.cosmos.directory/osmosis',
    rest_url: 'https://rest.cosmos.directory/osmosis',
    bip44: {
      coinType: 118
    },
    default_fee_token: 'uosmo',
    fee_tokens: [
      {
        denom: 'uosmo',
        coinDecimals: 6
      }
    ],
    staking_token: 'uosmo',
    default_gas_price: 0.025,
    gas_price_step: {
      low: 0.01,
      average: 0.025,
      high: 0.04
    }
  },
  {
    chain_id: 'juno-1',
    chain_name: 'juno',
    pretty_name: 'Juno',
    bech32_prefix: 'juno',
    rpc_url: 'https://rpc.cosmos.directory/juno',
    rest_url: 'https://rest.cosmos.directory/juno',
    bip44: {
      coinType: 118
    },
    default_fee_token: 'ujuno',
    fee_tokens: [
      {
        denom: 'ujuno',
        coinDecimals: 6
      }
    ],
    staking_token: 'ujuno',
    default_gas_price: 0.04,
    gas_price_step: {
      low: 0.03,
      average: 0.04,
      high: 0.05
    }
  },
  {
    chain_id: 'elfagar-1',
    chain_name: 'stargazetestnet',
    pretty_name: 'Stargaze Testnet',
    bech32_prefix: 'stars',
    rpc_url: 'https://rpc.elgafar-1.stargaze-apis.com',
    rest_url: 'https://rest.elgafar-1.stargaze-apis.com',
    bip44: {
      coinType: 118
    },
    default_fee_token: 'ustars',
    fee_tokens: [
      {
        denom: 'ustars',
        coinDecimals: 6
      }
    ],
    staking_token: 'ustars',
    default_gas_price: 0.03,
    gas_price_step: {
      low: 0.03,
      average: 0.04,
      high: 0.05
    }
  },
  {
    chain_id: 'osmo-test-4',
    chain_name: 'osmosistestnet',
    pretty_name: 'Osmosis Testnet',
    bech32_prefix: 'osmo',
    rpc_url: 'https://rpc-test.osmosis.zone:443',
    rest_url: 'https://api-test.osmosis.zone',
    bip44: {
      coinType: 118
    },
    default_fee_token: 'uosmo',
    fee_tokens: [
      {
        denom: 'uosmo',
        coinDecimals: 6
      }
    ],
    staking_token: 'uosmo',
    default_gas_price: 0.025,
    gas_price_step: {
      low: 0,
      average: 0.025,
      high: 0.04
    }
  },
  {
    chain_id: 'uni-6',
    chain_name: 'junotestnet',
    pretty_name: 'Juno Testnet',
    bech32_prefix: 'juno',
    rpc_url: 'https://uni-rpc.reece.sh/',
    rest_url: 'https://uni-api.reece.sh/',
    bip44: {
      coinType: 118
    },
    default_fee_token: 'ujunox',
    fee_tokens: [
      {
        denom: 'ujunox',
        coinDecimals: 6
      }
    ],
    staking_token: 'ujunox',
    default_gas_price: 0.04,
    gas_price_step: {
      low: 0.03,
      average: 0.04,
      high: 0.05
    }
  }
];
