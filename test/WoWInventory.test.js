const WoWInventory = artifacts.require("./WoWInventory.sol");

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

        it("should return correct gold", async function() {
            let arrayWithCoins = await inventoryInstance.buyCoins({value:5});

            assert.Equal(arrayWithCoins[0],5,"The expected gold is not set");

            // assert.Equal(arrayWithCoins[1],23,"The expected silver is not set");
            // assert.Equal(arrayWithCoins[2],30,"The expected copper is not set");
        });
    });
})