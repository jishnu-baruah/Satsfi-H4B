const vaults = [
  {
    name: "stCORE",
    apy: 6.1,
    tvl: "$2.4M",
    description: "Core staking vault with liquid staking rewards",
    risk: "low",
  },
  {
    name: "B14G",
    apy: 8.3,
    tvl: "$1.8M",
    description: "Bitcoin yield farming with automated strategies",
    risk: "medium",
  },
  {
    name: "Pell",
    apy: 5.7,
    tvl: "$3.2M",
    description: "Restaking protocol with enhanced security",
    risk: "low",
  },
  {
    name: "Babylon",
    apy: 7.2,
    tvl: "$1.1M",
    description: "Bitcoin staking with native yield",
    risk: "medium",
  },
];

const getVaults = (req, res) => {
  res.status(200).json({ success: true, data: vaults });
};

module.exports = { getVaults }; 