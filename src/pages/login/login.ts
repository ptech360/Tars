import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit{

  loginForm:FormGroup;
  logging: boolean;
  errorMsg: string;

  constructor(public events: Events,public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder, public auth: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ngOnInit() {
    this.createForm();
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['ajaygarg01', Validators.required],
      password: ['abc123', Validators.required]
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.showError();
      return;
    }
    this.login();
  }

  login() {
    this.logging = true;
    this.auth.login(this.loginForm.value).subscribe((res: any) => {
      this.logging = false;
      this.auth.saveToken(res.access_token);
      this.navigate();
    }, (error: any) => {
      this.logging = false;
    })
  }

  navigate() {
    this.events.publish('user:login');
  }

  showError(msg?: string) {
    if (msg) { this.errorMsg = msg; return; }
    if (this.loginForm.controls.username.invalid) {
      this.errorMsg = 'Please enter username';
      return;
    }
    if (this.loginForm.controls.password.invalid) {
      this.errorMsg = 'Please enter password';
      return;
    }
  }

}
