declare var google: any
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environement } from 'src/environements/environement';
import { SigninService } from '../../services/signin.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private signinService: SigninService
  ) {}
  // ========= VARIABLE ===========

  logForm!: FormGroup;
  userNameCtrl!: FormControl;
  passwordCtrl!: FormControl;
  
  // ======= CONSTANTE =============
  
  envId = environement.client_id
  onLoad!: boolean;
  //========= METHODE ===========
  unitForm(){
    this.userNameCtrl = this.formBuilder.control('');
    this.userNameCtrl.updateValueAndValidity()
    this.userNameCtrl.addValidators([Validators.email, Validators.required])

    this.passwordCtrl = this.formBuilder.control('')
    this.passwordCtrl.updateValueAndValidity()
    this.passwordCtrl.addValidators([Validators.required, Validators.minLength(8)])
        updateOne: 'blur'
    this.passwordCtrl.updateValueAndValidity()
    this.logForm = this.formBuilder.group({
      userName: this.userNameCtrl,
      password: this.passwordCtrl
    })
  }
  public decodeMyToken(token: any){
   return this.signinService.decodeMyToken(token)
 }

  // intialised the google account
  unitGoogle(){
    google.accounts.id.initialize({
      client_id: this.envId,
      callback:(resp: any)=> this.handleLogin(resp)
    });
  google.accounts.id.renderButton(document.getElementById('social_media'),{
      theme: 'filled_blue',
      size: 'large',
      shape:'rectangle',
      width: 120,
      text: "signin_with"
    })
  }

  private decodeToken(token: string){
    return JSON.parse(atob(token.split('.')[1]));
  }
  handleLogin(resp: any) {
    if(resp){
      //decoder le token
      const paylod = this.decodeToken(resp.credential)
      //enregistrer le token
      sessionStorage.setItem('loggedInUser', JSON.stringify(paylod));
      //redirection vers l'accueil
      this.router.navigate(['/home']);     
    }
  }

 ngOnInit(): void{
  // initialize the formGroup 
  this.unitForm()
  // initialize a google account
  this.unitGoogle()
 }
 onSubmit(): void{
   const infouser =  this.logForm.value
   this.http.post('http://localhost:3000/auth', infouser).subscribe((res:any) => {
        if(res && typeof res === 'object' && 'token' in res){
          const token = res['token'];
          const usertype = this.decodeMyToken(token);
          console.log(usertype.role);
          if(usertype.role ==='admin'){
            this.router.navigate(['/bookstore/admin'])
          } else{
            this.router.navigate(['/bookstore'])
          }
          //enregistrer le token
          sessionStorage.setItem('token', token);          
        }})
      if(HttpErrorResponse){
        setTimeout(() => {
          this.onLoad=true; 
        }, 2000);      
    }
 }
}