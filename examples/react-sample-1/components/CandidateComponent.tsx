"use client";
import { useAccount  } from "wagmi";
import {
    ITonStakingClient,
    ContractNames as TONContractName
} from "@tokamak-network/ton-staking-sdk";
import React, { useState, useEffect, useContext } from 'react';

import { UserContextType , UserContext } from "../app/user-context";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

import { formatAddress } from '../lib/utils';

export const CandidateComponent = () => {

  const {address, chainId, status, isConnecting, isDisconnected, isConnected, isReconnecting } = useAccount();
  // console.log("CandidatesComponent render", address, chainId,);
  const context: UserContextType | null = useContext(UserContext);
  let tonStakingClient: ITonStakingClient

  useEffect(() => {
    tonStakingClient = context?.state.tonStakingClient
    if(tonStakingClient != null) {
      // handleClick()
    }
  }, [context?.state.tonStakingClient])

  // async function handleClick() {
  //   try {
  //     if(tonStakingClient !== undefined) {
  //       const numLayer2s = await tonStakingClient.readContract({
  //         contract: TONContractName.Layer2Registry,
  //         functionName: 'numLayer2s',
  //         args: []
  //       })
  //       setNumLayer2s(numLayer2s)

  //       const args = []
  //       for (let i=0; i< numLayer2s; i++) {
  //         args.push({
  //             contract: TONContractName.Layer2Registry,
  //             functionName: 'layer2ByIndex',
  //             args: [i]
  //         })
  //       }

  //       if(args.length > 0) {
  //         const res1 = ( await tonStakingClient.multiReadContracts(
  //           { contracts: args }))?.map((v)=>v.result)
  //         // console.log(`layer2ByIndex: ${res1}`)
  //         setCandidates(res1)
  //       }
  //     }
  //   } catch (error) {
  //     // console.log(`handleClick failed: ${error}`)
  //   }
  // }

  // async function openCandidate() {
  //   console.log(`openCandidate clicked`)
  // }

  if (isConnected) {
    return (

       <Card className="relative bg-pink-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
                   <div className="bg-pink-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
                   <div className="bg-pink-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
                   <CardHeader>
                     <CardTitle className="text-2xl">
                       DAO
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-7">
                     <div className="space-y-1">
                       <h3 className="text-lg font-semibold">TON Staked </h3>
                       <div className="space-y-2">
                         {[
                           {url: "https://docs.metamask.io/sdk/guides/manage-networks/", text: "Manage networks"},
                           {url: "https://docs.metamask.io/sdk/guides/handle-transactions/", text: "Handle transactions"},
                           {url: "https://docs.metamask.io/sdk/guides/interact-with-contracts/", text: "Interact with smart contracts"},
                         ].map((item) => (
                           <a
                             href={item.url}
                             key={item.text}
                             target="_blank"
                             className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors"
                           >
                             <span className="hover:mr-1 duration-300">{item.text}</span>
                             <ArrowRight className="h-5 w-5" />
                           </a>
                         ))}
                       </div>
                     </div>
                     <div className="space-y-1">
                       <h3 className="text-lg font-semibold">Your Staked </h3>
                       <div className="space-y-1">
                         {[
                           {url: "https://github.com/MetaMask/metamask-sdk-examples/tree/main/examples/quickstart", text: "Next.js + Wagmi"},
                         ].map((item) => (
                           <a
                             href={item.url}
                             key={item.text}
                             target="_blank"
                             className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors"
                           >
                             <span className="hover:mr-1 duration-300">{item.text}</span>
                             <ArrowRight className="h-5 w-5" />
                           </a>
                         ))}
                       </div>
                     </div>
                   </CardContent>
                 </Card>
    )
  }

  if (isDisconnected) {
    return (
      <Card className="relative bg-pink-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
      <div className="bg-pink-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
      <div className="bg-pink-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
      <CardHeader>
        <CardTitle className="text-2xl">
          Add your own functionality
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-7">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Guides</h3>
          <div className="space-y-2">
            {[
              {url: "https://docs.metamask.io/sdk/guides/manage-networks/", text: "Manage networks"},
              {url: "https://docs.metamask.io/sdk/guides/handle-transactions/", text: "Handle transactions"},
              {url: "https://docs.metamask.io/sdk/guides/interact-with-contracts/", text: "Interact with smart contracts"},
            ].map((item) => (
              <a
                href={item.url}
                key={item.text}
                target="_blank"
                className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors"
              >
                <span className="hover:mr-1 duration-300">{item.text}</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Examples</h3>
          <div className="space-y-1">
            {[
              {url: "https://github.com/MetaMask/metamask-sdk-examples/tree/main/examples/quickstart", text: "Next.js + Wagmi"},
            ].map((item) => (
              <a
                href={item.url}
                key={item.text}
                target="_blank"
                className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors"
              >
                <span className="hover:mr-1 duration-300">{item.text}</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
    )
  }

  if (isConnecting) {
    return (
      <Card className="relative bg-pink-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
                   <div className="bg-pink-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
                   <div className="bg-pink-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
                   <CardHeader>
                     <CardTitle className="text-2xl">
                       Add your own functionality
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-7">
                     <div className="space-y-1">
                       <h3 className="text-lg font-semibold">Guides</h3>
                       <div className="space-y-2">
                         {[
                           {url: "https://docs.metamask.io/sdk/guides/manage-networks/", text: "Manage networks"},
                           {url: "https://docs.metamask.io/sdk/guides/handle-transactions/", text: "Handle transactions"},
                           {url: "https://docs.metamask.io/sdk/guides/interact-with-contracts/", text: "Interact with smart contracts"},
                         ].map((item) => (
                           <a
                             href={item.url}
                             key={item.text}
                             target="_blank"
                             className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors"
                           >
                             <span className="hover:mr-1 duration-300">{item.text}</span>
                             <ArrowRight className="h-5 w-5" />
                           </a>
                         ))}
                       </div>
                     </div>
                     <div className="space-y-1">
                       <h3 className="text-lg font-semibold">Examples</h3>
                       <div className="space-y-1">
                         {[
                           {url: "https://github.com/MetaMask/metamask-sdk-examples/tree/main/examples/quickstart", text: "Next.js + Wagmi"},
                         ].map((item) => (
                           <a
                             href={item.url}
                             key={item.text}
                             target="_blank"
                             className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors"
                           >
                             <span className="hover:mr-1 duration-300">{item.text}</span>
                             <ArrowRight className="h-5 w-5" />
                           </a>
                         ))}
                       </div>
                     </div>
                   </CardContent>
                 </Card>
    )
  }
}
