import { Component, ViewChild } from '@angular/core';
import { Platform, App, Events, Nav, Alert, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Activity } from './app.activity';
import { AuthProvider } from '../providers/auth/auth';
import { NetworkProvider } from '../providers/network/network';
import { ToastProvider } from '../providers/toast/toast';
import { AndroidPermissions } from '@ionic-native/android-permissions';
@Component({
  templateUrl: 'app.html'
})
export class Tars extends Activity {
  @ViewChild(Nav) navCtrl: Nav;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public events: Events,
    public appCtrl: App,
    public authProvider: AuthProvider,
    public networkProvider: NetworkProvider,
    public toastProvider: ToastProvider,
    androidPermissions: AndroidPermissions,
    public alertCtrl: AlertController) {
    super(events, appCtrl, authProvider, networkProvider, toastProvider);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      platform.registerBackButtonAction(() => {
        //sometimes the best thing you can do is not think, not wonder, not imagine, not obsess. 
        //just breathe, and have faith that everything will work out for the best.

        if (this.navCtrl.canGoBack()) {
          const alert: Alert = this.alertCtrl.create({
            // title: 'Confirm',
            message: 'Are you sure, you want to exit?',
            buttons: [{
              text: 'Cancel',
              role: 'cancel'
            }, {
              text: 'Exit',
              handler: () => {
                platform.exitApp();
              }
            }]

          });
          alert.present();
          return;
        }
        // else {
        //   this.navCtrl.pop()
        // }
      }, 1);
      statusBar.styleDefault();
      statusBar.styleBlackTranslucent();
      splashScreen.hide();
      androidPermissions.requestPermissions(
        [
          androidPermissions.PERMISSION.CAMERA,
          androidPermissions.PERMISSION.CALL_PHONE,
          androidPermissions.PERMISSION.GET_ACCOUNTS,
          androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
          androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
          androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
        ]
      );
    });
  }
}



