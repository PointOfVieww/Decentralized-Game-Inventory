export const ContractConfig = {
    contract:
    {
        address:"0x8ee99a629eb6ff175955fcc23612a1c00404c2d7",
        abi: [
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
            "constant": false,
            "inputs": [],
            "name": "buyCoins",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
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
            "name": "stringIsEmpty",
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
                "name": "index",
                "type": "uint256"
              }
            ],
            "name": "getItemByIndex",
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
              }
            ],
            "name": "getCoinsForAddress",
            "outputs": [
              {
                "name": "_gold",
                "type": "uint256"
              },
              {
                "name": "_silver",
                "type": "uint256"
              },
              {
                "name": "_copper",
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
            "name": "getHashIpfsForUser",
            "outputs": [
              {
                "name": "ipfsHash",
                "type": "string"
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