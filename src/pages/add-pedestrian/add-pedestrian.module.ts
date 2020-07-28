import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPedestrianPage } from './add-pedestrian';

@NgModule({
  declarations: [
    AddPedestrianPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPedestrianPage),
  ],
})
export class AddPedestrianPageModule {}
