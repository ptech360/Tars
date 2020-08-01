import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/File';
import { MediaCapture } from '@ionic-native/media-capture';
import { Media } from '@ionic-native/media';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { Tars } from './app.component';
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
import { VideoPlayer } from '@ionic-native/video-player';
import { InvolvedVehiclePage } from '../pages/involved-vehicle/involved-vehicle';
import { AddVehiclePage } from '../pages/add-vehicle/add-vehicle';
import { AddPersonPage } from '../pages/add-person/add-person';
import { AddPedestrianPage } from '../pages/add-pedestrian/add-pedestrian';
import { AccidentDetailsPage } from '../pages/accident-details/accident-details';
import { SubmitAccidentPage } from '../pages/submit-accident/submit-accident';
import { FileProvider } from '../providers/file/file';
import { Base64 } from '@ionic-native/base64';
import { MediaComponent } from '../components/media/media';

@NgModule({
  declarations: [
    Tars,
    LoginPage,
    HomePage,
    ReportAccidentPage,
    ViewAccidentsPage,
    AccidentPage,
    AddVehiclePage,
    AccidentDetailsPage,
    SubmitAccidentPage,
    MediaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(Tars),
    IonicStorageModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [IonicApp],
  entryComponents: [
    Tars,
    LoginPage,
    HomePage,
    ReportAccidentPage,
    ViewAccidentsPage,
    AccidentPage,
    AddVehiclePage,
    AccidentDetailsPage,
    SubmitAccidentPage,
    MediaComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ToastProvider,
    NetworkProvider,
    Camera,
    ImagePicker,
    MediaCapture,
    File,
    Media,
    StreamingMedia,
    PhotoViewer,
    Network,
    VideoPlayer,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    ApiProvider,
    AccidentProvider,
    FileProvider,
    Base64
  ]
})
export class AppModule { }
