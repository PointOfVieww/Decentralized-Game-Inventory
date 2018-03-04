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

  
  ngOnInit() {
    this.images =[
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Artifact WindRunner Bow" ,url:"../assets/images/inv_bow_1h_artifactwindrunner_d_02.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Draenor Dungeon Bow" ,url:"../assets/images/inv_bow_1h_draenordungeon_c_01.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Draenor Honor Bow" ,url:"../assets/images/inv_bow_1h_draenorhonor_c_01.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Draenor Quest Bow" ,url:"../assets/images/inv_bow_1h_draenorquest_b_01.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Draenor Raid Bow" ,url:"../assets/images/inv_bow_1h_draenorraid_d_01.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Ogrimar Raid Bow" ,url:"../assets/images/inv_bow_1h_orgrimmarraid_d_02.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"PVP Draenors Bow" ,url:"../assets/images/inv_bow_1h_pvpdraenors2_d_01.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"PVP Horde Bow" ,url:"../assets/images/inv_bow_1h_pvphorde_a_01_upres.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Raid Hunter Helm" ,url:"../assets/images/inv_helm_mail_raidhunter_q_01.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Head Dragon Misc" ,url:"../assets/images/inv_misc_head_dragon_01.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Bernard Dog Pet" ,url:"../assets/images/inv_stbernarddogpet.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Best Bow" ,url:"../assets/images/inv_weapon_bow_16.jpg",selected:false},
       { costCopper: 32, costSilver:2 ,costGold:3 ,nameOfItem:"Legendary bow" ,url:"../assets/images/inv_weapon_bow_58.jpg",selected:false}
  ]
  }

  buyItem(){
    var test = this.images.filter(x=>x.selected==true);
    console.log(test);
  }
}


