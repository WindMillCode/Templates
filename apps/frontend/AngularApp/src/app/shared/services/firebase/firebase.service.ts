import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { concatMap, iif, map, Observable, of, take, tap } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, FacebookAuthProvider, getAuth, GithubAuthProvider, GoogleAuthProvider, OAuthProvider,TwitterAuthProvider } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public http:HttpClient,
    public utilService:UtilityService
  ) { }

  app= initializeApp(ENV.firebase.config)
  auth = (()=>{
    let auth = getAuth(this.app)
    if(ENV.type ==="dev"){
      connectAuthEmulator(auth, "http://127.0.0.1:9099",{disableWarnings:true})
    }
    auth.useDeviceLanguage()
    return auth
  })();
  googleProvider = new GoogleAuthProvider();
  facebookProvider = new FacebookAuthProvider();
  yahooProvider = new OAuthProvider('yahoo.com');
  microsoftProvider  =  new OAuthProvider('microsoft.com')
  githubProvider = new GithubAuthProvider();
  twitterProvider = new TwitterAuthProvider()
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
    },
    TWITTER:{
      provider:this.twitterProvider,
      AuthProvider:TwitterAuthProvider
    }

  }

}
