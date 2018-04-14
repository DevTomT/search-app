import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { HttpClientModule } from '@angular/common/http';
import * as $ from 'jquery';


import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { FooterComponent } from './components/footer/footer.component';



@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterializeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
