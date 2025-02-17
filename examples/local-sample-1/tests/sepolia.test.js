const { TonStakingClient, ContractNames } = require('@tokamak-network/ton-staking-sdk')
const { privateKeyToAccount } = require('viem/accounts')
const { toHex, parseEther } = require('viem')

const dotenv = require("dotenv")
dotenv.config()

const main = async () => {

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`)
    const tsClient = new TonStakingClient(
      {
        chainId: 11155111,
        rpcUrl: `${process.env.ETH_NODE_URI_SEPOLIA}`,
      },
      account  // Required when setting up walletClient. Used when sending transactions to an account.
    )

    //==============================
    const data1 = await tsClient.readContractWithName({
        contract: ContractNames.TON,
        functionName: 'totalSupply',
      })

    console.log('Sepolia TON totalSupply ', data1)

    //==============================
    const addr = '0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2'
    const balance = await tsClient.readContractWithName({
      contract: ContractNames.TON,
      functionName: 'balanceOf',
      args: [addr]
    })
    console.log('Sepolia '+addr+' balance ', balance)

    const contractAddresses = tsClient.getContractAddresses()

    //==============================
    const code = await tsClient.getCode({
      address: contractAddresses.TON
    })
    console.log('Sepolia TON code.length', code?.length)
    //==============================
    // You must set your rpcUrl when creating TonStakingClient, otherwise it will fail to fetch.
    // Fetch event logs for every event
    const fromBlock = 6401948
    const toBlock = 7649618
    const logs = await tsClient.getContractEvents({
      contract: ContractNames.TON,
      eventName: 'Transfer',
      fromBlock: toHex(fromBlock),
      toBlock: toHex(toBlock)
    })
    console.log('Sepolia TON Transfer Event Counts ', logs.length)

    //==============================
    const slot0 = await tsClient.getStorageAt({
      address: contractAddresses.WTON,
      slot: toHex(0),
    })

    console.log('Sepolia WTON slot0 : ', slot0)

    //==============================
    const res = await tsClient.simulateContract({
      contract: ContractNames.TON,
      functionName: 'balanceOf',
      args: [addr]
    })
    console.log('Sepolia '+addr+' simulate balance ', res)

    //==============================
    const to = "0xc1eba383D94c6021160042491A5dfaF1d82694E6"
    const gas = await tsClient.estimateContractGas({
      contract: ContractNames.TON,
      functionName: 'transfer',
      args: [to, parseEther('1')]
    })
    console.log('Sepolia '+addr+' transfer estimateContractGas : ', gas)
    //==============================

    const res0 = await tsClient.writeContract({
      contract: ContractNames.TON,
      functionName: 'transfer',
      args: [to, parseEther('1')]
    })
    console.log('Sepolia '+addr+' transfer hash', res0)

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
            args: ['0xc1eba383D94c6021160042491A5dfaF1d82694E6']
          },
          {
            contract: ContractNames.SeigManager,
            functionName: 'stakeOf',
            args: ['0xc1eba383D94c6021160042491A5dfaF1d82694E6']
          },
          {
            contract: ContractNames.SeigManager,
            functionName: 'stakeOfTotal',
            args: []
          },
        ]
      })
    )?.map((v)=>v.result)

    console.log('Sepolia multiReadContractsWithName', res1)

    //==============================
    const unwatch =  await tsClient.watchContractEvent({
      contract: ContractNames.TON,
      eventName: 'Transfer',
      onError: error => console.log(error),
      onLogs: logs => {
        console.log(logs)
        // unwatch()
      }
    })
    console.log('Sepolia watchContractEvent unwatch', unwatch)

    unwatch()

    //==============================

    //==============================

    const numLayer2s = await tsClient.readContractWithName({
      contract: ContractNames.Layer2Registry,
      functionName: 'numLayer2s',
      args: []
    })
    console.log('numLayer2s ', numLayer2s)

    //==============================
    const infos = await tsClient.getContractInfos()
    const layer2ByIndex0 = await tsClient.readContract({
      address: infos.Layer2Registry.address,
      abi: infos.Layer2Registry.abi,
      functionName: 'layer2ByIndex',
      args: [0]
    })
    console.log('layer2ByIndex0 ', layer2ByIndex0)

    //==============================
    const candidateInfos = await tsClient.multiReadContracts({
        contracts: [
          {
            address: layer2ByIndex0,
            abi: infos.Candidate.abi,
            functionName: 'operator',
            args: []
          },
          {
            address: layer2ByIndex0,
            abi: infos.Candidate.abi,
            functionName: 'totalStaked',
            args: []
          }
        ]
      }
    )
    console.log('candidateInfos ', candidateInfos)

    //==============================
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
