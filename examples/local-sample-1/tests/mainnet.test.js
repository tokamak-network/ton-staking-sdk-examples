const { TonStakingClient, ContractNames } = require('@tokamak-network/ton-staking-sdk')
const { privateKeyToAccount } = require('viem/accounts')
const { toHex, parseEther } = require('viem')

const dotenv = require("dotenv")
dotenv.config()

const main = async () => {

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`)
    const tsClient = new TonStakingClient(
      {
        chainId: 1,
        rpcUrl: `${process.env.ETH_NODE_URI_MAINNET}`,
      },
      account  // Required when setting up walletClient. Used when sending transactions to an account.
    )

    //==============================
    const data1 = await tsClient.readContractWithName({
        contract: ContractNames.TON,
        functionName: 'totalSupply',
      })

    console.log(' TON totalSupply ', data1)

    //==============================
    const addr = '0x71a4bcdc06cf271344d65f7a7bba67bd6b005520'
    const balance = await tsClient.readContractWithName({
      contract: ContractNames.TON,
      functionName: 'balanceOf',
      args: [addr]
    })
    console.log(' '+addr+' balance ', balance)

    const contractAddresses = tsClient.getContractAddresses()

    //==============================
    const code = await tsClient.getCode({
      address: contractAddresses.TON
    })
    console.log(' TON code.length', code?.length)
    //==============================
    // You must set your rpcUrl when creating TonStakingClient, otherwise it will fail to fetch.
    // Fetch event logs for every event
    const fromBlock = 21838072
    const toBlock = 21863037
    const logs = await tsClient.getContractEvents({
      contract: ContractNames.TON,
      eventName: 'Transfer',
      fromBlock: toHex(fromBlock),
      toBlock: toHex(toBlock)
    })
    console.log(' TON Transfer Event Counts ', logs.length)

    //==============================
    const slot0 = await tsClient.getStorageAt({
      address: contractAddresses.WTON,
      slot: toHex(0),
    })

    console.log(' WTON slot0 : ', slot0)

    //==============================
    const res = await tsClient.simulateContract({
      contract: ContractNames.TON,
      functionName: 'balanceOf',
      args: [addr]
    })
    console.log(' '+addr+' simulate balance ', res)

    //==============================
    // const to = "0xc1eba383D94c6021160042491A5dfaF1d82694E6"
    // const gas = await tsClient.estimateContractGas({
    //   contract: ContractNames.TON,
    //   functionName: 'transfer',
    //   args: [to, parseEther('1')]
    // })
    // console.log(' '+addr+' transfer estimateContractGas : ', gas)
    //==============================

    // const res0 = await tsClient.writeContract({
    //   contract: ContractNames.TON,
    //   functionName: 'transfer',
    //   args: [to, parseEther('1')]
    // })
    // console.log(' '+addr+' transfer hash', res0)

    //==============================
    let res1 =
     ( await tsClient.multiReadContractsWithName({
        contracts: [
          {
            contract: ContractNames.TON,
            functionName: 'totalSupply',
          },
          {
            contract: ContractNames.TON,
            functionName: 'balanceOf',
            args: ['0x71a4bcdc06cf271344d65f7a7bba67bd6b005520']
          },
          {
            contract: ContractNames.SeigManager,
            functionName: 'stakeOf',
            args: ['0x71a4bcdc06cf271344d65f7a7bba67bd6b005520']
          },
          {
            contract: ContractNames.SeigManager,
            functionName: 'stakeOfTotal',
            args: []
          },
        ]
      })
    )?.map((v)=>v.result)

    console.log(' multiReadContractsWithName', res1)

    //==============================
    // const unwatch =  await tsClient.watchContractEvent({
    //   contract: ContractNames.TON,
    //   eventName: 'Transfer',
    //   onError: error => console.log(error),
    //   onLogs: logs => {
    //     console.log(logs)
    //     // unwatch()
    //   }
    // })
    // console.log(' watchContractEvent unwatch', unwatch)

    // unwatch()

    //==============================
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
