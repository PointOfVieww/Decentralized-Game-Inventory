import { Component, OnInit } from '@angular/core';
import { IpfsService } from '../../services/ipfs.service';
import { ContractService } from '../../services/contract.service';
import { Image } from '../../models/image-model';
import { Item } from '../../models/items-model';
import IpfsUtils from '../../utils/ipfs-utils';

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import { NotifierService } from 'angular-notifier';
import { LegendaryEventModel } from '../../models/legendaryEvent-model';
import { ItemsOwned } from '../../models/items-owned';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images:Image[]
  itemsOfPerson:Array<ItemsOwned> = [];
  ipfsKeyFromContract:string;
  temporaryItems:Item[] = [];
  accountBalance: number;
  accountGold:number;
  accountSilver:number;
  accountCopper:number;
  inputEther:number;
  legEvent:LegendaryEventModel;

  constructor(private ipfsService:IpfsService,
              private contractService:ContractService,
              private notifierService: NotifierService) { }

  async ngOnInit() {
    
    await this.runComponent();

  }

  async buyItem(){
    
    var getImage = this.images.find(x=>x.selected==true);
    if(getImage == undefined || getImage.nameOfItem == ""){
      this.notifierService.notify("warning","Please select an item.");
      return;
    }
    var tempFile;
    var ipfsIDForItem;
    var itemForUser;

    if(this.ipfsKeyFromContract == undefined){

    }

    if(this.itemsOfPerson.find(x=>x.nameOfItem == getImage.nameOfItem)){
      itemForUser = this.itemsOfPerson.find(x=>x.nameOfItem == getImage.nameOfItem);
    }
    else {
      //get file from current images in assets
      await IpfsUtils.getFileFromLocalUrl(getImage.url,getImage.nameOfItem)
      .then(result => tempFile = result)
      .catch(err => console.error(err));

      //upload it to ipfs
      await IpfsUtils.addUserItem(tempFile).then(ipfsId => {
        ipfsIDForItem = ipfsId;
        console.log("ipfs id for item " +IpfsUtils.IPFS_SERVER + ipfsIDForItem);
      });

      //make an item
      itemForUser = { 
        url:IpfsUtils.IPFS_SERVER + ipfsIDForItem,
        nameOfItem:getImage.nameOfItem
      };
    }
    //remake all items in the temporary
    this.itemsOfPerson.forEach(x=>{
      this.temporaryItems.push({url:x.url,nameOfItem:x.nameOfItem});
    })

    //push object in items
    this.temporaryItems.push(itemForUser);

    //make the new json
    var userJson = JSON.stringify(this.temporaryItems);

    //after finishing json..update ipfs
    var ipfsID;
    var fileJSON;
    
    if(this.ipfsKeyFromContract == undefined){
      fileJSON = new File(["["+userJson+"]"],"itemsOfUsers");
    }
    else{
      fileJSON = new File([userJson],"itemsOfUsers");
    }
    await IpfsUtils.addUserItem(fileJSON).then(ipfsId => {
      ipfsID = ipfsId;
      console.log(IpfsUtils.IPFS_SERVER + ipfsId);
    });

    //add item in contract for user
    this.contractService.buyItem(getImage.nameOfItem,getImage.legendary,getImage.costGold,getImage.costSilver,getImage.costCopper,ipfsID);
    
    this.images.forEach(x=> x.selected = false);
  }


  async sellItem() {
    var getImage = this.itemsOfPerson.find(x=>x.selected==true);
    if(getImage == undefined || getImage.nameOfItem == ""){
      this.notifierService.notify("warning","Please select an item.");
      return;
    }
    var itemToDelete;
    itemToDelete = this.images.find(x=>x.nameOfItem == getImage.nameOfItem);
    if(itemToDelete == undefined){
      this.notifierService.notify("error","Problem occured.You are trying to sell an item you don't have.");
      return;
    }
    this.itemsOfPerson = this.itemsOfPerson.filter(x=> x != getImage);

    this.itemsOfPerson.forEach(x=> 
      this.temporaryItems.push({
          url:x.url,
          nameOfItem:x.nameOfItem
      }));

    var fileJSON;
    var ipfsID;

    //make json after deleting everything
    var userJson = JSON.stringify(this.temporaryItems);

    if(this.ipfsKeyFromContract == undefined){
      fileJSON = new File(["["+userJson+"]"],"itemsOfUsers");
    }
    else{
      fileJSON = new File([userJson],"itemsOfUsers");
    }
    await IpfsUtils.addUserItem(fileJSON).then(ipfsId => {
      ipfsID = ipfsId;
      console.log(IpfsUtils.IPFS_SERVER + ipfsId);
    });

    this.contractService.sellItem(getImage.nameOfItem,itemToDelete.costGold,itemToDelete.costSilver,itemToDelete.costCopper,ipfsID);

    this.itemsOfPerson.forEach(x=> x.selected = false);
  }

  public async buyGold(){
    
    if(this.inputEther==0 || this.inputEther==undefined){
      this.notifierService.notify('error','ether to exchange should be positive');
      return;
    }
    //call contract
    console.log(this.inputEther);
    this.contractService.buyCoins(this.inputEther);
    // console.log(this.web3.fromWei(this.web3.eth.getBalance(this.account))); 
  }
  
  public getJSONFromIpfs(ipfsPath:string){
    return this.ipfsService.getUserItems(ipfsPath).subscribe((x:Array<ItemsOwned>)=>{
        this.itemsOfPerson = x;
    });
  }

  private async runComponent(){
    //since blizzard has too many restrictions on API and wants money most of the time... so...downloaded some items locally
    this.images =[
      { legendary:true, costCopper: 32, costSilver:22 ,costGold:8 ,nameOfItem:"Artifact WindRunner Bow" ,url:"../../assets/images/inv_bow_1h_artifactwindrunner_d_02.jpg",selected:false},
      { legendary:false, costCopper: 46, costSilver:25 ,costGold:0 ,nameOfItem:"Draenor Dungeon Bow" ,url:"../../assets/images/inv_bow_1h_draenordungeon_c_01.jpg",selected:false},
      { legendary:false, costCopper: 23, costSilver:37 ,costGold:1 ,nameOfItem:"Draenor Honor Bow" ,url:"../../assets/images/inv_bow_1h_draenorhonor_c_01.jpg",selected:false},
      { legendary:false, costCopper: 85, costSilver:48 ,costGold:1 ,nameOfItem:"Draenor Quest Bow" ,url:"../../assets/images/inv_bow_1h_draenorquest_b_01.jpg",selected:false},
      { legendary:false, costCopper: 99, costSilver:97 ,costGold:1 ,nameOfItem:"Draenor Raid Bow" ,url:"../../assets/images/inv_bow_1h_draenorraid_d_01.jpg",selected:false},
      { legendary:false, costCopper: 87, costSilver:43 ,costGold:0 ,nameOfItem:"Ogrimar Raid Bow" ,url:"../../assets/images/inv_bow_1h_orgrimmarraid_d_02.jpg",selected:false},
      { legendary:false, costCopper: 33, costSilver:93 ,costGold:0 ,nameOfItem:"PVP Draenors Bow" ,url:"../../assets/images/inv_bow_1h_pvpdraenors2_d_01.jpg",selected:false},
      { legendary:false, costCopper: 76, costSilver:12 ,costGold:2 ,nameOfItem:"PVP Horde Bow" ,url:"../../assets/images/inv_bow_1h_pvphorde_a_01_upres.jpg",selected:false},
      { legendary:false, costCopper: 56, costSilver:8 ,costGold:3 ,nameOfItem:"Raid Hunter Helm" ,url:"../../assets/images/inv_helm_mail_raidhunter_q_01.jpg",selected:false},
      { legendary:false, costCopper: 46, costSilver:10 ,costGold:0 ,nameOfItem:"Head Dragon Misc" ,url:"../../assets/images/inv_misc_head_dragon_01.jpg",selected:false},
      { legendary:false, costCopper: 37, costSilver:22 ,costGold:0 ,nameOfItem:"Bernard Dog Pet" ,url:"../../assets/images/inv_stbernarddogpet.jpg",selected:false},
      { legendary:false, costCopper: 12, costSilver:46 ,costGold:0 ,nameOfItem:"Best Bow" ,url:"../../assets/images/inv_weapon_bow_16.jpg",selected:false},
      { legendary:true, costCopper: 32, costSilver:55 ,costGold:6 ,nameOfItem:"Legendary bow" ,url:"../../assets/images/inv_weapon_bow_58.jpg",selected:false}
    ]
    this.contractService.initWeb3();
    await this.contractService.getAccount();
    await this.contractService.getBalance();
    await this.contractService.setDefaultAcc();
    this.accountBalance = this.contractService.account_balance;

    await this.contractService.getCoinsForAddress().then(x=> {
      this.accountGold = x[0];
      this.accountSilver = x[1];
      this.accountCopper = x[2];
    });

    //get ipfs hash from contract
    await this.contractService.getIpfsHashForUser().then(x=> this.ipfsKeyFromContract = x);

    //read json of persons items
    if(this.ipfsKeyFromContract == undefined || this.ipfsKeyFromContract == ""){
      this.notifierService.notify("info","No items in account");
      return;
    }

    this.getJSONFromIpfs(this.ipfsKeyFromContract);

  }
}
