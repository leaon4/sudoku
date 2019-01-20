import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SuduItemComponent } from './sudu-item/sudu-item.component';
import { SuduEditableItemComponent } from './sudu-editable-item/sudu-editable-item.component';
import { BottomControllerComponent } from './bottom-controller/bottom-controller.component';

@NgModule({
  declarations: [
    AppComponent,
    SuduItemComponent,
    SuduEditableItemComponent,
    BottomControllerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
