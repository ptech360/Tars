import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import {
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureImageOptions,
  CaptureVideoOptions
} from '@ionic-native/media-capture';
import { File, FileEntry } from '@ionic-native/File';
import { Media, MediaObject } from '@ionic-native/media';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Base64 } from '@ionic-native/base64';
import { Platform, ActionSheetController, AlertController } from 'ionic-angular';
import { FileProvider } from '../../providers/file/file';
import { FormArray, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastProvider } from '../../providers/toast/toast';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { VideoEditor } from '@ionic-native/video-editor';
const MEDIA_FOLDER_NAME = 'my_media';
declare let VanillaFile: any;

/**
 * Generated class for the MediaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'media',
  templateUrl: 'media.html'
})
export class MediaComponent implements OnInit, AfterViewInit {
  mediaFiles: any[];
  bucketUrl: string;
  directory: string;
  @Input() viewOnly: boolean;
  @Input() formGroup: FormGroup;
  @Input() mediaFor: string;
  @Input() set savedMedia(medias: any[]) {
    this.mediaFiles = medias && medias.filter(m => {
      const f = !(m instanceof VanillaFile)
      return f;
    });
    if (this.mediaFiles && this.mediaFiles.length && this.formGroup) {
      const accidentPics = <FormArray>this.formGroup.controls['medias'];
      while (accidentPics.length !== 0) {
        accidentPics.removeAt(0)
      }
      this.mediaFiles.forEach(media => {
        accidentPics.push(new FormBuilder().group({
          id: media.id,
          extension: media.extension,
          mediaName: media.mediaName,
          mediaOriginalName: media.mediaOriginalName
        }));
      });
    }
  }
  files = [];



  accessToken = "&access_token=" + localStorage.getItem('access_token');
  constructor(
    private sanatizer: DomSanitizer,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    private file: File,
    private transfer: FileTransfer,
    private media: Media,
    private streamingMedia: StreamingMedia,
    private photoViewer: PhotoViewer,
    private actionSheetController: ActionSheetController,
    private plt: Platform,
    private fileService: FileProvider,
    public alertCtrl: AlertController,
    private base64: Base64,
    private accidentProvider: AccidentProvider,
    public toastSev: ToastProvider,
    public camera: Camera,
    public filePath: FilePath,
    private videoEditor: VideoEditor
  ) {
    console.log('Hello MediaComponent Component');
  }

  ngOnInit() {
    this.bucketUrl = this.accidentProvider.getBaseUrl() + '/api/media/download?name=';
  }

  ngAfterViewInit() {

  }

  setMedias(medias) {
    this.savedMedia = medias;
  }

  setMediaFor(mediaFor) {
    this.mediaFor = mediaFor;
  }

  clearDirectory(mediaFor?: string) {
    this.plt.ready().then(() => {
      let path = this.file.dataDirectory;
      try {
        const dirName = mediaFor || this.mediaFor
        this.file.checkDir(path, dirName).then(
          () => {
            // this.file.removeRecursively(path, this.mediaFor);
            // this.loadFiles().then(() => {
            //   try {
            //     this.files.forEach(f => {
            //       this.file.removeFile(path + '/' + this.mediaFor, f.name)
            //     });
            //   } catch (e) {
            //     console.log(e);

            //   }
            // })
            this.file.removeRecursively(path, dirName).catch(e => console.log(e))
            this.files = []
            // this.loadFiles();
            // this.file.createDir(path, this.mediaFor, true).catch(e => console.log(e))
            // this.loadFiles()
          },
          err => {
            console.log(err);

            this.file.createDir(path, this.mediaFor, true);
          }
        );
      } catch (error) {
        //this.showError(error.message);
        this.file.createDir(path, this.mediaFor, true);
      }

    });
  }

  clearFiles() {
    this.files = [];
  }

  createDirectory() {
    let path = this.file.dataDirectory;
    this.file.createDir(path, this.mediaFor, true);
  }

  async selectMedia() {
    const actionSheet = await this.actionSheetController.create({
      title: 'What would you like to add?',
      buttons: [
        {
          text: 'Capture Image',
          handler: () => {
            this.captureImage();
          }
        },
        {
          text: 'Record Video',
          handler: () => {
            this.recordVideo();
          }
        },
        // {
        //   text: 'Record Audio',
        //   handler: () => {
        //     this.recordAudio();
        //   }
        // },
        {
          text: 'Pick images from Gallary',
          handler: () => {
            this.pickImages();
          }
        },
        {
          text: 'Pick video from Gallary',
          handler: () => {
            this.pickVideos();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  pickImages() {
    this.imagePicker.getPictures({
      quality: 50
    }).then(
      results => {
        console.log(results);

        const accidentPics = <FormArray>this.formGroup.controls['medias'];
        for (var i = 0; i < results.length; i++) {
          this.copyFileToLocalDir(results[i]);
          this.file.resolveLocalFilesystemUrl(results[i])
            .then(entry => {
              (<FileEntry>entry).file(file => {
                var reader = new FileReader();
                var that = this;
                reader.onloadend = () => {
                  accidentPics.push(new FormControl(that.dataURLtoFile(reader.result, file.name, file.type)));
                };
                reader.readAsDataURL(file);
              })
            })
        }
      }
    );

    // If you get problems on Android, try to ask for Permission first
    // this.imagePicker.requestReadPermission().then(result => {
    //   console.log('requestReadPermission: ', result);
    //   this.selectMultiple();
    // });
  }

  pickVideos() {
    const cameraOptions: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      mediaType: this.camera.MediaType.VIDEO
    };
    this.camera.getPicture(cameraOptions).then(
      results => {
        const accidentPics = <FormArray>this.formGroup.controls['medias'];
        if (results && results.length) {
          this.toastSev.showLoader('Processing video...');
          this.copyFileToLocalDir('file:///' + results);
          this.file.resolveLocalFilesystemUrl('file:///' + results)
            .then(entry => {
              (<FileEntry>entry).file(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  this.toastSev.hideLoader();
                  accidentPics.push(new FormControl(this.dataURLtoFile(reader.result, file.name, file.type)));
                };
                reader.readAsDataURL(file);

              })
            })
        }
      })
  }

  captureImage() {
    let options: CaptureImageOptions = { limit: 1 }
    this.mediaCapture.captureImage(options).then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
          this.file.resolveLocalFilesystemUrl(data[0].fullPath)
            .then(entry => {
              (<FileEntry>entry).file(file => {
                this.readFile(data[0]);
              })
            })
        }
      },
      (err: any) => this.showError(err.message)
    );
  }

  readFile(file) {
    const accidentPics = <FormArray>this.formGroup.controls['medias'];
    this.base64.encodeFile(file.fullPath).then((base64File: string) => {
      accidentPics.push(new FormControl(this.dataURLtoFile(base64File, file.name, file.type)));
    }, (err) => {
      this.showError(err.message)
    });
  }


  dataURLtoFile(dataurl, filename, fileType) {
    var arr = dataurl.split(','),
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return this.fileService.getFile(u8arr, filename, fileType);
  }

  recordAudio() {
    this.mediaCapture.captureAudio().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: any) => this.showError(err.message)
    );
  }

  recordVideo() {
    const captureVideoOptions: CaptureVideoOptions = {
      limit: 1,
      quality: 0
    }
    this.mediaCapture.captureVideo(captureVideoOptions).then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          const accidentPics = <FormArray>this.formGroup.controls['medias'];
          this.toastSev.showLoader('Processing video...');
          this.videoEditor.transcodeVideo({
            fileUri: data[0].fullPath,
            outputFileName: Date.now().toString(),
            outputFileType: this.videoEditor.OutputFileType.MPEG4
          }).then((fileUri: string) => {
            this.copyFileToLocalDir(data[0].fullPath);
            this.file.resolveLocalFilesystemUrl('file:///' + fileUri)
              .then(entry => {
                (<FileEntry>entry).file(file => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    this.toastSev.hideLoader();
                    accidentPics.push(new FormControl(this.dataURLtoFile(reader.result, file.name, file.type)));
                  };
                  reader.readAsDataURL(file);
                })
              })
          })
            .catch((error: any) => console.log('video transcode error', error));

          // this.file.resolveLocalFilesystemUrl(data[0].fullPath)
          //   .then(entry => {
          //     (<FileEntry>entry).file(file => {
          //       this.readFile(data[0]);
          //     })
          //   })
        }
      },
      (err: any) => this.showError(err.message)
    );
  }

  copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }

    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;

    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + this.mediaFor;
    this.file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        this.loadFiles();
      },
      error => {
        this.showError(error.message)
      }
    );
  }

  openFile(f: FileEntry) {
    if (f.name.indexOf('.wav') > -1) {
      // We need to remove file:/// from the path for the audio plugin to work
      const path = f.nativeURL.replace(/^file:\/\//, '');
      const audioFile: MediaObject = this.media.create(path);
      audioFile.play();

    } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(f.nativeURL);
    } else if (f.name.indexOf('.jpg') > -1) {
      // E.g: Use the Photoviewer to present an Image
      this.photoViewer.show(f.nativeURL, 'MY awesome image');
    }
  }

  openMediaFile(media) {
    if (media.media) {
      this.openFile(media.media);
    } else {
      this.downloadAndPlay(this.encodeURIComponent(this.bucketUrl + media.mediaName), media)
    }
  }

  encodeURIComponent(url) {
    return url.replace(/\\/g, '/');
  }

  downloadAndPlay(url, media) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.toastSev.showLoader();
    fileTransfer.download(url, this.file.dataDirectory + '/' + this.mediaFor + '/' + media.mediaOriginalName).then((entry) => {
      this.toastSev.hideLoader();
      media.media = entry;
      console.log('download complete: ', entry);
      this.openFile(entry)
    }, (error) => {
      console.log(error);
      // handle error
    });
  }

  deleteFile(f: FileEntry, index: number) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    this.file.removeFile(path, f.name).then(() => {
      const medias = <FormArray>this.formGroup.controls['medias'];
      medias.removeAt(index);
      this.loadFiles();
    }, err => this.showError(err.message))
  }

  deleteMediaFile(media, index) {
    this.mediaFiles.splice(this.mediaFiles.findIndex(m => m.id == media.id), 1);
    const medias = <FormArray>this.formGroup.controls['medias'];
    medias.removeAt(index);
  }

  loadFiles() {
    return this.file.listDir(this.file.dataDirectory, this.mediaFor).then(
      res => {
        this.files = res;
        console.log(this.files);
      },
      err => this.showError(err.message)
    );
  }

  loadAndPatchFiles() {
    this.files = [];
    this.file.listDir(this.file.dataDirectory, this.mediaFor).then(
      res => {
        this.files = res;
        const accidentPics = <FormArray>this.formGroup.controls['medias'];
        while (accidentPics.length !== 0) {
          accidentPics.removeAt(0)
        }
        this.files.forEach(entry => {
          (<FileEntry>entry).file(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
              this.toastSev.hideLoader();
              accidentPics.push(new FormControl(this.dataURLtoFile(reader.result, file.name, file.type)));
            };
            reader.readAsDataURL(file);

          })
        });
      },
      err => this.showError(err.message)
    );
  }

  showError = (message) => {
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    })
    alert.present();
  }
}

