const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules')
const ethers = require('ethers')

module.exports = buildModule('my_creator', m => {
  const name = 'MemeToken'
  const symbol = 'MEME'
  const description = 'A fun meme token'
  const image = 'https://example.com/meme-image.png'
  const initialSupply = ethers.parseUnits('1000', 18)
  const maxSupply = ethers.parseUnits('1000000', 18)

  const token = m.contract('MemeToken', [
    name,
    symbol,
    description,
    image,
    initialSupply,
    maxSupply,
  ])

  return { token }
})
