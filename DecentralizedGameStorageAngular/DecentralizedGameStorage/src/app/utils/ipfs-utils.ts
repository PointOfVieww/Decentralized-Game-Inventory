import {Buffer} from 'buffer/';
import * as ipfsApi from 'ipfs-api';
import { HttpClient } from '@angular/common/http';

export default class IpfsUtils {
    public static get IPFS_SERVER(): string {
        return 'https://ipfs.io/ipfs/';
    }
    private static ipfs = ipfsApi('ipfs.infura.io', '5001', {protocol: 'https'});
    
    public static addUserItem(file) {
        return new Promise(resolve => {
          let reader = new (<any>window).FileReader();
          reader.onloadend = () => {
            this.saveUserItemToIpfs(reader).then(ipfsId => {
              resolve(ipfsId);
            });
          };
          reader.readAsArrayBuffer(file);
        });
    }
    
    public static saveUserItemToIpfs(reader) {
        const buffer = Buffer.from(reader.result);
        return new Promise(resolve => {

            // IpfsUtils.ipfs.files.mkdir('/user/directory').then((response)=>{
            //     resolve(response[0].hash)
            // })

            this.ipfs.add(buffer)
            .then((response) => {
                resolve(response[0].hash);
            })
            .catch((err) => {
                console.error(err);
            });
        });
    }

    public static async getFileFromLocalUrl(filePath:string,fileName) {
        var res = await fetch(filePath);
        var blob = await res.blob();
        
        return this.blobToFile(blob,fileName);
    }
    private static blobToFile(theBlob: Blob, fileName:string): File {
        var b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;

        return <File>theBlob;
    }  
}