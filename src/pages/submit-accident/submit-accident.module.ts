import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubmitAccidentPage } from './submit-accident';

@NgModule({
  declarations: [
    SubmitAccidentPage,
  ],
  imports: [
    IonicPageModule.forChild(SubmitAccidentPage),
  ],
})
export class SubmitAccidentPageModule {}
