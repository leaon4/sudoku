import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SuduItemComponent } from './sudu-item/sudu-item.component';
import { SuduEditableItemComponent } from './sudu-editable-item/sudu-editable-item.component';

@NgModule({
  declarations: [
    AppComponent,
    SuduItemComponent,
    SuduEditableItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
