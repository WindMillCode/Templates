// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding   } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc


import { SharedModule } from '@shared/shared.module';

import { WMLUIProperty, generateClassPrefix } from '@windmillcode/angular-wml-components-base';
import { HttpClient } from '@angular/common/http';
import { WmlInfiniteDropdownParams } from '@windmillcode/angular-wml-infinite-dropdown';
import { CSSVARS } from '@core/utility/common-utils';
import { NavService } from '@shared/services/nav/nav.service';
import { RatingCardParams } from '@shared/components/rating-card/rating-card.component';
import { RatingStarsParams } from '@shared/components/rating-stars/rating-stars.component';
import { WmlButtonZeroParams,WMLButtonParamsTypeEnum} from '@windmillcode/angular-wml-button-zero';



@Component({
  standalone:true,
  imports:[
    SharedModule,
  ],
  selector: 'scratchpad',
  templateUrl: './scratchpad.component.html',
  styleUrls: ['./scratchpad.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ScratchpadComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public http:HttpClient,
    public utilService:UtilityService,

    public baseService:BaseService,
    public navService:NavService
  ) { }

  classPrefix = generateClassPrefix('Scratchpad')


  btn = new WmlButtonZeroParams({
    type:WMLButtonParamsTypeEnum.PRIMARY
  })
  btn1 = new WmlButtonZeroParams({
    type:WMLButtonParamsTypeEnum.SECONDARY
  })
  btn2 = new WmlButtonZeroParams({
    type:WMLButtonParamsTypeEnum.TERTIARY
  })
  ratingCard = new RatingCardParams({
    rating:new RatingStarsParams({
      rating:2
    })
  })

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}






