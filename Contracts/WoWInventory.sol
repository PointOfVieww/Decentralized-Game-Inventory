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

    address private owner;
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

    function buyCoins() public payable {
        //only more than 0.0001 eth
        require(msg.value > (1 ether / 10000));
        if (msg.value > 1 ether) {
            //buy gold
        }
        //if > 0.01 ether && < 1 ether
        if (msg.value > (1 ether / 100) && msg.value < 1 ether) {
            //buy silver
        }
        if (msg.value > (1 ether / 10000) && msg.value < (1 ether / 100)) {
            //buy copper
        }
        coinHolders[msg.sender] = true;
        BoughtCoins(msg.sender,msg.value);    
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