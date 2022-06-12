/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoadNFTComponent } from './load-NFT.component';

describe('LoadNFTComponent', () => {
  let component: LoadNFTComponent;
  let fixture: ComponentFixture<LoadNFTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadNFTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadNFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
