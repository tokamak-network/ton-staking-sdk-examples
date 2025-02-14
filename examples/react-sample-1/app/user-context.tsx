"use client";
import React from 'react'
import { Chain } from 'viem';
import { mainnet } from 'viem/chains';
import {
    ITonStakingClient,ITonStakingContractsInfo
} from "@tokamak-network/ton-staking-sdk";

export interface UserContextState {
  id?: number | undefined
  chainId?: number | undefined
  chain?: Chain | undefined
  address?: string | undefined,
  tonStakingClient?: ITonStakingClient | undefined,
  tonStakingContracts?: ITonStakingContractsInfo | undefined
}

// The dummy user object used for this example
export const DummyUser: UserContextState = {
  id: 1,
  chainId: 0,
  chain: undefined,
  address: '0x0000000000000000000000000000000000000000',
  tonStakingClient: undefined
}

export interface UserContextActions {
    change(key: keyof UserContextState, value: number | string | ITonStakingClient ): void;
    changeTonStakingClient(key: keyof UserContextState, value: ITonStakingClient | null ): void;
    reset(): void;
}

export interface UserContextType {
    state: UserContextState;
    actions: UserContextActions;
}

/**
 * Application state interface
 */
export interface AppState {
  user?: UserContextState
  updateState: (newState: Partial<AppState>) => void
}

/**
 * Default application state
 */
// const defaultState: AppState = {
//   user: {},
//   updateState: (newState?: Partial<AppState>) => {},
// }
const defaultState: AppState = {
  user: DummyUser,
  updateState: (newState?: Partial<AppState>) => {},
}

/**
 * Creating the Application state context for the provider
 */
// export const UserContext = React.createContext<AppState>(defaultState)
export const UserContext = React.createContext<UserContextType | null>(null);