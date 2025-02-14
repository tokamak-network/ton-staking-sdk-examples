// client.ts

import { createWalletClient, createPublicClient, custom, http , Address} from "viem";
import { sepolia, mainnet  } from "viem/chains";
import "viem/window";
import {
  TonStakingClient,
  ITonStakingClient,
  ITonStakingContractsInfo,
} from "@tokamak-network/ton-staking-sdk";


export const newTonStakingClient = async (
    chainId: number | undefined,
    account: Address | undefined
  ) => {
      try {
        let transport;
        if (window?.ethereum) {
          transport = http(window?.ethereum);
        } else {
          const errorMessage =
            "MetaMask or another web3 wahellollet is not installed. Please install one to proceed.";
          throw new Error(errorMessage);
        }

        const tonStakingClient = new TonStakingClient(
          {
            chainId: chainId,
            http: transport
          },
          account,
          ConnectPublicClient(),
          ConnectWalletClient()
        );
        // if(tonStakingContracts!= undefined) tonStakingContracts = undefined

        return tonStakingClient;

      } catch (error) {
        console.log(`newTonStakingClient failed: ${error}`)
        // Error handling
        // alert(`newTonStakingClient failed: ${error}`);
      }
  }


export function ConnectTonStakingClient(chainId: number) {

  console.log("ConnectTonStakingClient", chainId)

  let transport;
  if (window?.ethereum) {
    transport = http(window?.ethereum);
  } else {
    const errorMessage =
      "MetaMask or another web3 wahellollet is not installed. Please install one to proceed.";
    throw new Error(errorMessage);
  }
  const tonStakingClient = new TonStakingClient({
    chainId: chainId,
    http: transport,
  });
  return tonStakingClient;
}

export function ConnectWalletClient() {
  let transport;
  if (window?.ethereum) {
    transport = custom(window?.ethereum);
  } else {
    const errorMessage =
      "MetaMask or another web3 wahellollet is not installed. Please install one to proceed.";
    throw new Error(errorMessage);
  }

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: transport,
  });
  return walletClient;
}

export function ConnectPublicClient() {
  let transport;
  if (window?.ethereum) {
    transport = custom(window?.ethereum);
  } else {
    const errorMessage =
      "MetaMask or another web3 wallet is not installed. Please install one to proceed.";
    throw new Error(errorMessage);
  }
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: transport,
  });
  return publicClient;
}
