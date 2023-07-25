// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc


import { SharedModule } from '@shared/shared.module';
export enum SITE_OFFLINE_ENUM {
  TRUE,FALSE
}

@Component({
  standalone:true,
  imports:[
    SharedModule
  ],
  selector: 'site-offline',
  templateUrl: './site-offline.component.html',
  styleUrls: ['./site-offline.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class SiteOfflineComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,

    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('SiteOffline')



  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




