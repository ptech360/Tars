import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';

/*
  Generated class for the ToastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToastProvider {
  loading: any;

  constructor(
      private l: LoadingController,
      private toastCtrl: ToastController
  ) { }

  public showLoader(text?: string) {

      this.loading = this.l.create({
          content: text || 'Please wait...',
      });
      this.loading.present();
  }

  public hideLoader = () => {
      this.loading.dismiss();
   }

  public showToast(msg, pos?: string, showCloseBtn?: boolean) {

      const toast = this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: pos || 'bottom',
          showCloseButton: showCloseBtn,
          closeButtonText: 'Ok'
      });
     toast.present();
  }
}
