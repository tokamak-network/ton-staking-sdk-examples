"use client";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount  } from "wagmi";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { TonComponent } from "@/components/TonComponent";
import { CandidatesComponent } from "@/components/CandidatesComponent";
import { newTonStakingClient } from "./client";
import { Address } from 'viem';
import { useUserContext} from "./user-context-provider";
import { UserContextType} from "./user-context";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const {address, chainId, status, isConnecting, isDisconnected, isConnected } = useAccount();
  const context: UserContextType | null = useUserContext();

  const init = async() => {
    console.log('Home context chainId_', chainId)
    console.log('Home context account_', address)

    if(context?.state.chainId != chainId || context?.state.address != address) {
      const connect = await newTonStakingClient(chainId, address);
      // console.log('Home context connect', connect)

      context?.actions.changeTonStakingClient(
        "tonStakingClient", connect
      )
      context?.actions.change( "chainId", chainId )
      context?.actions.change( "address", address )
    }
  }

  // if (isConnected) {
  //   init()
  // }

  // useEffect(() => {
  //   console.log('업데이트 될때만 실행된다.', chainId)
  //   init()
  // }, [chainId, address])

  return (
    <main className="">
      <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
        <Hero />
        <Separator className="w-full my-14 opacity-15" />
        <section className="flex flex-row items-center md:flex-row gap-10 w-full justify-center max-w-5xl">
          <TonComponent />
        </section>
        <section className="flex flex-col items-center md:flex-row gap-10 w-full justify-center max-w-5xl">
          <div className="flex gap-10">
          <CandidatesComponent/>
          </div>

        </section>
      </div>
    </main>
  );
}
