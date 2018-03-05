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
        it("should be correct owner", async function() {
            let _owner = await inventoryInstance.owner.call();
            assert.strictEqual(_owner,owner,"expected owner");
        });
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

        it("should correctly increment number count", async function() {
            await inventoryInstance.buyCoins({value:11123450000000000000});
            let numberOfItemsBeforeBuying = await inventoryInstance.getNumberOfItemsForUser(owner);
            await inventoryInstance.buyItem(someItemName,true,1,2,3);
            let numberOfItemsAfterBuying = await inventoryInstance.getNumberOfItemsForUser(owner);
            assert.equal(parseInt(numberOfItemsBeforeBuying.c) + 1,parseInt(numberOfItemsAfterBuying.c),"expected number to be incremented correctly");
        });

        it("should correctly add item to user", async function() {
            await inventoryInstance.buyCoins({value:11123450000000000000});
            await inventoryInstance.buyItem(someItemName,true,1,2,3);
            let numberOfItemsAfterBuying = await inventoryInstance.getNumberOfItemsForUser(owner);
            let nameOfItem = await inventoryInstance.getItemByIndexForUser(owner,parseInt(numberOfItemsAfterBuying.c));
            assert.strictEqual(nameOfItem,someItemName,"expected item name to be added correctly");
        });
        it("should check correctly if user has item",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,2,3);
            let flag = await inventoryInstance.checkIfUserHasItem(owner,someItemName);
            assert.equal(flag,true,'expected item to be found');
        });

        it("should calculate correclty the money for the buy",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,2,3);
            let goldAfterBuying = await inventoryInstance.getGoldCoinsForAddress(owner);
            let silverAfterBuying = await inventoryInstance.getSilverCoinsForAddress(owner);
            let copperAfterBuying = await inventoryInstance.getCopperCoinsForAddress(owner);

            assert.equal(parseInt(goldAfterBuying.c),4,'expected gold to be correct');
            assert.equal(parseInt(silverAfterBuying.c),53,'expected silver to be correct');
            assert.equal(parseInt(copperAfterBuying.c),31,'expected copper to be correct');
        });

        it("should calculate correclty the money for the buy",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,9,35);
            let goldAfterBuying = await inventoryInstance.getGoldCoinsForAddress(owner);
            let silverAfterBuying = await inventoryInstance.getSilverCoinsForAddress(owner);
            let copperAfterBuying = await inventoryInstance.getCopperCoinsForAddress(owner);

            assert.equal(parseInt(goldAfterBuying.c),4,'expected gold to be correct');
            assert.equal(parseInt(silverAfterBuying.c),45,'expected silver to be correct');
            assert.equal(parseInt(copperAfterBuying.c),99,'expected copper to be correct');
        });

        it("should calculate correclty the money for the buy",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,2,60,3);
            let goldAfterBuying = await inventoryInstance.getGoldCoinsForAddress(owner);
            let silverAfterBuying = await inventoryInstance.getSilverCoinsForAddress(owner);
            let copperAfterBuying = await inventoryInstance.getCopperCoinsForAddress(owner);

            assert.equal(parseInt(goldAfterBuying.c),2,'expected gold to be correct');
            assert.equal(parseInt(silverAfterBuying.c),95,'expected silver to be correct');
            assert.equal(parseInt(copperAfterBuying.c),31,'expected copper to be correct');
        });

        // it("should sell item correctly", async function() {
        //     //5 gold 55 silver 34 copper
        //     await inventoryInstance.buyCoins({value:5553450000000000000});
        //     await inventoryInstance.buyItem(someItemName,false,1,2,3);
        //     let name

        //     // let numberOfItemsAfterBuying = await inventoryInstance.getNumberOfItemsForUser(owner);
        //     // let nameOfItem = await inventoryInstance.getItemByIndexForUser(owner,parseInt(numberOfItemsAfterBuying.c));
        //     // assert.strictEqual(nameOfItem,someItemName,"expected item name to be added correctly");
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
