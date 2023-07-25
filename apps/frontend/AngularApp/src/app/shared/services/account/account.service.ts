import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { concatMap, defer, from, iif, map, Observable, of, ReplaySubject, Subject, take, tap } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo, FacebookAuthProvider,UserCredential, onAuthStateChanged } from 'firebase/auth';
import { BaseService } from '@core/base/base.service';
import { WmlButtonOneParams } from '@windmillcode/angular-wml-button-zero';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    public http:HttpClient,
    public utilService:UtilityService,
    public firebaseService:FirebaseService,
    public baseService:BaseService
  ) { }

  users:AccountServiceUser[] = []
  currentUser:AccountServiceUser


  createUserViaFirebaseProvider = (provider:keyof FirebaseService["idpInfo"])=>{

    let idpInfo = this.firebaseService.idpInfo[provider]
    return from(
      signInWithPopup(this.firebaseService.auth, idpInfo.provider)
        .then((result) => {

          this.users.push(
            new AccountServiceUser({
              user:result.user
            })
          );
          this.currentUser = this.users.at(-1)
          this.utilService.router.navigateByUrl(ENV.nav.urls.home)
        })
        .catch((error) => {
          console.log(error)

          this.baseService.openSystemError()
        })
      )
  }

  signOutViaFirebase =()=>{
    return from(this.firebaseService.auth.signOut())
    .pipe(
      tap({
        next:()=>{
          this.users.pop()
          this.currentUser = this.users.at(-1)
          this.baseService.generateWMLNote("AccountService.wmlNotify.loggedOutSuccess")
        },
        error:()=>{
          this.baseService.generateWMLNote("AccountService.wmlNotify.loggedOutError")
        }
      })
    )

  }


  onAuthStateChangedEvent = new ReplaySubject<void>(Infinity)
  manageUsersLoginInfo = ()=>{
    onAuthStateChanged(this.firebaseService.auth, (user) => {
      if (user) {
        this.users.push(
          new AccountServiceUser({
            user
          })
        )
      }
      else{
        this.users = []
      }
      this.currentUser = this.users.at(-1)
      this.onAuthStateChangedEvent.next()
    });
  }
}


export class AccountServiceUser {
  constructor(params:Partial<AccountServiceUser>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  user:UserCredential["user"]
}
