pragma solidity ^0.4.18;

//1 gold = 1 eth
//100 silver = 1 gold = 1 eth
//10 silver = 0.1 eth
//1 silver = 0.01 eth = 100 copper
//10 copper = 0.001 eth
//1 copper = 0.0001 eth
contract WoWInventory {
    event BoughtGold(address,uint256);
    event SoldItem(address,string);
    event BoughtItem(address,string);

    address private owner;
    mapping (address=>uint256) gold;
    mapping (address=>uint256) silver;
    mapping (address=>uint256) copper;
    address[] public coinHolders;
    mapping (address=>bytes32) name;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    function WoWInventory() public {
        owner = msg.sender;
    }

    function buyGold() public payable {

        //more than 0.0001 eth
        //require(msg.value > 0.1 finney);

        BoughtGold(msg.sender,msg.value);    
    }

    function buyItem(string itemName) public {
        

        BoughtItem(msg.sender,itemName);
    }

    function sellItem(string itemName) public {
        

        SoldItem(msg.sender,itemName);
    }

    function withdraw() public isOwner {
        
    }
}