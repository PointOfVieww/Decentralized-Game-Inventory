import { Injectable } from "@angular/core";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

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
    }
}