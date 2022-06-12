/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyNftsComponent } from './my-nfts.component';

describe('MyNftsComponent', () => {
  let component: MyNftsComponent;
  let fixture: ComponentFixture<MyNftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
