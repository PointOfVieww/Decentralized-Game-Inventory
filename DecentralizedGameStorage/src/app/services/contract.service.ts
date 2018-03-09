import { Injectable } from "@angular/core";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import { ContractConfig } from '../../../../ContractConfig/contract-config';

@Injectable()
export class ContractService {
    public accounts: any[] = [];
    public account: any;
    public account_balance: number;
    private web3: any;
    private contract;

    constructor() {
     }

    public async getAccount() {
        if (this.account == null) {
          this.account = await new Promise((resolve, reject) => {
            this.web3.eth.getAccounts((err, accs) => {
              if (err != null) {
                alert('There was an error fetching your accounts.');
                return;
              }
              if (accs.length === 0) {
                alert('Couldnt get any accounts! Make sure your Ethereum client is configured correctly.');
                return;
              }
              resolve(accs[0]);
              this.accounts = accs;
            })
          });
        }
        return Promise.resolve(this.account);
    }
    public async setDefaultAcc(){
        if (this.web3.eth.defaultAccount == null) {
            this.web3.eth.defaultAccount = await new Promise((resolve, reject) => {
              this.web3.eth.getAccounts((err, accs) => {
                if (err != null) {
                  alert('There was an error fetching your accounts.');
                  return;
                }
                if (accs.length === 0) {
                  alert('Couldnt get any accounts! Make sure your Ethereum client is configured correctly.');
                  return;
                }
                resolve(accs[0]);
              })
            });
          }
          return Promise.resolve(this.web3.eth.defaultAccount);
    }
    public async getBalance() : Promise<number>{
        if (this.account != null) {
            this.account_balance = await new Promise((resolve,reject) => {
                this.web3.eth.defaultAccount = this.account;
                this.web3.eth.getBalance(this.account, (err, balance) => {
                    if(err != null){
                        alert('There was an error getting your balance.');
                        return;
                    }
                    resolve(this.web3.fromWei(balance,"ether"));
                });
            }) as number;
        }
        return Promise.resolve(this.account_balance);
    }
    public initWeb3() {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof (window as any).web3 !== 'undefined') {
            this.web3 = (window as any).web3;
        } else {
            (window as any).web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }
        var myContract = this.web3.eth.contract(ContractConfig.contract.abi)
        console.log(myContract);
        this.contract = myContract.at(ContractConfig.contract.address);
        // let c = new this.web3.eth.Contract(ContractConfig.contract.abi, '0xFa028Ad8D553803078af63130b059A3de1CE37Bd');
        console.log(contract);
    }

    //TODO: remove console.logs and display properly

    public async buyCoins(ether:number) {
        this.contract.buyCoins({value:this.web3.toWei(ether,'ether')},function(error, result){
            if(!error)
                console.log(result)
            else
                console.error(error);
        });

        //refresh balance and coins for user after buy
        await this.getBalance();
        await this.refreshCoins();
    }

    public async buyItem(itemName:string,legendary:boolean,_goldForItem:number,_silverForItem:number,_copperForItem:number,ipfsHash:string){

        await this.contract.buyItem(itemName,legendary,_goldForItem,_silverForItem,_copperForItem,ipfsHash,function(error,result){
            if(!error)
                console.log(result);
            else
                console.error(error);
        });

        //refresh coins balance for user after buy
        await this.refreshCoins();
    }

    public async sellItem(itemName:string,_goldForItem:number,_silverForItem:number,_copperForItem:number,ipfsHash:string){

        await this.contract.sellItem(itemName,_goldForItem,_silverForItem,_copperForItem,ipfsHash,function(error,result){
            if(!error)
                console.log(result);
            else
                console.log(error);
        })
        await this.refreshCoins();
    }

    public async getIpfsHashForUser(){
        await this.contract.hashIpfsUser({from:this.account},function(error,result){
            if(!error)
                console.log(result)
            else
                console.error(error);
        });
    }

    public async getGoldCoinsForAddress() {
        return await new Promise((resolve,reject) => {
            this.contract.getGoldCoinsForAddress(this.account,function(error,result){
                if(error != null){
                    alert('There was an error getting your gold balance.');
                    return;
                }
                resolve(result);
            });
         }) as number;
    }
    public async getSilverCoinsForAddress() {
        return await new Promise((resolve,reject) => {
            this.contract.getSilverCoinsForAddress(this.account,function(error,result){
                if(error != null){
                    alert('There was an error getting your silver balance.');
                    return;
                }
                resolve(result);
            });
        }) as number;
    }
    public async getCopperCoinsForAddress() {
        return await new Promise((resolve,reject) => {
             this.contract.getCopperCoinsForAddress(this.account,function(error,result){
                if(error != null){
                    alert('There was an error getting your copper balance.');
                    return;
                }
                resolve(result);
             });
        }) as number;
    }

    public async refreshCoins(){
        await this.getGoldCoinsForAddress();
        await this.getSilverCoinsForAddress();
        await this.getCopperCoinsForAddress();
    }
}