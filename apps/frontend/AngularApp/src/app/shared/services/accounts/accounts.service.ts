import { inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { BehaviorSubject, catchError, concatMap, defer, delay, filter, from, iif, map, Observable, of, ReplaySubject, Subject, Subscriber, take, tap, throwError } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo, FacebookAuthProvider,UserCredential, onAuthStateChanged, User } from 'firebase/auth';
import { BaseService } from '@core/base/base.service';
import { WmlButtonOneParams } from '@windmillcode/angular-wml-button-zero';
import { SpecificService } from '@core/specific/specific.service';
import { WMLImage } from '@windmillcode/angular-wml-components-base';
import { CreateUserInAPIUIRequestBody, CreateUserInAPIUIResponseBody, createUserInAPILoad, createUserInAPISuccess } from './createUserInAPI';
import { AddCardToUserUIRequestBody, AddCardToUserUIResponseBody, addCardToUserLoad, addCardToUserSuccess } from './addCardToUser';
import { ListUsersUIRequestBody, ListUsersUIRequestBodyTypeEnum, ListUsersUIResponseBody, listUsersLoad, listUsersSuccess } from './listUsers';
import { ListCardsUIRequestBody, ListCardsUIResponseBody, listCardsLoad, listCardsSuccess } from './listCards';
import { StoreService } from '../store/store.service';
import { getSquareCustomerIDVIAFirebaseIDLoad, getSquareCustomerIDVIAFirebaseIDSuccess, GetSquareCustomerIDVIAFirebaseIDUIRequestBody, GetSquareCustomerIDVIAFirebaseIDUIResponseBody } from './getSquareCustomerIDVIAFirebaseID';
import { DeleteCardsUIRequestBody, DeleteCardsUIResponseBody, deleteCardsLoad, deleteCardsSuccess } from './deleteCards';
import { WmlNotifyBarType } from '@windmillcode/angular-wml-notify';
import { UpdateAddressUIRequestBody, UpdateAddressUIResponseBody, updateAddressLoad, updateAddressSuccess } from './updateAddress';
import { DeleteUserUIRequestBody, DeleteUserUIResponseBody, deleteUserLoad, deleteUserSuccess } from './deleteUser';
import { ExportUsersUIRequestBody, ExportUsersUIResponseBody, exportUsersLoad, exportUsersSuccess } from './exportUsers';



@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(
    public http:HttpClient,
    public utilService:UtilityService,
    public firebaseService:FirebaseService,
    public baseService:BaseService,
    public specificService:SpecificService,
    public injector:Injector,

  ) {}

  users:AccountsServiceUser[] = []
  currentUser:AccountsServiceUser
  paymentMethodsIsReadySubj = new BehaviorSubject<boolean>(false)
  paymentMethodsIsReadyObs$ = this.paymentMethodsIsReadySubj
  .pipe(
    filter((val) => val === true),
    take(1)
  )

  authenticateViaFirebaseProvider = (provider:keyof FirebaseService["idpInfo"],action:"signup" | "signin" = "signup")=>{

    let errorMsgShown = false
    let idpInfo = this.firebaseService.idpInfo[provider]
    this.baseService.openOverlayLoading()
    return from(
      signInWithPopup(this.firebaseService.auth, idpInfo.provider)
      )
      .pipe(
        concatMap((res0)=>{
          console.log(action)
          if(action === "signup"){
            return this.createUserInAPI({
              id:this.currentUser.id,
              email:this.currentUser.email,
              // @ts-ignore
              accessToken:res0.user.stsTokenManager.accessToken
            })
            .pipe(
              map((res1:CreateUserInAPIUIResponseBody)=> {
                this.currentUser.sqaureCustomerId = res1.sqaureCustomerId
                return {user:res0,sqaureCustomer: res1}
              })
            )
            // .pipe(
            //   delay(30000)
            // )

          }
          return this.listUsers(new ListUsersUIRequestBody({
            // @ts-ignore
            accessToken:res0.user.stsTokenManager.accessToken,
            type:ListUsersUIRequestBodyTypeEnum.GETPROFILE,
            filter:[
              {key:"reference_id",value:this.currentUser.sqaureReferenceId}
            ]
          }))
          .pipe(
            map((res1:ListUsersUIResponseBody)=> {
              console.log(res1)
              return {user:res0,sqaureCustomer: res1.data[0]}
            }),
            catchError((err)=>{
              if(!errorMsgShown){
                this.baseService.generateWMLNote(
                  "AccountsService.wmlNotify.corruptedAccount",
                  WmlNotifyBarType.Error
                )
                errorMsgShown =true
              }
              return this.signOutViaFirebase()
              .pipe(
                tap(()=>{
                  throw new Error("Coruppted Acct")
                })
              )

            })
          )
        }),
        tap({
          next:(result:{
            user:UserCredential,
            sqaureCustomer:any
          })=>{
            this.users.push(
              new AccountsServiceUser({
                user:result.user.user,
                sqaureCustomerId:result.sqaureCustomer.id,
                address:result.sqaureCustomer.address
              })
            );
            this.currentUser = this.users.at(-1)
            this.utilService.router.navigateByUrl(ENV.nav.urls.account)
          },
          error:(error)=>{
            if(!errorMsgShown){
              this.baseService.openSystemError()
              errorMsgShown =true
            }
          }
        }),
        this.baseService.closeOverlayLoading
      )

  }
  signOutViaFirebase =()=>{
    return from(this.firebaseService.auth.signOut())
    .pipe(
      tap({
        next:()=>{
          this.utilService.router.navigateByUrl(ENV.nav.urls.home)
          this.users.pop()
          this.currentUser = null
          this.baseService.generateWMLNote("AccountsService.wmlNotify.loggedOutSuccess")
        },
        error:()=>{
          this.baseService.generateWMLNote("AccountsService.wmlNotify.loggedOutError")
        }
      })
    )

  }
  onAuthStateChangedEvent = new ReplaySubject<void>(Infinity)
  manageUsersLoginInfo = ()=>{
    onAuthStateChanged(this.firebaseService.auth, (user) => {

      if (user) {
        this.users.push(
          new AccountsServiceUser({
            user
          })
        )
        this.currentUser = this.users.at(-1)
        this.listUsers(new ListUsersUIRequestBody({
          // @ts-ignore
          accessToken:user.stsTokenManager.accessToken,
          type:ListUsersUIRequestBodyTypeEnum.GETPROFILE,
          filter:[
            {key:"reference_id",value:this.currentUser.sqaureReferenceId}
          ]
        }))
        .pipe(
          tap((res:ListUsersUIResponseBody)=>{
            this.currentUser.address = res.data[0].address
            this.onAuthStateChangedEvent.next()
          }),
        )
        .subscribe()

      }
      else{
        this.users = []
        this.currentUser = this.users.at(-1)
        this.onAuthStateChangedEvent.next()
      }



    });
  }

  ensureSquareCustomerIdIsAvailable = ()=>{
    if(this.currentUser.sqaureCustomerId){
      return of({
        customerId:this.currentUser.sqaureCustomerId,
      })
    }
    else{
      return this.getSquareCustomerIDVIAFirebaseID({accessToken:this.currentUser.accessToken})
      .pipe(
        map((result:GetSquareCustomerIDVIAFirebaseIDUIResponseBody)=>{
          this.currentUser.sqaureCustomerId = result.squareCustomerId
          return{
            customerId:result.squareCustomerId,
          }
        })
      )

    }
  }

  createUserInAPI = (uiBody:CreateUserInAPIUIRequestBody,raw = false)=>{

    return iif(
    ()=>ENV.accountsService.createUserInAPI.automate,
      of(new CreateUserInAPIUIResponseBody()),

      createUserInAPILoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
            .post(ENV.accountsService.createUserInAPI.url(),apiBody)
            .pipe(raw ? tap() : map(createUserInAPISuccess))
        })
      )
    )
  }

  getSquareCustomerIDVIAFirebaseID = (uiBody:GetSquareCustomerIDVIAFirebaseIDUIRequestBody,raw = false)=>{

    return iif(
    ()=>ENV.accountsService.getSquareCustomerIDVIAFirebaseID.automate,
      of(new GetSquareCustomerIDVIAFirebaseIDUIResponseBody()),

      getSquareCustomerIDVIAFirebaseIDLoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
            .post(ENV.accountsService.getSquareCustomerIDVIAFirebaseID.url(),apiBody)
            .pipe(raw ? tap() : map(getSquareCustomerIDVIAFirebaseIDSuccess))
        })
      )
    )
  }

  listUsers = (uiBody:ListUsersUIRequestBody,raw = false)=>{

    return iif(
    ()=>ENV.accountsService.listUsers.automate,
      of(new ListUsersUIResponseBody()),

      listUsersLoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
            .post(ENV.accountsService.listUsers.url(),apiBody)
            .pipe(raw ? tap() : map(listUsersSuccess))
        })
      )
    )
  }

  deleteUser = (uiBody:DeleteUserUIRequestBody,raw =false)=>{
    return iif(
      ()=>ENV.accountsService.deleteUser.automate,
      of(new DeleteUserUIResponseBody()),
      deleteUserLoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
              .post(ENV.accountsService.deleteUser.url(),apiBody)
              .pipe(raw ? tap() : map(deleteUserSuccess))
          })
        )
      )
  }

  exportUsers = (uiBody:ExportUsersUIRequestBody,raw =false)=>{
    return iif(
      ()=>ENV.accountsService.exportUsers.automate,
      of(new ExportUsersUIResponseBody()),
      exportUsersLoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
              .post(ENV.accountsService.exportUsers.url(),apiBody)
              .pipe(raw ? tap() : map(exportUsersSuccess))
          })
        )
      )
  }

  addCardToUser = (uiBody:AddCardToUserUIRequestBody,raw = false)=>{

    return iif(
    ()=>ENV.accountsService.addCardToUser.automate,
      of(new AddCardToUserUIResponseBody()),

      addCardToUserLoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
            .put(ENV.accountsService.addCardToUser.url(),apiBody)
            .pipe(raw ? tap() : map(addCardToUserSuccess))
        })
      )
    )
  }

  updateAddress = (uiBody:UpdateAddressUIRequestBody,raw =false)=>{

    return iif(
      ()=>ENV.accountsService.updateAddress.automate,
      of(new UpdateAddressUIResponseBody()),
      updateAddressLoad(uiBody,this.currentUser.sqaureCustomerId,this.currentUser.accessToken)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
              .put(ENV.accountsService.updateAddress.url(),apiBody)
              .pipe(raw ? tap() : map(updateAddressSuccess))
          })
        )
      )
  }

  listCards = (uiBody = new ListCardsUIRequestBody(),raw = false)=>{


    return iif(
    ()=>ENV.accountsService.listCards.automate,
      of(new ListCardsUIResponseBody()),

      listCardsLoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
            .post(ENV.accountsService.listCards.url(),apiBody)
            .pipe(raw ? tap() : map(listCardsSuccess))
        })
      )
    )
  }

  deleteCards = (uiBody:DeleteCardsUIRequestBody,raw = false)=>{

    return iif(
    ()=>ENV.accountsService.deleteCards.automate,
      of(new DeleteCardsUIResponseBody()),

      deleteCardsLoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
            .delete(ENV.accountsService.deleteCards.url(),{body:apiBody})
            .pipe(raw ? tap() : map(deleteCardsSuccess))
        })
      )
    )
  }









}


export class AccountsServiceUser {
  constructor(params:Partial<AccountsServiceUser>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  user:User
  sqaureCustomerId = null
  rewardsPoints = 0
  courseTier = "Basic"
  completedCourses= []
  startedCourses = []
  orders = []
  businessProjects = []
  subscriptions = []
  paymentMethods:ListCardsUIResponseBody["data"][number] = []
  address?:ListUsersUIResponseBody["data"][number]["address"]
  get id(){
    return this.user.uid
  }
  get accessToken(){
    // @ts-ignore
    return this.user.stsTokenManager.accessToken
  }
  get sqaureReferenceId(){
    return this.id + "_" + ENV.type
  }
  get profileUrl (){
    return new WMLImage({
      src:this.user.photoURL,
      alt:"AccountsService.profileURLAlt"
    })
  }
  get userName(){
    return this.user.displayName
  }
  get email(){
    return this.user.email ?? "global.na"
  }
  get phone(){
    return this.user.phoneNumber ?? "global.na"
  }
  get accountCreationDate(){
    let {creationTime} =this.user.metadata

    return  this.formateDate0(creationTime);
  }
  get lastSignInDate(){
    let {lastSignInTime} = this.user.metadata
    return  this.formateDate0(lastSignInTime);
  }
  private formateDate0(creationTime: string) {
    let date = new Date(creationTime);
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let year = date.getFullYear();
    let formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  }




}
