pragma solidity ^0.4.18;

/**
    @notice This contract implements a simple decentralized game inventory.
    Every user has its own inventory.
    @title Decentralized Game Storage
    @author Pavel Dochev
*/

/**
    1 gold = 1 eth
    100 silver = 1 gold = 1 eth
    10 silver = 0.1 eth
    1 silver = 0.01 eth = 100 copper
    10 copper = 0.001 eth
    1 copper = 0.0001 eth
 */

contract WoWInventory {
    event BoughtCoins(
        address user,
        uint256 value,
        uint256 goldReceived,
        uint256 silverReceived,
        uint256 copperReceived
    );
    event SoldItem(address addrOfUser,string nameOfItem);
    event BoughtItem(address addr,string nameOfItem);
    event LegendaryItemBought(address addrOfUser,string nameOfLegendaryItem);

    address public owner;
    mapping (address=>uint256) gold;
    mapping (address=>uint256) silver;
    mapping (address=>uint256) copper;
    mapping (address=>mapping (uint256=>string)) private itemsOwned;
    mapping (address=>uint) private itemsNumberForUser;

    //should i let others read the hashes of users ?
    mapping (address=>string) private hashIpfsUser;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier isCoinHolder() {
        require(atleastOnePositiveCoin());
        _;
    }

    function WoWInventory() public {
        owner = msg.sender;
    }

    function numDigits(uint number) internal pure returns(uint numberOfDigits) {
        while (number > 0) {
            number /= 10;
            numberOfDigits++;
        }
        return numberOfDigits;
    }

    //calculate which coins to get when sent more than 1 eth
    function calculateGoldToReceive(uint value) internal pure returns(uint) {
        return value / 10000;
    }
    function calculateSilverToReceive(uint value) internal pure returns(uint) {
        return (value / 100) % 100;
    }
    function calculateCopperToReceive(uint value) internal pure returns(uint) {
        return value % 100;
    }
    
    function buyCoins() public payable {
        //min 0.0001 eth
        require(msg.value > (1 ether / 10000));
        //max 99.9999 ether
        require(msg.value < 100 ether);
        //if numOfDigits > 6 ether is > 100
        //if numOfDigits < 1 ethere is < 0.0001
        uint value = msg.value / 10**14;
        uint numOfDigits = numDigits(value);
        assert(numOfDigits <= 6);
        assert(numOfDigits >= 1);
        uint goldToReceive = 0;
        uint silverToReceive = 0;
        uint copperToReceive = 0;

        //there will be gold
        if (numOfDigits == 6 || numOfDigits == 5) {
            goldToReceive = calculateGoldToReceive(value);
            silverToReceive = calculateSilverToReceive(value);
            copperToReceive = calculateCopperToReceive(value);

        } else if (numOfDigits == 4 || numOfDigits == 3) {
            //there may be silver and copper
            silverToReceive = value / 100;
            copperToReceive = calculateCopperToReceive(value);
        } else if (numOfDigits == 2 || numOfDigits == 1) {
            //Only copper
            copperToReceive = value;
        }
        calculateCoins(msg.sender,silverToReceive,copperToReceive);

        gold[msg.sender] += goldToReceive;

        BoughtCoins(msg.sender,msg.value,goldToReceive,silverToReceive,copperToReceive);
    }

    // function sellCoins(uint _gold,uint _silver,uint _copper) public isCoinHolder {
        
    // }

    //calculate and set coins even if they overflow(100)
    function calculateCoins(
        address addr,
        uint _silver,
        uint _copper
    ) 
        internal 
    {
        uint256 currSilver = silver[addr];
        uint currCopper = copper[addr];
        uint temp = 0;
        if (currSilver + _silver > 100) {
            temp = (currSilver + _silver) - 100;
            gold[addr] += 1;
            silver[addr] = temp;
        } else {
            silver[addr] += _silver;
        }

        if (currCopper + _copper > 100) {
            temp = (currCopper + _copper) - 100;
            silver[addr] += 1;
            copper[addr] = temp;
        } else {
            copper[addr] += _copper;
        }
    }

    function atleastOnePositiveCoin() private view returns(bool) {
        return (gold[msg.sender] > 0 || silver[msg.sender] > 0 || copper[msg.sender] > 0);
    }

    function buyItem(
        string itemName,
        bool legendary,
        uint goldForItem,
        uint silverForItem,
        uint copperForItem,
        string ipfsHash
    )
        public
        isCoinHolder 
    {

        require(silverForItem < 100);
        require(copperForItem < 100);
        require(gold[msg.sender] > goldForItem);
        require(itemsNumberForUser[msg.sender] < 100);
        require(!stringIsEmpty(itemName));

        if (silver[msg.sender] < silverForItem && gold[msg.sender] < 1) {
            revert();
        }
        if (copper[msg.sender] < copperForItem && silver[msg.sender] < 1 && gold[msg.sender] < 1) {
            revert();
        }

        if (copper[msg.sender] < copperForItem) {
            if (silver[msg.sender] < 0) {
                revert();
            }
            silver[msg.sender]--;
            copper[msg.sender] = copper[msg.sender] + 100 - copperForItem;
        } else {
            copper[msg.sender] -= copperForItem;
        }

        if (silver[msg.sender] < silverForItem) {
            if (gold[msg.sender] < 1) {
                revert();
            }
            gold[msg.sender]--;
            silver[msg.sender] = silver[msg.sender] + 100 - silverForItem;
            
        } else {
            silver[msg.sender] -= silverForItem;
        }

        gold[msg.sender] -= goldForItem;

        if (legendary) {
            LegendaryItemBought(msg.sender,itemName);
        }
        hashIpfsUser[msg.sender] = ipfsHash;
        itemsNumberForUser[msg.sender] += 1;
        itemsOwned[msg.sender][itemsNumberForUser[msg.sender]] = itemName;
        BoughtItem(msg.sender,itemName);
    }

    function stringIsEmpty(string name) public pure returns(bool) {
        return keccak256(name) == keccak256("");
    }

    function sellItem(
        string itemName,
        uint goldForItem,
        uint silverForItem,
        uint copperForItem,
        string ipfsHash
    )
        public 
    {
        require(silverForItem < 100);
        require(copperForItem < 100);

        uint index = getIndexByItemName(msg.sender,itemName);
        if (stringIsEmpty(itemsOwned[msg.sender][index])) {
            revert();
        }
        //check if copper overflows
        if (copper[msg.sender] + copperForItem < 100) {
            copper[msg.sender] += copperForItem;
        } else {
            copper[msg.sender] = copper[msg.sender] + copperForItem - 100;
            silverForItem++;
        }
        //check if copper overflows
        if (silver[msg.sender] + silverForItem < 100) {
            silver[msg.sender] += silverForItem;
        } else {
            silver[msg.sender] = silver[msg.sender] + silverForItem - 100;
            goldForItem++;
        }

        //set latest item to index that will be deleted and delete latest
        itemsOwned[msg.sender][index] = itemsOwned[msg.sender][itemsNumberForUser[msg.sender]];
        delete itemsOwned[msg.sender][itemsNumberForUser[msg.sender]];

        //counter for number 
        itemsNumberForUser[msg.sender] -= 1;

        gold[msg.sender] += goldForItem;
        hashIpfsUser[msg.sender] = ipfsHash;
        SoldItem(msg.sender,itemName);
    }

    //max number of items for user are 100 so max is 100 iterations 
    function getIndexByItemName(address addr,string itemName) public view returns(uint) {
        uint numberOfItems = itemsNumberForUser[addr];
        for (uint i = 0; i <= numberOfItems;i++) {
            if (keccak256(itemsOwned[addr][i]) == keccak256(itemName)) {
                return i;
            }
        }
    }

    function getAddressBalance(address addr) public view returns(uint) {
        return addr.balance;
    }

    function getContractBalance() public view returns(uint) {
        return this.balance;
    }

    function getItemByIndex(uint index) public view returns(string) {
        return itemsOwned[msg.sender][index];
    }

    function getNumberOfItemsForUser(address addr) public view returns(uint) {
        return itemsNumberForUser[addr];
    }

    //get coins balance 
    function getCoinsForAddress(address addr) public view returns(uint256 _gold,uint256 _silver,uint256 _copper) {
        return (gold[addr],silver[addr],copper[addr]); 
    }

    function getHashIpfsForUser(address addr) public view returns(string ipfsHash) {
        return hashIpfsUser[addr];
    }

    function withdraw() public isOwner {
        owner.transfer(this.balance);
    }
    // function() payable {
        
    // }
}