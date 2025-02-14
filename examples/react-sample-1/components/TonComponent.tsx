"use client";
import { useAccount  } from "wagmi";
import {
    ITonStakingClient,
    ITonStakingContractsInfo,
    ContractNames as TONContractName
} from "@tokamak-network/ton-staking-sdk";
import React, { useState, useEffect } from 'react';

import { UserContextType  } from "../app/user-contextr";
import { useUserContext  } from "../app/user-context-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Address } from 'viem';
import { formatAddress } from '../lib/utils';
import {newTonStakingClient} from '../app/client'

export const TonComponent = () => {
  const {address, chainId, status, isConnecting, isDisconnected, isConnected } = useAccount();
  // console.log("TonComponent render", address, chainId,);
  const context: UserContextType | null = useUserContext();
  let tonStaking: ITonStakingClient
  let tonStakingContractInfo : ITonStakingContractsInfo
  const [tonChainId, setTonChainId] = useState<number>(0);
  const [tonAddress, setTonAddress] = useState<string | null>(null);
	const [tonTotalSupply, setTonTotalSupply] = useState<bigint>(BigInt(0));
	const [tonBalance, setTonBalance] = useState<bigint>(BigInt(0));
  const [yourAccount, setYourAccount] = useState<string | null>(null);

  async function changeTonStakingClient() {
    tonStaking = await newTonStakingClient(chainId, address);
    tonStakingContractInfo = await tonStaking.getContractInfos()
    context?.actions.change("tonStakingClient", tonStaking)
    handleClick()
  }

  useEffect(() => {
    // console.log('TonComponent 업데이트 될때만 실행된다.(before)', chainId, tonChainId, context?.state.chainId)
    let boolChanged = false
    if(chainId != null) {
      if(chainId != tonChainId)  {
        setTonChainId(chainId?chainId:0)
        boolChanged = true
      }
      if(address != yourAccount) {
        setYourAccount(address+"");
        boolChanged = true
      }
      if(boolChanged) {
        changeTonStakingClient();
      }
    } else {
      setTonChainId(0)
      setYourAccount("0x");
      boolChanged = true
    }
    if(context?.state.chainId != chainId) context?.actions.change("chainId", chainId)
    if(context?.state.address != address) context?.actions.change("address", address)

    // console.log('TonComponent 업데이트 될때만 실행된다.(after)', chainId, tonChainId, context?.state.chainId)
  }, [chainId, address])

  async function handleClick() {
    try {
      if(tonStaking !== undefined) {
        const supply = await tonStaking.readContract({
          contract: TONContractName.TON,
          functionName: 'totalSupply',
          args: []
        })
        // Update values for address & balance state variable
        setTonAddress(tonStakingContractInfo.TON.address);
        setTonTotalSupply(supply);
        setYourAccount(address+"")
        if(yourAccount !== undefined) {
          const balance = await tonStaking.readContract({
            contract: TONContractName.TON,
            functionName: 'balanceOf',
            args: [yourAccount]
          })
          setTonBalance(balance);
        }
      } else {
        console.log(`tonStakingContracts === undefined`)
      }
    } catch (error) {
      // console.log(`handleClick failed: ${error}`)
    }
  }

  if (isConnected) {
    // init(chainId?chainId:0, address)
    return (
      <div className="flex gap-10">
          <Card className="relative bg-teal-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
            <div className="bg-teal-500 bg-opacity-20 h-[107%] w-[104%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
            <div className="bg-teal-500 bg-opacity-20 h-[107%] w-[104%] rounded-xl -z-20 absolute top-0 left-0"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-5 text-2xl" >
                  <span className="hover:mr-1 duration-300">TON </span>
                  <ArrowRight className="h-5 w-5"/>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">- TON Address {tonChainId}</h3>
                <div className="space-y-2">
                      <span className="hover:mr-1 duration-300">{formatAddress(tonAddress?tonAddress:'')}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">- Total Supply</h3>
                <div className="space-y-2">
                      <span className="hover:mr-1 duration-300"> {tonTotalSupply} </span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">- Your Account</h3>
                <div className="space-y-2">
                      <span className="hover:mr-1 duration-300"> {yourAccount} </span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">- Your TON Balance</h3>
                <div className="space-y-2">
                      <span className="hover:mr-1 duration-300"> {tonBalance} </span>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    )
  }

  if (isDisconnected) {
    return (
      <div className="flex gap-10">
          <Card className="relative bg-teal-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
            <div className="bg-teal-500 bg-opacity-20 h-[107%] w-[104%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
            <div className="bg-teal-500 bg-opacity-20 h-[107%] w-[104%] rounded-xl -z-20 absolute top-0 left-0"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                TON {formatAddress(tonAddress?tonAddress:'')}
                <ArrowRight className="h-5 w-5"  />
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-1">
                <h3 className="text-lg font-semibold">- TON Address</h3>
                <div className="space-y-2">
                      <span className="hover:mr-1 duration-300">{formatAddress(tonAddress?tonAddress:'')}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">- Total Supply</h3>
                <div className="space-y-2">
                      <span className="hover:mr-1 duration-300"> {tonTotalSupply} </span>
                </div>
              </div>
            </CardContent>
          </Card>

      </div>
    )
  }

  if (isConnecting) {
    return (
      <div className="flex gap-10">
          <Card className="relative bg-teal-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start h-[360px]">
            <div className="bg-teal-500 bg-opacity-20 h-[107%] w-[104%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
            <div className="bg-teal-500 bg-opacity-20 h-[107%] w-[104%] rounded-xl -z-20 absolute top-0 left-0"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                TON
                <ArrowRight className="h-5 w-5"  />
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-1">
                <h3 className="text-lg font-semibold">- TON Address</h3>
                <div className="space-y-2">
                      <span className="hover:mr-1 duration-300"> ... On Connecting ...</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">- Total Supply</h3>
                <div className="space-y-2">
                      <span className="hover:mr-1 duration-300"> ... On Connecting ... </span>
                </div>
              </div>
            </CardContent>
          </Card>

      </div>
    )
  }
}
