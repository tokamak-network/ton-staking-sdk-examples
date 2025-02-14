"use client";
import React, { useState, useContext , useMemo} from 'react'
import {
    UserContext,
    DummyUser,
    UserContextState, UserContextActions, UserContextType
} from './user-context'

interface Props {
  children: React.ReactNode
}

/**
 * The main context provider
 */
export const UserContextProvider: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  /**
   * Using react hooks, set the default state
   */
  const [state, setState] = useState<UserContextState>(DummyUser)

  /**
   * Declare the update state method that will handle the state values
   */
//   const updateState = (newState: Partial<AppState>) => {
//     setState({ ...state, ...newState })
//   }

  const actions: UserContextActions = useMemo(
    () => ({
      change(key, value) {
        setState((prev) => ({ ...prev, [key]: value }));
      },
      changeTonStakingClient(key, value) {
        console.log('changeTonStakingClient', key)
        setState((prev) => ({ ...prev, [key]: value }));
      },
      reset() {
        setState(DummyUser);
      },
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  /**
   * Context wrapper that will provider the state values to all its children nodes
   */
//   return (
//     <UserContext.Provider value={{ ...state, updateState }}>{props.children}</UserContext.Provider>
//   )
  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  )
}

export function useUserContext(): UserContextType | null{
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error("useUserContext must be used within UserProvider");
    }
    return context;
}