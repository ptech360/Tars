import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDriverPage } from './add-driver';

@NgModule({
  declarations: [
    AddDriverPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDriverPage),
  ],
})
export class AddDriverPageModule {}
