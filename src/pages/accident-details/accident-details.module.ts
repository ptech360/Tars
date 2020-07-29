import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccidentDetailsPage } from './accident-details';

@NgModule({
  declarations: [
    AccidentDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccidentDetailsPage),
  ],
})
export class AccidentDetailsPageModule {}
