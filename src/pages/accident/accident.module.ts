import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccidentPage } from './accident';

@NgModule({
  declarations: [
    AccidentPage,
  ],
  imports: [
    IonicPageModule.forChild(AccidentPage),
  ],
})
export class AccidentPageModule {}
