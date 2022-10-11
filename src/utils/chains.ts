export const chains = [
  {
    chain_name: 'osmosis',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://osmosis.zone/',
    update_link: 'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/chain.schema.json',
    pretty_name: 'Osmosis',
    chain_id: 'osmosis-1',
    bech32_prefix: 'osmo',
    daemon_name: 'osmosisd',
    node_home: '$HOME/.osmosisd',
    genesis: {
      genesis_url: 'https://github.com/osmosis-labs/networks/raw/main/osmosis-1/genesis.json'
    },
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: 'uosmo',
          fixed_min_gas_price: 0,
          low_gas_price: 0,
          average_gas_price: 0.025,
          high_gas_price: 0.04
        }
      ]
    },
    staking: {
      staking_tokens: [
        {
          denom: 'uosmo'
        }
      ]
    },
    codebase: {
      git_repo: 'https://github.com/osmosis-labs/osmosis',
      recommended_version: '11.0.0',
      compatible_versions: ['11.0.0'],
      binaries: {
        'linux/amd64':
          'https://github.com/osmosis-labs/osmosis/releases/download/v11.0.0/osmosisd-11.0.0-linux-amd64?checksum=sha256:d01423cf847b7f95a94ade8811bbf6dd9ec5938d46af0a14bc62caaaa7b7143e',
        'linux/arm64':
          'https://github.com/osmosis-labs/osmosis/releases/download/v11.0.0/osmosisd-11.0.0-linux-arm64?checksum=sha256:375699e90e5b76fd3d7e7a9ab631b40badd97140136f361e6b3f06be3fbd863d'
      },
      cosmos_sdk_version: '0.45',
      tendermint_version: '0.34',
      cosmwasm_version: '0.27',
      cosmwasm_enabled: true,
      genesis: {
        name: 'v3.1.0',
        genesis_url: 'https://github.com/osmosis-labs/networks/raw/main/osmosis-1/genesis.json'
      },
      versions: [
        {
          name: 'v3',
          tag: 'v3.1.0',
          height: 0,
          next_version_name: 'v4'
        },
        {
          name: 'v4',
          tag: 'v4.2.0',
          height: 1314500,
          next_version_name: 'v5'
        },
        {
          name: 'v5',
          tag: 'v6.4.1',
          height: 2383300,
          next_version_name: 'v7'
        },
        {
          name: 'v7',
          tag: 'v8.0.0',
          height: 3401000,
          next_version_name: 'v9'
        },
        {
          name: 'v9',
          tag: 'v10.0.1',
          height: 4707300,
          next_version_name: 'v11'
        },
        {
          name: 'v11',
          tag: 'v11.0.0',
          height: 5432450
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://osmosis-rpc.polkachu.com',
          provider: 'Polkachu'
        }
      ],
      rest: [
        {
          address: 'https://osmosis-api.polkachu.com',
          provider: 'Polkachu'
        }
      ],
      grpc: [
        {
          address: 'osmosis.strange.love:9090',
          provider: 'strangelove'
        },
        {
          address: 'https://osmosis-grpc.lavenderfive.com:443',
          provider: 'Lavender.Five Nodes 🐝'
        },
        {
          address: 'grpc-osmosis-ia.cosmosia.notional.ventures:443',
          provider: 'Notional'
        },
        {
          address: 'osmosis-grpc.polkachu.com:12590',
          provider: 'Polkachu'
        }
      ]
    },
    explorers: [
      {
        kind: 'mintscan',
        url: 'https://www.mintscan.io/osmosis',
        tx_page: 'https://www.mintscan.io/osmosis/txs/${txHash}',
        account_page: 'https://www.mintscan.io/osmosis/account/${accountAddress}'
      },
      {
        kind: 'ping.pub',
        url: 'https://ping.pub/osmosis',
        tx_page: 'https://ping.pub/osmosis/tx/${txHash}'
      },
      {
        kind: 'explorers.guru',
        url: 'https://osmosis.explorers.guru',
        tx_page: 'https://osmosis.explorers.guru/transaction/${txHash}',
        account_page: 'https://osmosis.explorers.guru/transaction/${accountAddress}'
      },
      {
        kind: 'atomscan',
        url: 'https://atomscan.com/osmosis',
        tx_page: 'https://atomscan.com/osmosis/transactions/${txHash}'
      }
    ],
    logo_URIs: {
      png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png'
    },
    keywords: ['dex']
  },
  {
    $schema: '../../chain.schema.json',
    chain_name: 'osmosistestnet',
    status: 'live',
    network_type: 'testnet',
    pretty_name: 'Osmosis Testnet',
    chain_id: 'osmo-test-4',
    bech32_prefix: 'osmo',
    daemon_name: 'osmosisd',
    node_home: '$HOME/.osmosisd',
    genesis: {
      genesis_url: 'https://github.com/osmosis-labs/networks/raw/main/osmo-test-4/genesis.tar.bz2'
    },
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: 'uosmo',
          fixed_min_gas_price: 0,
          low_gas_price: 0,
          average_gas_price: 0.025,
          high_gas_price: 0.04
        }
      ]
    },
    staking: {
      staking_tokens: [
        {
          denom: 'uosmo'
        }
      ]
    },
    codebase: {
      git_repo: 'https://github.com/osmosis-labs/osmosis',
      recommended_version: 'v11.0.0',
      compatible_versions: ['v11.0.0'],
      cosmos_sdk_version: '0.45',
      tendermint_version: '0.34',
      cosmwasm_version: '0.24',
      cosmwasm_enabled: true
    },
    peers: {
      seeds: [
        {
          id: '0f9a9c694c46bd28ad9ad6126e923993fc6c56b1',
          address: '137.184.181.105:26656',
          provider: ''
        }
      ],
      persistent_peers: [
        {
          id: '4ab030b7fd75ed895c48bcc899b99c17a396736b',
          address: '137.184.190.127:26656',
          provider: ''
        },
        {
          id: '3dbffa30baab16cc8597df02945dcee0aa0a4581',
          address: '143.198.139.33:26656',
          provider: ''
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://osmosistest-rpc.quickapi.com/',
          provider: 'ChainLayer'
        }
      ],
      rest: [
        {
          address: 'https://osmosistest-lcd.quickapi.com/',
          provider: 'CryptoCrew'
        }
      ],
      grpc: []
    },
    logo_URIs: {
      png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png'
    },
    keywords: ['dex', 'testnet']
  },
  {
    $schema: '../chain.schema.json',
    chain_name: 'juno',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://www.junonetwork.io/',
    pretty_name: 'Juno',
    chain_id: 'juno-1',
    bech32_prefix: 'juno',
    daemon_name: 'junod',
    node_home: '$HOME/.juno',
    genesis: {
      genesis_url: 'https://download.dimi.sh/juno-phoenix2-genesis.tar.gz'
    },
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: 'ujuno',
          low_gas_price: 0.03,
          average_gas_price: 0.04,
          high_gas_price: 0.05
        }
      ]
    },
    staking: {
      staking_tokens: [
        {
          denom: 'ujuno'
        }
      ]
    },
    codebase: {
      git_repo: 'https://github.com/CosmosContracts/juno',
      recommended_version: 'v9.0.0',
      compatible_versions: ['v9.0.0'],
      cosmos_sdk_version: '0.45',
      tendermint_version: '0.34',
      cosmwasm_version: '0.27',
      cosmwasm_enabled: true
    },
    apis: {
      rpc: [
        {
          address: 'https://juno-rpc.polkachu.com',
          provider: 'Polkachu'
        }
      ],
      rest: [
        ,
        {
          address: 'https://juno-api.polkachu.com',
          provider: 'Polkachu'
        }
      ]
    },
    explorers: [
      {
        kind: 'ping.pub',
        url: 'https://ping.pub/juno',
        tx_page: 'https://ping.pub/juno/tx/${txHash}'
      },
      {
        kind: 'explorers.guru',
        url: 'https://juno.explorers.guru',
        tx_page: 'https://juno.explorers.guru/transaction/${txHash}'
      },
      {
        kind: 'mintscan',
        url: 'https://www.mintscan.io/juno',
        tx_page: 'https://www.mintscan.io/juno/txs/${txHash}'
      },
      {
        kind: 'atomscan',
        url: 'https://atomscan.com/juno',
        tx_page: 'https://atomscan.com/juno/transactions/${txHash}'
      }
    ]
  },
  {
    $schema: '../../chain.schema.json',
    chain_name: 'junotestnet',
    status: 'live',
    network_type: 'testnet',
    pretty_name: 'Juno Testnet',
    chain_id: 'uni-5',
    bech32_prefix: 'juno',
    daemon_name: 'junod',
    node_home: '$HOME/.juno',
    genesis: {
      genesis_url: 'https://raw.githubusercontent.com/CosmosContracts/testnets/main/uni-5/genesis.json'
    },
    key_algos: ['secp256k1'],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: 'ujunox',
          low_gas_price: 0.03,
          average_gas_price: 0.04,
          high_gas_price: 0.05
        }
      ]
    },
    staking: {
      staking_tokens: [
        {
          denom: 'ujunox'
        }
      ]
    },
    codebase: {
      git_repo: 'https://github.com/CosmosContracts/juno',
      recommended_version: 'v9.0.0',
      compatible_versions: ['v9.0.0'],
      cosmos_sdk_version: '0.45',
      tendermint_version: '0.34',
      cosmwasm_version: '0.27',
      cosmwasm_enabled: true
    },
    peers: {
      seeds: [],
      persistent_peers: [
        {
          id: 'ed90921d43ede634043d152d7a87e8881fb85e90',
          address: '65.108.77.106:26709',
          provider: 'EZStaking.io'
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc.uni.juno.deuslabs.fi:443',
          provider: 'Deuslab'
        }
      ],
      rest: [
        {
          address: 'https://lcd.uni.juno.deuslabs.fi',
          provider: 'Deuslab'
        }
      ],
      grpc: [
        {
          address: 'juno-testnet-grpc.polkachu.com:12690',
          provider: 'Polkachu'
        }
      ]
    },
    explorers: [
      {
        kind: 'Mintscan',
        url: 'https://testnet.mintscan.io/juno-testnet',
        tx_page: 'https://testnet.mintscan.io/juno-testnet/txs/${txHash}'
      },
      {
        kind: 'NodesGuru',
        url: 'https://testnet.juno.explorers.guru/',
        tx_page: 'https://testnet.juno.explorers.guru/transaction/${txHash}'
      }
    ]
  },
  {
    $schema: '../chain.schema.json',
    chain_name: 'stargaze',
    status: 'live',
    network_type: 'mainnet',
    website: 'https://stargaze.zone/',
    pretty_name: 'Stargaze',
    chain_id: 'stargaze-1',
    bech32_prefix: 'stars',
    daemon_name: 'starsd',
    node_home: '$HOME/.starsd',
    slip44: 118,
    genesis: {
      genesis_url: 'https://raw.githubusercontent.com/public-awesome/mainnet/main/stargaze-1/genesis.tar.gz'
    },
    codebase: {
      git_repo: 'https://github.com/public-awesome/stargaze',
      recommended_version: 'v7.0.0',
      compatible_versions: ['v7.0.0']
    },
    apis: {
      rpc: [
        {
          address: 'https://stargaze-rpc.polkachu.com',
          provider: 'Polkachu'
        }
      ],
      rest: [
        {
          address: 'https://rest.stargaze-apis.com/',
          provider: 'Stargaze Foundation'
        },
        {
          address: 'https://api.stargaze.pupmos.network/',
          provider: 'PUPMØS'
        },
        {
          address: 'https://api.stargaze.ezstaking.io/',
          provider: 'EZStaking.io'
        },
        {
          address: 'https://api.stars.kingnodes.com/',
          provider: 'kingnodes'
        },
        {
          address: 'https://api-stargaze-ia.cosmosia.notional.ventures/',
          provider: 'Notional'
        },
        {
          address: 'https://stargaze.c29r3.xyz:443/api/',
          provider: 'c29r3'
        },
        {
          address: 'https://stargaze-rapipc.polkachu.com',
          provider: 'Polkachu'
        },
        {
          address: 'https://api.stargaze.nodestake.top',
          provider: 'NodeStake'
        }
      ],
      grpc: [
        {
          address: 'grpc-stargaze-ia.cosmosia.notional.ventures:443',
          provider: 'Notional'
        },
        {
          address: 'stargaze-grpc.polkachu.com:13790',
          provider: 'Polkachu'
        },
        {
          address: 'https://grpc.stargaze.nodestake.top',
          provider: 'NodeStake'
        }
      ]
    },
    explorers: [
      {
        kind: 'mintscan',
        url: 'https://www.mintscan.io/stargaze/',
        tx_page: 'https://www.mintscan.io/stargaze/txs/${txHash}'
      },
      {
        kind: 'ping-pub',
        url: 'https://ping.pub/stargaze',
        tx_page: 'https://ping.pub/stargaze/tx/${txHash}'
      },
      {
        kind: 'atomscan',
        url: 'https://atomscan.com/stargaze',
        tx_page: 'https://atomscan.com/stargaze/transactions/${txHash}'
      }
    ]
  }
];
