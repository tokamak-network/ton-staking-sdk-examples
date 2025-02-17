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

interface CandidatePropsInterface {
  candidateAddress : string | null
}


export const CandidateComponent = (props: CandidatePropsInterface) => {
  const { candidateAddress } = props;
  console.log("CandidateComponent candidateAddress ", candidateAddress);
  const {address, chainId, status, isConnecting, isDisconnected, isConnected, isReconnecting } = useAccount();
  // console.log("CandidatesComponent render", address, chainId,);
  const context: UserContextType | null = useContext(UserContext);
  let tonStakingClient: ITonStakingClient

  const [candidate, setCandidate] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [totalStakedAmount, setTotalStakedAmount] = useState<bigint>(BigInt(0));
  const [totalPendingWithdrawalAmount, setTotalPendingWithdrawalAmount] = useState<bigint>(BigInt(0));
  const [lastUpdateSeigniorageTx, setLastUpdateSeigniorageTx] = useState<string | null>(null)
  const [latestTransactions, setLatestTransactions] = useState<Array<string> | null>(null)
  const [myStakedAmount, setMyStakedAmount] = useState<bigint>(BigInt(0));
  const [myUnclaimedAmount, setMyUnclaimedAmount] = useState<bigint>(BigInt(0));
  const [myWithdrawableAmount, setMyWithdrawableAmount] = useState<bigint>(BigInt(0));

  useEffect(() => {
    tonStakingClient = context?.state.tonStakingClient
    if(tonStakingClient != null) {
      // handleClick()
    }
  }, [context?.state.tonStakingClient])

  useEffect(() => {
    console.log('useEffect candidateAddress')
    setCandidate(candidateAddress);
  }, [candidateAddress])

  useEffect(() => {
    console.log('useEffect candidate')
    tonStakingClient = context?.state.tonStakingClient
    if(tonStakingClient != null) {
      getCandidateInfos()
    }
  }, [candidate])

  async function getCandidateInfos() {
    console.log('getCandidateInfos', candidate)
    try {
      if(tonStakingClient !== undefined && candidate != null) {

        const contractInfo = await tonStakingClient.getContractInfos()
        const candidateDetailed = await tonStakingClient.multiReadContracts(
          {
            contracts: [
              {
                address: candidate,
                abi: contractInfo.Candidate.abi,
                functionName: 'operator',
                args: []
              },
              {
                address: candidate,
                abi: contractInfo.Candidate.abi,
                functionName: 'totalStaked',
                args: []
              },
              {
                address: contractInfo.DepositManager.address,
                abi: contractInfo.DepositManager.abi,
                functionName: 'pendingUnstakedLayer2',
                args: [candidate]
              },
              {
                address: contractInfo.SeigManager.address,
                abi: contractInfo.SeigManager.abi,
                functionName: 'stakeOf',
                args: [candidate, address]
              }
            ]
          }
        )
        // console.log(candidateDetailed)
        setOperator(candidateDetailed[0].status=="success"?candidateDetailed[0].result:BigInt(0))
        setTotalStakedAmount(candidateDetailed[1].status=="success"?candidateDetailed[1].result:BigInt(0))
        setTotalPendingWithdrawalAmount(candidateDetailed[2].status=="success"?candidateDetailed[2].result:BigInt(0))
        setMyStakedAmount(candidateDetailed[3].status=="success"?candidateDetailed[3].result:BigInt(0))
      }
    } catch (error) {
      console.log(`getCandidateInfos failed: ${error}`)
    }
  }


  if (isConnected) {
    return (

       <Card className="relative bg-pink-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
                   <div className="bg-pink-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
                   <div className="bg-pink-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
                   <CardHeader>
                     <CardTitle className="text-2xl">
                       DAO Candidate
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-7">
                   <div className="space-y-1">
                      <h3 className="text-lg font-semibold"> </h3>
                      <div className="space-y-2">
                      candidate: {candidate} <br/>
                      operator: {operator}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">TON Staked</h3>
                      <div className="space-y-2">
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - Total Staked Amount {totalStakedAmount}</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - Total Pending Withdrawals {totalPendingWithdrawalAmount}</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - Last Update Seigniorage {lastUpdateSeigniorageTx}</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - Latest Transactions {latestTransactions}</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">My Staked</h3>
                      <div className="space-y-1">
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - My Staked Amount {myStakedAmount}</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - Unclaimed Staking Amount {myUnclaimedAmount}</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - My Withdrawable Amount {myWithdrawableAmount}</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
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
        DAO Candidate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-7">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">TON Staked</h3>
          <div className="space-y-2">
            <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                <span className="hover:mr-1 duration-300"> - Total Staked Amount </span>
                <ArrowRight className="h-5 w-5" />
            </a>
            <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                <span className="hover:mr-1 duration-300"> - Pending Withdrawals</span>
                <ArrowRight className="h-5 w-5" />
            </a>
            <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                <span className="hover:mr-1 duration-300"> - Last Update Seigniorage</span>
                <ArrowRight className="h-5 w-5" />
            </a>
            <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                <span className="hover:mr-1 duration-300"> Latest Transactions</span>
                <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">My Staked</h3>
          <div className="space-y-1">
            <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                <span className="hover:mr-1 duration-300"> My Staked Amount</span>
                <ArrowRight className="h-5 w-5" />
            </a>
            <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                <span className="hover:mr-1 duration-300"> Unclaimed Staking Amount </span>
                <ArrowRight className="h-5 w-5" />
            </a>
            <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                <span className="hover:mr-1 duration-300"> My Withdrawable Amount </span>
                <ArrowRight className="h-5 w-5" />
            </a>
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
                     DAO Candidate
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-7">
                     <div className="space-y-1">
                      <h3 className="text-lg font-semibold">TON Staked</h3>
                      <div className="space-y-2">
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - Total Staked Amount</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - Pending Withdrawals</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - Last Update Seigniorage</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> - Latest Transactions</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">My Staked</h3>
                      <div className="space-y-1">
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> My Staked Amount</span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> Unclaimed Staking Amount </span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a className="flex items-center gap-2 w-fit text-white text-opacity-80 cursor-pointer transition-colors">
                            <span className="hover:mr-1 duration-300"> My Withdrawable Amount </span>
                            <ArrowRight className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                   </CardContent>
                 </Card>
    )
  }
}
