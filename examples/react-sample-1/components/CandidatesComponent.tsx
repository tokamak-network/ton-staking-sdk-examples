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

import {CandidateComponent} from '@/components/CandidateComponent'

export const CandidatesComponent = () => {

  const {address, chainId, status, isConnecting, isDisconnected, isConnected, isReconnecting } = useAccount();
  // console.log("CandidatesComponent render", address, chainId,);
  const context: UserContextType | null = useContext(UserContext);
  let tonStakingClient: ITonStakingClient
  const [candidates, setCandidates] = useState<Array<string> | null>(null);
  const [numLayer2s, setNumLayer2s] = useState<number>(0);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  useEffect(() => {
    tonStakingClient = context?.state.tonStakingClient
    if(tonStakingClient != null) {
      handleClick()
    }
  }, [context?.state.tonStakingClient])

  async function handleClick() {
    try {
      if(tonStakingClient !== undefined) {
        const numLayer2s = await tonStakingClient.readContract({
          contract: TONContractName.Layer2Registry,
          functionName: 'numLayer2s',
          args: []
        })
        setNumLayer2s(numLayer2s)

        const args = []
        for (let i=0; i< numLayer2s; i++) {
          args.push({
              contract: TONContractName.Layer2Registry,
              functionName: 'layer2ByIndex',
              args: [i]
          })
        }

        if(args.length > 0) {
          const res1 = ( await tonStakingClient.multiReadContracts(
            { contracts: args }))?.map((v)=>v.result)
          // console.log(`layer2ByIndex: ${res1}`)
          setCandidates(res1)
        }
      }
    } catch (error) {
      // console.log(`handleClick failed: ${error}`)
    }
  }

  async function openCandidate(key:string) {
    console.log(`openCandidate clicked`, key)
    setSelectedCandidate(key);
  }

  if (isConnected) {
    return (
      <div className="flex gap-10">
      <Card className="relative bg-indigo-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
         <div className="bg-indigo-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
         <div className="bg-indigo-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
         <CardHeader>
           <CardTitle className="text-2xl">
             DAO Candidates {numLayer2s}
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-7">
           <div className="space-y-1">
             {candidates?.map((item) => (
                <a
                  target="_blank"
                  className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors"
                  onClick={()=>openCandidate(item)}
                >
                  <span className="hover:mr-1 duration-300">{item}</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              ))}
           </div>
         </CardContent>
       </Card>
        <CandidateComponent candidateAddress={selectedCandidate}/>
        </div>
    )
  }

  if (isDisconnected) {
    return (
      <div className="flex gap-10">
      <Card className="relative bg-indigo-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
         <div className="bg-indigo-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
         <div className="bg-indigo-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
         <CardHeader>
           <CardTitle className="text-2xl">
             DAO Candidates
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-7">
           <div className="space-y-1">
             {candidates?.map((item) => (
                <a
                  key={item}
                  target="_blank"
                  className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors"
                  onClick={openCandidate}
                >
                  <span className="hover:mr-1 duration-300">{item}</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              ))}
           </div>
         </CardContent>
       </Card>
       <CandidateComponent candidateAddress={selectedCandidate}/>
   </div>
    )
  }

  if (isConnecting) {
    return (
      <div className="flex gap-10">
         <Card className="relative bg-indigo-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
            <div className="bg-indigo-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
            <div className="bg-indigo-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
            <CardHeader>
              <CardTitle className="text-2xl">
                DAO Candidates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-7">
              <div className="space-y-1">
              {candidates?.map((item) => (
                <a
                  key={item}
                  target="_blank"
                  className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors"
                >
                  <span className="hover:mr-1 duration-300">{item}</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              ))}
              </div>
            </CardContent>
          </Card>
          <CandidateComponent candidateAddress={selectedCandidate}/>
      </div>
    )
  }
}
