import { Component, OnInit } from '@angular/core';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import { Image } from './models/image-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  images:Image[]

  public accounts: any[] = [];
  public account: any;
  public account_balance: number;
  private web3: any;

  private _tokenContract: any;
  private _tokenContractAddress: string = "0xbc84f3bf7dd607a37f9e5848a6333e6c188d926c";
  
  async ngOnInit() {
    this.images =[
      { legendary:true, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Artifact WindRunner Bow" ,url:"../assets/images/inv_bow_1h_artifactwindrunner_d_02.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Draenor Dungeon Bow" ,url:"../assets/images/inv_bow_1h_draenordungeon_c_01.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Draenor Honor Bow" ,url:"../assets/images/inv_bow_1h_draenorhonor_c_01.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Draenor Quest Bow" ,url:"../assets/images/inv_bow_1h_draenorquest_b_01.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Draenor Raid Bow" ,url:"../assets/images/inv_bow_1h_draenorraid_d_01.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Ogrimar Raid Bow" ,url:"../assets/images/inv_bow_1h_orgrimmarraid_d_02.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"PVP Draenors Bow" ,url:"../assets/images/inv_bow_1h_pvpdraenors2_d_01.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"PVP Horde Bow" ,url:"../assets/images/inv_bow_1h_pvphorde_a_01_upres.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Raid Hunter Helm" ,url:"../assets/images/inv_helm_mail_raidhunter_q_01.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Head Dragon Misc" ,url:"../assets/images/inv_misc_head_dragon_01.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Bernard Dog Pet" ,url:"../assets/images/inv_stbernarddogpet.jpg",selected:false},
      { legendary:false, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Best Bow" ,url:"../assets/images/inv_weapon_bow_16.jpg",selected:false},
      { legendary:true, costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Legendary bow" ,url:"../assets/images/inv_weapon_bow_58.jpg",selected:false}
 ]

    this.initWeb3();
    await this.getAccount();


  }

  buyItem(){
    
    var test = this.images.filter(x=>x.selected==true);
    console.log(test);
  }

  public async buyGold(){
    
    // console.log(this.web3.fromWei(this.web3.eth.getBalance(this.account))); 
    
  }
  
  
  private async getAccount(): Promise<string> {
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        this.web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }
          if (accs.length === 0) {
            alert(
              'Couldnt get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
          this.accounts = accs;
        })
      }) as string;
      this.web3.eth.defaultAccount = this.account;
      this.web3.eth.getBalance(this.account, (err, balance) => {
        this.account_balance = this.web3.fromWei(balance, "ether");
      });
    }
    return Promise.resolve(this.account);
  }


  public initWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof (window as any).web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      // console.log((window as any).web3);
      this.web3 = (window as any).web3;
      // (window as any).web3 = new Web3((window as any).web3.currentProvider);
    } else {
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      (window as any).web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
  }
}


