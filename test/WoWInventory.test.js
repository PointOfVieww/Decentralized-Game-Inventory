const WoWInventory = artifacts.require("./WoWInventory.sol");
require('truffle-test-utils').init();

contract('WoWInventory',function(accounts){
    let inventoryInstance;
    let someItemName = "Draenor Quest Bow";
    let owner = accounts[0];
    describe("creating WoW inventory",() => {
        beforeEach(async function() {
            inventoryInstance = await WoWInventory.new({
                from:owner
            });
        });
        //testing if owner is set correctly
        it("should be correct owner", async function() {
            let _owner = await inventoryInstance.owner.call();
            assert.strictEqual(_owner,owner,"expected owner");
        });
        // testing calculations of ether to gold/silver/bronze
        it("should emit correct Event with correct values", async function() {
            let arrayWithCoins = await inventoryInstance.buyCoins({value:11123450000000000000});
            assert.web3Event(arrayWithCoins, {
                event:'BoughtCoins',
                args:{
                    user:owner,
                    value:11123450000000000000,
                    goldReceived:11,
                    silverReceived:12,
                    copperReceived:34
                }
            },'Event is emitted')
        });
        //testing calculations of ether to silver/bronze
        it("should emit correct Event with correct values test without gold", async function() {
            let arrayWithCoins = await inventoryInstance.buyCoins({value:123450000000000000});
            assert.web3Event(arrayWithCoins, {
                event:'BoughtCoins',
                args:{
                    user:owner,
                    value:123450000000000000,
                    goldReceived:00,
                    silverReceived:12,
                    copperReceived:34
                }
            },'Event is emitted')
        }); 
        //testing number count of item after adding one
        it("should correctly increment number count", async function() {
            await inventoryInstance.buyCoins({value:11123450000000000000});
            let numberOfItemsBeforeBuying = await inventoryInstance.getNumberOfItemsForUser(owner);
            await inventoryInstance.buyItem(someItemName,true,1,2,3,"ipfsHash");
            let numberOfItemsAfterBuying = await inventoryInstance.getNumberOfItemsForUser(owner);
            assert.equal(parseInt(numberOfItemsBeforeBuying.c) + 1,parseInt(numberOfItemsAfterBuying.c),"expected number to be incremented correctly");
        });
        //testing if user has item after buying
        it("should correctly add item to user", async function() {
            await inventoryInstance.buyCoins({value:11123450000000000000});
            await inventoryInstance.buyItem(someItemName,true,1,2,3,"ipfsHash");
            let numberOfItemsAfterBuying = await inventoryInstance.getNumberOfItemsForUser(owner);
            let itemIndex = await inventoryInstance.getIndexByItemName(owner,someItemName);
            let nameOfItem = await inventoryInstance.getItemByIndex(parseInt(itemIndex.c));
            assert.strictEqual(nameOfItem,someItemName,"expected item name to be added correctly");
        });

        // //testing  if checkUserHas Item works correctly
        it("should check correctly if user has item",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,2,3,"ipfsHash");
            let itemIndex = await inventoryInstance.getIndexByItemName(owner,someItemName);
            let itemName = await inventoryInstance.getItemByIndex(parseInt(itemIndex));
            assert.strictEqual(itemName,someItemName,'expected item to be found');
        });

        //calculating money after buying item /--basic is without some coins going over 100
        it("should calculate correclty the money for the buy(basic)",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,2,3,"ipfsHash");
            let coinsAfterBuying = await inventoryInstance.getCoinsForAddress(owner);
            assert.equal(parseInt(coinsAfterBuying[0]),4,'expected gold to be correct');
            assert.equal(parseInt(coinsAfterBuying[1]),53,'expected silver to be correct');
            assert.equal(parseInt(coinsAfterBuying[2]),31,'expected copper to be correct');

        });
        // calculating money after buying item 
        it("should calculate correclty the money for the buy(not enough bronze)",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,9,35,"ipfsHash");
            //gold after buying
            let coinsAfterBuying = await inventoryInstance.getCoinsForAddress(owner);

            assert.equal(parseInt(coinsAfterBuying[0]),4,'expected gold to be correct');
            assert.equal(parseInt(coinsAfterBuying[1]),45,'expected silver to be correct');
            assert.equal(parseInt(coinsAfterBuying[2]),99,'expected copper to be correct');
        });

        //calculating money after buying item 
        it("should calculate correclty the money for the buy(not enough silver)",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,2,60,3,"ipfsHash");
            let coinsAfterBuying = await inventoryInstance.getCoinsForAddress(owner);

            assert.equal(parseInt(coinsAfterBuying[0]),2,'expected gold to be correct');
            assert.equal(parseInt(coinsAfterBuying[1]),95,'expected silver to be correct');
            assert.equal(parseInt(coinsAfterBuying[2]),31,'expected copper to be correct');
        });

        // test if name is empty
        it("should test if string is empty",async function() {
            let flag = await inventoryInstance.stringIsEmpty(someItemName);
            assert.equal(flag,false,'expected value should be false');
        });
        // test for selling calculations 
        it("should sell item correctly(basic)", async function() {
            //5 gold 55 silver 34 copper
            await inventoryInstance.buyCoins({value:5553450000000000000});

            let coinsBeforeBuying = await inventoryInstance.getCoinsForAddress(owner);

            await inventoryInstance.buyItem(someItemName,false,1,2,3,"ipfsHash");
            await inventoryInstance.sellItem(someItemName,1,2,3,"ipfsHash");

            let coinsAfterBuying = await inventoryInstance.getCoinsForAddress(owner);

            assert.equal(coinsBeforeBuying[0].toNumber(),coinsAfterBuying[0].toNumber(),'expected gold should be equal');
            assert.equal(coinsBeforeBuying[1].toNumber(),coinsAfterBuying[1].toNumber(),'expected silver should be equal');
            assert.equal(coinsBeforeBuying[2].toNumber(),coinsAfterBuying[2].toNumber(),'expected copper should be equal');
        });

        it("should sell item correctly(selling item with overflow on silver and gold after buying item on diff price)", async function() {
            //5 gold 55 silver 34 copper
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,20,30,"ipfsHash");
            //after buy 4 35 04
            await inventoryInstance.sellItem(someItemName,3,90,96,"ipfsHash");
            //after sell of higher price
            //copper 96+04 = 100 => 0 => +1 silver
            //silver (35+1)+90 = 126 => 26 => +1 gold
            //gold (4+1)+3 => 8

            let coinsAfterBuying = await inventoryInstance.getCoinsForAddress(owner);
            assert.equal(coinsAfterBuying[0].toNumber(),8,'expected gold to be correct');
            assert.equal(coinsAfterBuying[1].toNumber(),26,'expected silver to be correct');
            assert.equal(coinsAfterBuying[2].toNumber(),0,'expected copper to be correct');
        });


        // it('should sell coins correctly',async function() {
        //     await inventoryInstance.buyCoins({value:5553450000000000000});


        // });
        
        //testing private func only when made public
        
        // it("should return correct numbers from value",async function() {
        //     let num = await inventoryInstance.numDigits(12345);
        //     assert.equal(num,5,"The expected number (5) is incorrect");
        //     num = await inventoryInstance.numDigits(123);
        //     assert.equal(num,3,"The expected number (3) is incorrect");
        //     num = await inventoryInstance.numDigits(123456);
        //     assert.equal(num,6,"The expected number (6) is incorrect");
        // });
    });
})
