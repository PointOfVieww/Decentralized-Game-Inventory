import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IpfsService } from './services/ipfs.service';
import { HttpClientModule } from '@angular/common/http';
import { ContractService } from './services/contract.service';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    IpfsService,
    ContractService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
