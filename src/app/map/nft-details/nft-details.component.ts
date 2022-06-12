import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-nft-details',
  templateUrl: './nft-details.component.html',
  styleUrls: ['./nft-details.component.scss']
})
export class NftDetailsComponent implements OnInit {
  price=0;
  constructor( public dialogRef: MatDialogRef<NftDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

     }

  ngOnInit() {
  }
  sell(){
    this.dialogRef.close(this.price);
  }

}
