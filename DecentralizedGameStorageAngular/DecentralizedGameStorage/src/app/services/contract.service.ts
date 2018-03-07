import { Injectable } from "@angular/core";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import { ContractConfig } from '../../../../../ContractConfig/contract-config';

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
        this.contract = this.web3.eth.contract(ContractConfig.contract.abi).at("0x49bd2a34ef6559e095881d2f20a28afc759f7e006d432249e25ac7f3a9365b6f");
    }

    public async buyCoins() {
        try {
            await this.contract.buyCoins({from:"A5Ec3Fcb8BF5Df0AA026e91D51bD6e48F33c0A65"});
            
        } catch (error) {
           console.error(error); 
        }
    }
}