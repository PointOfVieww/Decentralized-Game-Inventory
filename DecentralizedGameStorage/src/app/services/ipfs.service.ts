import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Item } from "../models/items-model";
import { ItemsOwned } from "../models/items-owned";

@Injectable()
export class IpfsService{
    ipfsURL = 'https://ipfs.io/ipfs/';
    constructor(private http:HttpClient) { }

    public getUserItems(ipfsIDPath:string) {
        return this.http.get<Array<ItemsOwned>>(this.ipfsURL + ipfsIDPath);
    }
}