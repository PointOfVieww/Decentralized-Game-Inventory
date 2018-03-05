import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Item } from "../models/items-model";

@Injectable()
export class IpfsService{
    ipfsURL = 'https://ipfs.io/ipfs/';
    constructor(private http:HttpClient) { }

    public getUserItems(ipfsIDPath:string) {
        return this.http.get<Array<Item>>(this.ipfsURL + ipfsIDPath);
    }
}