import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { MapComponent } from './map/map.component';
import { MyNftsComponent } from './my-nfts/my-nfts.component';
import { NftsForSaleComponent } from './nfts-for-sale/nfts-for-sale.component';

const routes: Routes = [
  {
    path:'home',
    loadChildren:() => import('./homepage/homepage.module').then(m => m.HomepageModule)
  },

  {
    path:'create-nft',
    loadChildren:() => import('./create-NFT/create-NFT.module').then(m => m.CreateNFTModule)
  },
  {
    path:'',
    component:HomepageComponent
  },{
    path:'map',
    component:NftsForSaleComponent
  },
  {
    path:'my-nfts',
    component:MyNftsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
