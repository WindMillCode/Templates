// angular
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { catchError, merge, Subject, takeUntil, tap } from 'rxjs';

// services
import { BaseService } from '@core/base/base.service';

// misc
import { ENV,environment as env } from '@env/environment';
import {  UtilityService } from '@core/utility/utility.service';


// wml-components
import { HttpClient } from '@angular/common/http';
import { WmlNotifyService } from '@windmillcode/angular-wml-notify';
import { toggleDarkMode } from '@core/utility/common-utils';
import { SITE_OFFLINE_ENUM } from '@core/site-offline/site-offline.component';
import { NavService } from '@shared/services/nav/nav.service';
import { StoreService } from '@shared/services/store/store.service';
import { AccountsService } from '@shared/services/accounts/accounts.service';
import { generateClassPrefix } from '@windmillcode/angular-wml-components-base';
import { restoreOriginalConsoleObject } from '@core/utility/env-utils';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  constructor(
    public baseService: BaseService,
    public utilService: UtilityService,
    public cdref: ChangeDetectorRef,
    public vcf: ViewContainerRef,
    public router:Router,
    public http:HttpClient,
    public wmlNotifyService:WmlNotifyService,
    public navService:NavService,
    public storeService:StoreService,
    public accountsService:AccountsService
  ) {
    this.listenForChangesOutSideChangeDetection().subscribe()
  }

  classPrefix = generateClassPrefix(ENV.classPrefix.app)
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub = new Subject<void>()


  listenForChangesOutSideChangeDetection = ()=>{
    return merge(
      this.baseService.togglePopupSubj,
      this.baseService.toggleOverlayLoadingSubj,
    )
    .pipe(
      takeUntil(this.ngUnsub),
      tap(()=>{
        this.cdref.detectChanges()
      })
    )

  }

  ngOnInit() {
    this.doMiscConfigs()
    toggleDarkMode(true)
    .pipe(
      takeUntil(this.ngUnsub),
    )
    .subscribe()
    this.accountsService.manageUsersLoginInfo()
  }

  ngAfterViewInit (){
    restoreOriginalConsoleObject()
    this.cdref.detectChanges()
  }

  doMiscConfigs() {
    if (env.production) {
      this.vcf.element.nativeElement.removeAttribute("ng-version");
    }


    if(ENV.app.siteOffline === SITE_OFFLINE_ENUM.TRUE){
      this.router.navigateByUrl(ENV.nav.urls.siteOffline)
      return
    }
    else if(window.location.pathname === ENV.nav.urls.siteOffline){
      this.router.navigateByUrl(ENV.nav.urls.home)
    }

    this.baseService.appCdRef = this.cdref
    ENV.nav.urls.initialURL = window.location.pathname
    this.http.get(ENV.app.backendHealthCheck())
    .pipe(
      takeUntil(this.ngUnsub),
      tap({
        error:()=>{
          if(ENV.type !== "dev"){
            this.router.navigateByUrl(ENV.nav.urls.siteOffline)
          }
        }
      })
    )
    .subscribe()


  }

  ngOnDestroy() {
    this.ngUnsub.next()
    this.ngUnsub.complete()
  }

}
