const WoWInventory = artifacts.require("./WoWInventory.sol");
require('truffle-test-utils').init();

contract('WoWInventory',function(accounts){
    let inventoryInstance;
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
