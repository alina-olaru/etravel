import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-NFT',
  templateUrl: './create-NFT.component.html',
  styleUrls: ['./create-NFT.component.scss']
})
export class CreateNFTComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  async uploadFile(event: any) {

    await this.addFile(event)
  }
  async addFile(fileContent: any) {

    let fd = new FormData();
    fd.append('files', fileContent);

    this.http.post('http://localhost:8080/api/upload', fd).subscribe(response => {
      console.log(response);
    },error=>{console.error(error)});


    // INFO: local
    // 1. Create IPFS instant
    // let ipfs = ipfsLib.create({
    //     url: 'http://localhost:5001'
    // });

    // // 2. Add file to ipfs
    // let cid = await ipfs.add(fileContent);
    // console.log(cid);

    // // 3. Get file status from ipfs
    // const fileStat = await ipfs.files.stat("/ipfs/" + (cid as any).path);

    // return {
    //     cid: (cid as any).path,
    //     size: fileStat.cumulativeSize
    // };


}

}
