import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { MediaCapture/*, MediaFile, CaptureError, CaptureImageOptions*/ } from '@ionic-native/media-capture';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { VideoPlayer } from '@ionic-native/video-player';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ViewAccidentsPage } from '../pages/view-accidents/view-accidents';
import { ReportAccidentPage } from '../pages/report-accident/report-accident';
import { AccidentProvider } from '../providers/accident/accident';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastProvider } from '../providers/toast/toast';
import { AccidentPage } from '../pages/accident/accident';
import { Geolocation } from '@ionic-native/geolocation';
import { AuthProvider } from '../providers/auth/auth';
import { ApiProvider } from '../providers/api/api';
import { LoginPage } from '../pages/login/login';
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    ReportAccidentPage,
    ViewAccidentsPage,
    AccidentPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ReportAccidentPage,
    ViewAccidentsPage,
    AccidentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    MediaCapture,
    Media,
    Network,
    File,
    VideoPlayer,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ApiProvider,
    AccidentProvider,
    ToastProvider,
    NetworkProvider,
  ]
})
export class AppModule {}
