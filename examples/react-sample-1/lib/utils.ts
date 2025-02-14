import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Abi } from "viem";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (addr: string | undefined) => {
  if (!addr || addr.length < 10) {
    return ''
    // throw new Error("Invalid wallet address");
  }
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};


export const getAbis = (originals: Array<any>, values: Array<string> ) : Abi  | Array<any> => {
  console.log('getAbis 1')
  if (!originals) {
    throw new Error("Invalid originals");
  }
  const jsonArray: Array<any> = []

  for(let i=0 ; i< originals.length; i++) {
    for(let j = 0; j < values.length ; j++) {
      if(originals[i].name == values[j]) {
        jsonArray.push({
          inputs: originals[i].inputs,
          name: originals[i].name,
          outputs:  originals[i].outputs,
          stateMutability:  originals[i].stateMutability,
          type:  originals[i].type,
        })
      }
    }
  }
  return jsonArray;
};

