pragma solidity ^0.4.18;

//1 gold = 1 eth
//100 silver = 1 gold = 1 eth
//10 silver = 0.1 eth
//1 silver = 0.01 eth = 100 copper
//10 copper = 0.001 eth
//1 copper = 0.0001 eth
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
    event InventoryCreated(address addrOfUser);
    address public owner;
    mapping (address=>uint256) gold;
    mapping (address=>uint256) silver;
    mapping (address=>uint256) copper;
    mapping (address=>bool) public coinHolders;
    mapping (address=>mapping (uint256=>string)) public itemsOwned;
    mapping (address=>uint) public itemsNumberForUser;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
    modifier isCoinHolder() {
        require(coinHolders[msg.sender] == true);
        _;
    }

    function WoWInventory() public {
        owner = msg.sender;
        InventoryCreated(owner);
    }

    function numDigits(uint number) private pure returns(uint numberOfDigits) {
        while (number > 0) {
            number /= 10;
            numberOfDigits++;
        }
        return numberOfDigits;
    }

    //calculate which coins to get when sent more than 1 eth
    function calculateGoldToReceive(uint value) private pure returns(uint) {
        return value / 10000;
    }
    function calculateSilverToReceive(uint value) private pure returns(uint) {
        return (value / 100) % 100;
    }
    function calculateCopperToReceive(uint value) private pure returns(uint) {
        return value % 100;
    }
    //remove returns uint[3] after
    function buyCoins() public payable returns(uint[3]) {
        //only more than 0.0001 eth
        require(msg.value > (1 ether / 10000));
        //max 99.9999 ether
        require(msg.value < 100 ether);
        //if numOfDigits > 6 ether is > 100
        //if numOfDigits < 1 ethere is < 0.0001
        uint value = msg.value / 10**14;
        uint numOfDigits = numDigits(value);
        assert(numOfDigits <= 6);
        assert(numOfDigits >= 1);
        uint[3] memory res;
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
        checkIfCoinsGoOverLimit(msg.sender,silverToReceive,copperToReceive);

        res[0] = goldToReceive;
        res[1] = silverToReceive;
        res[2] = copperToReceive;

        gold[msg.sender] += goldToReceive;
        
        coinHolders[msg.sender] = true;

        BoughtCoins(msg.sender,msg.value,goldToReceive,silverToReceive,copperToReceive);
        return res;
    }

    function checkIfCoinsGoOverLimit(address addr,uint _silver,uint _copper) internal {
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

    //maybe selling their coins in the future.
    // function sellCoins() public {
        

    // }

    function buyItem(string itemName,bool legendary, uint goldForItem,uint silverForItem,uint copperForItem) public isCoinHolder {
        require(gold[msg.sender] > goldForItem);
        require(itemsNumberForUser[msg.sender] < 100);
        require(!checkIfStringIsEmpty(itemName));
        if (silver[msg.sender] < silverForItem && gold[msg.sender] < 1) {
            revert();
        }
        if (copper[msg.sender] < copperForItem && silver[msg.sender] < 1 && gold[msg.sender] < 1) {
            revert();
        }
        
        



        if (legendary) {
            LegendaryItemBought(msg.sender,itemName);
        }
        itemsNumberForUser[msg.sender] += 1;
        itemsOwned[msg.sender][itemsNumberForUser[msg.sender]] = itemName;
        BoughtItem(msg.sender,itemName);
    }

    function checkIfStringIsEmpty(string name) private pure returns(bool) {
        bytes memory temp = bytes(name);
        if (temp.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    function sellItem(string itemName,uint goldForItem,uint silverForItem,uint copperForItem) public {
        require(checkIfStringIsEmpty(itemName));
        if (!checkIfUserHasItem(msg.sender,itemName)) {
            revert();
        }

        if (copper[msg.sender] + copperForItem < 100) {
            copper[msg.sender] += copperForItem;
        } else {
            copper[msg.sender] = copper[msg.sender] + copperForItem - 100;
            silverForItem++;
        }

        if (silver[msg.sender] + silverForItem < 100) {
            silver[msg.sender] += silverForItem;
        } else {
            silver[msg.sender] = silver[msg.sender] + silverForItem - 100;
            goldForItem++;
        }

        gold[msg.sender] += goldForItem;
        SoldItem(msg.sender,itemName);
    }

    function checkIfUserHasItem(address addr,string itemName) public view returns(bool) {
        uint numberOfItems = getNumberOfItemsForUser(addr);
        for (uint i = 0; i <= numberOfItems;i++) {
            if (keccak256(getItemByIndexForUser(addr,i)) == keccak256(itemName)) {
                return true;
            }
        }
        return false;
    }

    function getNumberOfItemsForUser(address addr) public view returns(uint) {
        return itemsNumberForUser[addr];
    }

    function getItemByIndexForUser(address addr,uint index) public view returns(string) {
        return itemsOwned[addr][index];
    }

    function getGoldCoinsForAddress(address addr) public view returns(uint256) {
        return gold[addr]; 
    }

    function getSilverCoinsForAddress(address addr) public view returns(uint256) {
        return silver[addr]; 
    }

    function getCopperCoinsForAddress(address addr) public view returns(uint256) {
        return copper[addr]; 
    }

    function withdraw() public isOwner {
        
    }
}