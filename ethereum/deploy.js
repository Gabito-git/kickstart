const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const util = require('util'); 

// const { abi, evm } = require('./compile');
const { abi, evm }  = require('../ethereum/build/CampaignFactory.json');

provider = new HDWalletProvider(
  'brass strategy cake minimum salt adjust bring program say hold milk palace',
  'https://sepolia.infura.io/v3/4c2e043e5b1a4713a272ee4e6ba323de'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: '2000000', from: accounts[0] });
  
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();