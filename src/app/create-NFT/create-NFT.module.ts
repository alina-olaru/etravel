import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateNFTComponent } from './create-NFT.component';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { LoadNFTComponent } from './load-NFT/load-NFT.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

const routes: Routes = [
  {
    path:'',
    component:CreateNFTComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    GoogleMapsModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule

  ],
  declarations: [CreateNFTComponent,LoadNFTComponent]
})
export class CreateNFTModule { }
