import { Component, OnInit } from '@angular/core';

import { Image } from './models/image-model';
import IpfsUtils from './utils/ipfs-utils';
import { Item } from './models/items-model';
import { IpfsService } from './services/ipfs.service';
import { ContractService } from './services/contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  images:Image[]
  itemsOfPerson:Array<Item> = [];
  ipfsKeyFromContract:string;
  temporaryItems:Item[] = [];
  account_balance: number;

 constructor(private ipfsService:IpfsService,private contractService:ContractService) {}
  
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
    this.contractService.initWeb3();
    await this.contractService.getAccount();
    await this.contractService.getBalance();
    await this.contractService.setDefaultAcc();
    this.account_balance = this.contractService.account_balance;

    //get from smart contract ipfs id

     this.ipfsKeyFromContract = "QmSVPRyabNTdNW2tjdqya1oCoihRLy7aWTTcGzjH6XFumr";
    //read json of persons items

    var test;
    this.getJSONFromIpfs(this.ipfsKeyFromContract);

     //this.itemsOfPerson.push({url:IpfsUtils.IPFS_SERVER + "Qmf8kiL6oSKUcLz9fiW8J4CPjuDduLWBqcCDrLwaFckTNh",nameOfItem:"yy"});
     //this.itemsOfPerson.push({url:IpfsUtils.IPFS_SERVER + "QmQJA8ySaT7BL4SAq2FJFtSTwwXjE1fRWZQey3n42G8EHZ",nameOfItem:"yaerta"});
  }

  async buyItem(){
    
    var getImage = this.images.filter(x=>x.selected==true);
    var tempFile;
    var ipfsIDForItem;
    var itemForUser;
    let hasAnyItems:boolean;

    if(this.ipfsKeyFromContract == undefined){
      

    }

    if(this.itemsOfPerson.find(x=>x.nameOfItem == getImage[0].nameOfItem)){
      itemForUser= this.itemsOfPerson.find(x=>x.nameOfItem == getImage[0].nameOfItem);
      
    }
    else{
      //get file from current images in assets
      await IpfsUtils.getFileFromLocalUrl(getImage[0].url,getImage[0].nameOfItem)
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
        nameOfItem:getImage[0].nameOfItem
      };
      
    }
    //push object in items
    this.itemsOfPerson.push(itemForUser);

    //make the new json
    var userJson = JSON.stringify(this.itemsOfPerson);

    //after finishing json..update ipfs
    var ipfsID;
    var fileJSON;
    
    if(this.ipfsKeyFromContract == undefined){
      fileJSON = new File(["["+userJson+"]"],"itemsOfUsers");
    }
    else{
      fileJSON = new File([userJson],"itemsOfUsers");
    }
    IpfsUtils.addUserItem(fileJSON).then(ipfsId => {
      ipfsID = ipfsId;
      console.log(IpfsUtils.IPFS_SERVER + ipfsId);
    });

    //add ipfsID in smart contract to current msg.sender
    
    this.images.forEach(x=>x.selected=false);
  }
  
  public getJSONFromIpfs(ipfsPath:string){
    return this.ipfsService.getUserItems(ipfsPath).subscribe((x:Array<Item>)=>{

        this.itemsOfPerson = x;

    });
  }

  public async buyGold(){
    //call contract

    this.contractService.buyCoins();
    // console.log(this.web3.fromWei(this.web3.eth.getBalance(this.account))); 
    
  }
  
  
}


