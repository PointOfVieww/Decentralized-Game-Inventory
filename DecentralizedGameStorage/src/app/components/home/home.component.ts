import { Component, OnInit } from '@angular/core';
import { IpfsService } from '../../services/ipfs.service';
import { ContractService } from '../../services/contract.service';
import { Image } from '../../models/image-model';
import { Item } from '../../models/items-model';
import IpfsUtils from '../../utils/ipfs-utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images:Image[]
  itemsOfPerson:Array<Item> = [];
  ipfsKeyFromContract:string;
  temporaryItems:Item[] = [];
  accountBalance: number;
  accountGold:number;
  accountSilver:number;
  accountCopper:number;
  inputEther:number;
  constructor(private ipfsService:IpfsService,private contractService:ContractService) { }

  async ngOnInit() {
    await this.runComponent();
  }

  async buyItem(){
    
    var getImage = this.images.filter(x=>x.selected==true);
    if(getImage == undefined || getImage.length == 0){
      alert("please select an item.");
      return;
    }
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

  public async buyGold(){
    if(this.inputEther==0 || this.inputEther==undefined){
      alert("ether to exchange should be positive");
      return;
    }
    //call contract
    console.log(this.inputEther);
    this.contractService.buyCoins(this.inputEther);
    // console.log(this.web3.fromWei(this.web3.eth.getBalance(this.account))); 
  }
  
  public getJSONFromIpfs(ipfsPath:string){
    return this.ipfsService.getUserItems(ipfsPath).subscribe((x:Array<Item>)=>{
        this.itemsOfPerson = x;
    });
  }

  private async runComponent(){
    //since blizzard has too many restrictions on API and wants money most of the time... so...downoaded some items locally
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

    await this.contractService.getGoldCoinsForAddress().then(x=> this.accountGold = x);
    await this.contractService.getSilverCoinsForAddress().then(x=> this.accountSilver = x);
    await this.contractService.getCopperCoinsForAddress().then(x=> this.accountCopper = x);
    
    //get from smart contract ipfs id

    this.ipfsKeyFromContract = "QmSVPRyabNTdNW2tjdqya1oCoihRLy7aWTTcGzjH6XFumr";
    //read json of persons items

    var test;
    this.getJSONFromIpfs(this.ipfsKeyFromContract);

     //this.itemsOfPerson.push({url:IpfsUtils.IPFS_SERVER + "Qmf8kiL6oSKUcLz9fiW8J4CPjuDduLWBqcCDrLwaFckTNh",nameOfItem:"yy"});
     //this.itemsOfPerson.push({url:IpfsUtils.IPFS_SERVER + "QmQJA8ySaT7BL4SAq2FJFtSTwwXjE1fRWZQey3n42G8EHZ",nameOfItem:"yaerta"});

  }

}
