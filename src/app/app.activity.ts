import { App, Events } from 'ionic-angular';
import { AuthProvider } from '../providers/auth/auth';
import { ToastProvider } from '../providers/toast/toast';
import { NetworkProvider } from '../providers/network/network';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

export class Activity {
  rootPage: any;
  constructor(
    public events: Events,
    public appCtrl: App,
    public authProvider: AuthProvider,
    public networkProvider: NetworkProvider,
    public toastProvider: ToastProvider,
  ) {
    this.handleEvents();
    this.networkProvider.checkNetworkStatus();
    this.isLoggedIn();
  }

  handleEvents() {
    this.events.subscribe('user:login', () => {
      this.login();
    });

    this.events.subscribe('user:logout', () => {
      this.logout();
    });
    this.events.subscribe("offline", () => {
      this.offline();
    });
    this.events.subscribe("online", () => {
      this.online();
    });
  }
  public logout() {
    localStorage.clear();
    this.appCtrl.getRootNavs()[0].setRoot(LoginPage, {}, { animate: true, direction: 'forward' });
  }

  public offline() {
    this.toastProvider.showToast('You are offline', 'top', true);

  }

  public online() {
    this.toastProvider.showToast('Back Online', 'top', true);
  }
  login(): any {
    this.rootPage = HomePage;
  }

  isLoggedIn() {
    if(this.authProvider.isLoggedIn()){
      this.rootPage = HomePage;
    } else {
      this.rootPage = LoginPage
    }
  }
}