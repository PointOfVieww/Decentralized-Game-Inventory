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
        //testing calculations of ether to gold/silver/bronze
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
            await inventoryInstance.buyItem(someItemName,true,1,2,3);
            let numberOfItemsAfterBuying = await inventoryInstance.getNumberOfItemsForUser(owner);
            assert.equal(parseInt(numberOfItemsBeforeBuying.c) + 1,parseInt(numberOfItemsAfterBuying.c),"expected number to be incremented correctly");
        });
        //testing if user has item after buying
        it("should correctly add item to user", async function() {
            await inventoryInstance.buyCoins({value:11123450000000000000});
            await inventoryInstance.buyItem(someItemName,true,1,2,3);
            let numberOfItemsAfterBuying = await inventoryInstance.getNumberOfItemsForUser(owner);
            let nameOfItem = await inventoryInstance.getItemByIndexForUser(owner,parseInt(numberOfItemsAfterBuying.c));
            assert.strictEqual(nameOfItem,someItemName,"expected item name to be added correctly");
        });

        //need to know how much gas is buyCoins taking so it can be easily checked
        // it("should check balance of address correctly after buying coins",async function() {
        //     let balance = await inventoryInstance.getAddressBalance(owner);
        //     await inventoryInstance.buyCoins({value:3000000000000000000});
        //     let balanceAfter = await inventoryInstance.getAddressBalance(owner);
        //     assert.equal(parseInt(balance.c[0]),parseInt(balanceAfter.c[0]+30000),'should expect balance to be exctracted correctly');
        // });
        
        //testing  if checkUserHastItem works correctly
        it("should check correctly if user has item",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,2,3);
            let flag = await inventoryInstance.checkIfUserHasItem(owner,someItemName);
            assert.equal(flag,true,'expected item to be found');
        });

        //calculating money after buying item /basic is without some coins going over 100
        it("should calculate correclty the money for the buy(basic)",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,2,3);
            let goldAfterBuying = await inventoryInstance.getGoldCoinsForAddress(owner);
            let silverAfterBuying = await inventoryInstance.getSilverCoinsForAddress(owner);
            let copperAfterBuying = await inventoryInstance.getCopperCoinsForAddress(owner);

            assert.equal(parseInt(goldAfterBuying.c),4,'expected gold to be correct');
            assert.equal(parseInt(silverAfterBuying.c),53,'expected silver to be correct');
            assert.equal(parseInt(copperAfterBuying.c),31,'expected copper to be correct');
        });
        //calculating money after buying item 
        it("should calculate correclty the money for the buy(not enough bronze)",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,9,35);
            let goldAfterBuying = await inventoryInstance.getGoldCoinsForAddress(owner);
            let silverAfterBuying = await inventoryInstance.getSilverCoinsForAddress(owner);
            let copperAfterBuying = await inventoryInstance.getCopperCoinsForAddress(owner);

            assert.equal(parseInt(goldAfterBuying.c),4,'expected gold to be correct');
            assert.equal(parseInt(silverAfterBuying.c),45,'expected silver to be correct');
            assert.equal(parseInt(copperAfterBuying.c),99,'expected copper to be correct');
        });
        //calculating money after buying item 

        it("should calculate correclty the money for the buy(not enough silver)",async function() {
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,2,60,3);
            let goldAfterBuying = await inventoryInstance.getGoldCoinsForAddress(owner);
            let silverAfterBuying = await inventoryInstance.getSilverCoinsForAddress(owner);
            let copperAfterBuying = await inventoryInstance.getCopperCoinsForAddress(owner);

            assert.equal(parseInt(goldAfterBuying.c),2,'expected gold to be correct');
            assert.equal(parseInt(silverAfterBuying.c),95,'expected silver to be correct');
            assert.equal(parseInt(copperAfterBuying.c),31,'expected copper to be correct');
        });

        //test if name is empty
        it("should test if string is empty",async function() {
            let flag = await inventoryInstance.checkIfStringIsEmpty(someItemName);
            assert.equal(flag,false,'expected value should be false');
        });
        //test for selling calculations 
        it("should sell item correctly(basic)", async function() {
            //5 gold 55 silver 34 copper
            await inventoryInstance.buyCoins({value:5553450000000000000});
            
            let goldBeforeBuying = await inventoryInstance.getGoldCoinsForAddress(owner);
            let silverBeforeBuying = await inventoryInstance.getSilverCoinsForAddress(owner);
            let copperBeforeBuying = await inventoryInstance.getCopperCoinsForAddress(owner); 
            await inventoryInstance.buyItem(someItemName,false,1,2,3);
            await inventoryInstance.sellItem(someItemName,1,2,3);

            let goldAfterSelling = await inventoryInstance.getGoldCoinsForAddress(owner);
            let silverAfterSelling = await inventoryInstance.getSilverCoinsForAddress(owner);
            let copperAfterSelling = await inventoryInstance.getCopperCoinsForAddress(owner); 

            assert.equal(parseInt(goldBeforeBuying.c),parseInt((goldAfterSelling.c)),'expected gold should be equal');
            assert.equal(parseInt(silverBeforeBuying.c),parseInt((silverAfterSelling.c)),'expected silver should be equal');
            assert.equal(parseInt(copperBeforeBuying.c),parseInt((copperAfterSelling.c)),'expected copper should be equal');
        });

        it("should sell item correctly(selling item with overflow on silver and gold after buying item on diff price)", async function() {
            //5 gold 55 silver 34 copper
            await inventoryInstance.buyCoins({value:5553450000000000000});
            await inventoryInstance.buyItem(someItemName,false,1,20,30);
            //after buy 4 35 04
            await inventoryInstance.sellItem(someItemName,3,90,96);
            //after sell of higher price
            //copper 96+04 = 100 => 0 => +1 silver
            //silver (35+1)+90 = 126 => 26 => +1 gold
            //gold (4+1)+3 => 8

            let goldAfterSelling = await inventoryInstance.getGoldCoinsForAddress(owner);
            let silverAfterSelling = await inventoryInstance.getSilverCoinsForAddress(owner);
            let copperAfterSelling = await inventoryInstance.getCopperCoinsForAddress(owner); 

            assert.equal(parseInt((goldAfterSelling.c)),8,'expected gold should be equal');
            assert.equal(parseInt((silverAfterSelling.c)),26,'expected silver should be equal');
            assert.equal(parseInt((copperAfterSelling.c)),0,'expected copper should be equal');
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
