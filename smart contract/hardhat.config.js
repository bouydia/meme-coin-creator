require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

const { ALCHEMY_API_KEY, AMOY_PRIVATE_KEY } = process.env

module.exports = {
  solidity: '0.8.27',
  networks: {
    amoy: {
      //url: `https://eth-amoy.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      url: `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${AMOY_PRIVATE_KEY}`],
    },
  },
}
