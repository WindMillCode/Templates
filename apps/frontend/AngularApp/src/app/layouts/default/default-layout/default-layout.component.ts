// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  } from '@angular/core';

// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';
import { AdsZeroParams, AdsZeroTypeParams } from '@shared/components/ads-zero/ads-zero.component';

import { WMLImage, generateClassPrefix } from '@windmillcode/angular-wml-components-base';


// rxjs
import { Subject } from 'rxjs';

// misc



@Component({
  selector: 'default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DefaultLayoutComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public baseService:BaseService
  ) { }

  classPrefix = generateClassPrefix('DefaultLayout')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  fullYear =  new Date().getFullYear();
  ad  = new AdsZeroParams({
    type:AdsZeroTypeParams.HORIZ,
  })

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




