import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { concatMap, iif, map, Observable, of, take, tap } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { FacebookAuthProvider, getAuth, GithubAuthProvider, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public http:HttpClient,
    public utilService:UtilityService
  ) { }

  config ={
    apiKey: "AIzaSyBLEhP3Y1WrW-sIQFn_JjqJXW2BSqHKfmg",
    authDomain: "tooboards-57f9c.firebaseapp.com",
  }


  app= initializeApp(this.config)
  auth = (()=>{
    let auth = getAuth(this.app)
    auth.useDeviceLanguage()
    return auth
  })();
  googleProvider = new GoogleAuthProvider();
  facebookProvider = new FacebookAuthProvider();
  yahooProvider = new OAuthProvider('yahoo.com');
  microsoftProvider  =  new OAuthProvider('microsoft.com')
  githubProvider = new GithubAuthProvider();
  idpInfo = {
    GOOGLE:{
      provider:this.googleProvider,
      AuthProvider:GoogleAuthProvider
    },
    FACEBOOK:{
      provider:this.facebookProvider,
      AuthProvider:FacebookAuthProvider
    },
    YAHOO:{
      provider:this.yahooProvider,
      AuthProvider: OAuthProvider
    },
    MICROSOFT:{
      provider:this.microsoftProvider,
      AuthProvider: OAuthProvider
    },
    GITHUB:{
      provider:this.githubProvider,
      AuthProvider:GithubAuthProvider
    }

  }

}
