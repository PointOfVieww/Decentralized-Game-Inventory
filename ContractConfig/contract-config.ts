export const ContractConfig = {
    contract:
    {
        address:"some addr",
        abi: [
        {
            "constant": true,
            "inputs": [
            {
                "name": "",
                "type": "address"
            }
            ],
            "name": "itemsNumberForUser",
            "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
            ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
                ],
                "name": "coinHolders",
                "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                {
                    "name": "",
                    "type": "address"
                },
                {
                    "name": "",
                    "type": "uint256"
                }
                ],
                "name": "itemsOwned",
                "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                {
                    "indexed": false,
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "goldReceived",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "silverReceived",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "copperReceived",
                    "type": "uint256"
                }
                ],
                "name": "BoughtCoins",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                {
                    "indexed": false,
                    "name": "addrOfUser",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "nameOfItem",
                    "type": "string"
                }
                ],
                "name": "SoldItem",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                {
                    "indexed": false,
                    "name": "addr",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "nameOfItem",
                    "type": "string"
                }
                ],
                "name": "BoughtItem",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                {
                    "indexed": false,
                    "name": "addrOfUser",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "nameOfLegendaryItem",
                    "type": "string"
                }
                ],
                "name": "LegendaryItemBought",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                {
                    "indexed": false,
                    "name": "addrOfUser",
                    "type": "address"
                }
                ],
                "name": "InventoryCreated",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "buyCoins",
                "outputs": [
                {
                    "name": "",
                    "type": "uint256[3]"
                }
                ],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "atleastOnePositiveCoin",
                "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "itemName",
                        "type": "string"
                    },
                    {
                        "name": "legendary",
                        "type": "bool"
                    },
                    {
                        "name": "goldForItem",
                        "type": "uint256"
                    },
                    {
                        "name": "silverForItem",
                        "type": "uint256"
                    },
                    {
                        "name": "copperForItem",
                        "type": "uint256"
                    },
                ],
            }
        ]
    }
}