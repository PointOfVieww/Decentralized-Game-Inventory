export const ContractConfig = {
    contract:
    {
        address:"0xc28C58dC3Dc67F7b6415beB63097e51baAa61AC9",
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
              "name": "hashIpfsUser",
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
                {
                  "name": "ipfsHash",
                  "type": "string"
                }
              ],
              "name": "buyItem",
              "outputs": [],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "name",
                  "type": "string"
                }
              ],
              "name": "checkIfStringIsEmpty",
              "outputs": [
                {
                  "name": "",
                  "type": "bool"
                }
              ],
              "payable": false,
              "stateMutability": "pure",
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
                {
                  "name": "ipfsHash",
                  "type": "string"
                }
              ],
              "name": "sellItem",
              "outputs": [],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "addr",
                  "type": "address"
                },
                {
                  "name": "itemName",
                  "type": "string"
                }
              ],
              "name": "checkIfUserHasItem",
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
              "inputs": [
                {
                  "name": "addr",
                  "type": "address"
                },
                {
                  "name": "itemName",
                  "type": "string"
                }
              ],
              "name": "getIndexByItemName",
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
                  "name": "addr",
                  "type": "address"
                }
              ],
              "name": "getAddressBalance",
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
              "inputs": [],
              "name": "getContractBalance",
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
                  "name": "addr",
                  "type": "address"
                }
              ],
              "name": "getNumberOfItemsForUser",
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
                  "name": "addr",
                  "type": "address"
                },
                {
                  "name": "index",
                  "type": "uint256"
                }
              ],
              "name": "getItemByIndexForUser",
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
              "constant": true,
              "inputs": [
                {
                  "name": "addr",
                  "type": "address"
                }
              ],
              "name": "getGoldCoinsForAddress",
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
                  "name": "addr",
                  "type": "address"
                }
              ],
              "name": "getSilverCoinsForAddress",
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
                  "name": "addr",
                  "type": "address"
                }
              ],
              "name": "getCopperCoinsForAddress",
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
              "constant": false,
              "inputs": [],
              "name": "withdraw",
              "outputs": [],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
            }
        ]
    }
}