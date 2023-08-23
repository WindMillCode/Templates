
// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding   } from '@angular/core';
// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject, takeUntil, tap } from 'rxjs';

// misc

import { toggleDarkMode } from '@core/utility/common-utils';
import { NavService } from '@shared/services/nav/nav.service';
import { WMLUIProperty, generateClassPrefix } from '@windmillcode/angular-wml-components-base';
import { WmlButtonOneParams } from '@windmillcode/angular-wml-button-zero';
import {AccountsService} from '@shared/services/accounts/accounts.service'
import { ENV } from '@env/environment';


@Component({

  selector: 'nav-zero',
  templateUrl: './nav-zero.component.html',
  styleUrls: ['./nav-zero.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush



})
export class NavZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public baseService:BaseService,
    public navService:NavService,
    public accountsService:AccountsService
  ) { }

  classPrefix = generateClassPrefix('NavZero')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  darkMode = "NavZero.lightMode"
  ENV = ENV
  signUpBtn = new WmlButtonOneParams({
    id:ENV.idPrefix.nav+ 'signUpBtn',
    text:"AccountsService.signUp0",
    click:()=>{
      this.utilService.router.navigateByUrl(ENV.nav.urls.signUp)
    }
  })
  loginBtn = new WmlButtonOneParams({
    id:ENV.idPrefix.nav+ 'loginBtn',
    text:"AccountsService.login0",
    click:()=>{
      this.utilService.router.navigateByUrl(ENV.nav.urls.signIn)
    }
  })
  logoutBtn = new WmlButtonOneParams({
    id:ENV.idPrefix.nav+ 'profileBtn',
    text:"AccountsService.logout0",
    isPresent:false,
    click:()=>{
      this.accountsService.signOutViaFirebase().subscribe()
    }
  })
  profileBtn = new WmlButtonOneParams({
    id:ENV.idPrefix.nav+ 'logoutBtn',
    text:"AccountsService.profileBtn0",
    isPresent:false,
    click:()=>{
      this.utilService.router.navigateByUrl(ENV.nav.urls.account)
    }
  })


  // @ts-ignore
  toggleDarkMode(init=false,colorMode?):typeof toggleDarkMode{
    this.darkMode =  toggleDarkMode(init,colorMode) ?  "NavZero.darkMode"  : "NavZero.lightMode"
  }

  listenForAuthEvent =()=>{
    return this.accountsService.onAuthStateChangedEvent
    .pipe(
      takeUntil(this.ngUnsub),
      tap(()=>{
        if(this.accountsService.users.length > 0){
          this.signUpBtn.isPresent = false
          this.loginBtn.isPresent = false
          this.logoutBtn.isPresent = true
          this.profileBtn.isPresent = true
        }
        else{
          this.signUpBtn.isPresent = true
          this.loginBtn.isPresent = true
          this.logoutBtn.isPresent = false
          this.profileBtn.isPresent = false
        }
        this.cdref.detectChanges()
      })
    )

  }

  ngOnInit(): void {
    this.toggleDarkMode(true,"dark")
    this.listenForAuthEvent().subscribe()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}





