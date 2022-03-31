import { config as dotenvConfig } from 'dotenv-flow';

import { task } from "hardhat/config"
import '@nomiclabs/hardhat-truffle5';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import '@nomiclabs/hardhat-solhint';
import 'prettier-plugin-solidity';
import 'solidity-coverage';
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'

dotenvConfig();

export default {
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./scripts/deploy"
  },
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */
  //61e2db80d80fef89b7a5fa748cf46471cb2fa91f0248ee36675d5e28a84d932b
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  external: {
    contracts: [
      {
        artifacts: "./precompiled",
      },
    ],
  },
  namedAccounts: {
    deployer: 0
  },
  networks: {
    hardhat: {
      accounts:{mnemonic:process.env.MNEMONIC},
      chainId: 1
    },
    xdclocal: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 1337
    },
    kovan: {
      url: "https://kovan.infura.io/v3/72739b10fa5a4ee1886888e5ae2a248f",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      gasPrice: 3e9,
      gas: 6.9e6,
      chainId: 42
    },
  },
  mocha: {
    timeout: 100000
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ""
  },
}

task("upgrade", "Upgrade smart contract")
  .addPositionalParam("contract", "Name of a smart contract")
  .addPositionalParam("address", "Contract's proxy address")
  .addOptionalParam("signer", "Named signer for upgrade transaction", "deployer")
  .setAction(async (args, hre) => {
    const { upgradeProxy } = require("./scripts/deploy-utils");

    const accounts = await hre.getNamedAccounts();
    const signer = accounts[args.signer];

    if (!signer) {
      throw new Error("Unknown signer!");
    }

    if (!hre.ethers.utils.isAddress(args.address)) {
      throw Error(`Invalid contract address ${args.address}`)
    }

    const { contract, receipt } = await upgradeProxy(args.contract, args.address, signer);
  })
