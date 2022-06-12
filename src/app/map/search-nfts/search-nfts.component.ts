import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-search-nfts',
  templateUrl: './search-nfts.component.html',
  styleUrls: ['./search-nfts.component.scss']
})
export class SearchNftsComponent implements OnInit {
  searchText = new FormControl();
  @Output() searchTextChanged = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.searchText.valueChanges.subscribe(newSearchValue=>{
      this.searchTextChanged.emit(newSearchValue);
    })
  }

}
