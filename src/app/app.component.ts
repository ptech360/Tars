import { Component } from '@angular/core';
import { Platform, App, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Activity } from './app.activity';
import { AuthProvider } from '../providers/auth/auth';
import { NetworkProvider } from '../providers/network/network';
import { ToastProvider } from '../providers/toast/toast';
@Component({
  templateUrl: 'app.html'
})
export class Tars extends Activity {

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public events: Events,
    public appCtrl: App,
    public authProvider: AuthProvider,
    public networkProvider: NetworkProvider,
    public toastProvider: ToastProvider,) {
    super(events, appCtrl, authProvider, networkProvider, toastProvider);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}



