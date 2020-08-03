import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import {
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureImageOptions
} from '@ionic-native/media-capture';
import { File, FileEntry } from '@ionic-native/File';
import { Media, MediaObject } from '@ionic-native/media';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Base64 } from '@ionic-native/base64';
import { Platform, ActionSheetController } from 'ionic-angular';
import { FileProvider } from '../../providers/file/file';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
const MEDIA_FOLDER_NAME = 'my_media';
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
  directory: string;
  @Input() formGroup: FormGroup;
  @Input() mediaFor: string;
  files = [];

  constructor(
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    private file: File,
    private media: Media,
    private streamingMedia: StreamingMedia,
    private photoViewer: PhotoViewer,
    private actionSheetController: ActionSheetController,
    private plt: Platform,
    private fileService: FileProvider,
    private base64: Base64
  ) {
    console.log('Hello MediaComponent Component');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.plt.ready().then(() => {
      let path = this.file.dataDirectory;
      try {
        this.file.checkDir(path, this.mediaFor).then(
          () => {
            // this.file.removeRecursively(path, this.mediaFor);
            this.loadFiles().then(() => {
              this.files.forEach(f => {
                this.file.removeFile(path + '/' + this.mediaFor, f.name)
              });
              this.loadFiles()
            })
          },
          err => {
            console.log(err);

            this.file.createDir(path, this.mediaFor, false);
          }
        );
      } catch (error) {
        this.showError(error.message);

      }

    });
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
          text: 'Load multiple',
          handler: () => {
            this.pickImages();
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
    this.imagePicker.getPictures({}).then(
      results => {
        for (var i = 0; i < results.length; i++) {
          this.copyFileToLocalDir(results[i]);
        }
      }
    );

    // If you get problems on Android, try to ask for Permission first
    // this.imagePicker.requestReadPermission().then(result => {
    //   console.log('requestReadPermission: ', result);
    //   this.selectMultiple();
    // });
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
      (err: CaptureError) => console.error(err)
    );
  }

  readFile(file) {
    const accidentPics = <FormArray>this.formGroup.controls['medias'];
    this.base64.encodeFile(file.fullPath).then((base64File: string) => {
      accidentPics.push(new FormControl(this.dataURLtoFile(base64File, file.name, file.type)));
    }, (err) => {
      console.log(err);
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
      (err: CaptureError) => console.error(err)
    );
  }

  recordVideo() {
    this.mediaCapture.captureVideo().then(
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
      (err: CaptureError) => console.error(err)
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
        console.log('error: ', error);
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

  deleteFile(f: FileEntry, index: number) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    this.file.removeFile(path, f.name).then(() => {
      const medias = <FormArray>this.formGroup.controls['medias'];
      medias.removeAt(index);
      this.loadFiles();
    }, err => console.log('error remove: ', err));
  }

  loadFiles() {
    return this.file.listDir(this.file.dataDirectory, this.mediaFor).then(
      res => {
        this.files = res;
        console.log(this.files);
      },
      err => console.log('error loading files: ', err)
    );
  }

}
