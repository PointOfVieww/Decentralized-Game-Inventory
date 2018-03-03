pragma solidity ^0.4.18;

//1 gold = 1 eth
//100 silver = 1 gold = 1 eth
//10 silver = 0.1 eth
//1 silver = 0.01 eth = 100 copper
//10 copper = 0.001 eth
//1 copper = 0.0001 eth
contract WoWInventory {
    event BoughtCoins(address,uint256);
    event SoldItem(address,string);
    event BoughtItem(address,string);

    uint private oneGoldCoin = 1 ether;
    uint private oneSilverCoin = oneGoldCoin / 100;
    uint private oneCopperCoin = oneSilverCoin / 100;
    

    address public owner;
    mapping (address=>uint256) gold;
    mapping (address=>uint256) silver;
    mapping (address=>uint256) copper;
    mapping (address=>bool) coinHolders;
    mapping (address=>bytes32) name;

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
    }
    function numDigits(uint number) public pure returns(uint numberOfDigits) {
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
        BoughtCoins(msg.sender,msg.value);
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

    function buyItem(string itemName) public isCoinHolder {
        

        BoughtItem(msg.sender,itemName);
    }

    function sellItem(string itemName) public {
        

        SoldItem(msg.sender,itemName);
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