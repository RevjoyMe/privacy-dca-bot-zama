export const CONTRACTS = {
  PREDICTION_MARKET: "0xF4B4B18645c810195ef7a9bF768A0242A8325D7c",
  ENCRYPTED_BETTING: "0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918",
  ORACLE_INTEGRATION: "0xc5cb86FfDae958B566E0587B513DC67003fefDa0",
} as const

export const SEPOLIA_CHAIN_ID = 11155111

export const PREDICTION_MARKET_ABI = [
  {
    inputs: [
      { name: "question", type: "string" },
      { name: "endTime", type: "uint256" },
    ],
    name: "createMarket",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcome", type: "bool" },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMarkets",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "question", type: "string" },
          { name: "endTime", type: "uint256" },
          { name: "totalYesBets", type: "uint256" },
          { name: "totalNoBets", type: "uint256" },
          { name: "resolved", type: "bool" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "claimPayout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
