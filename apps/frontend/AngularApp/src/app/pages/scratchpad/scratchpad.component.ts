// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding   } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc


import { SharedModule } from '@shared/shared.module';

import {  WMLImage, generateClassPrefix } from '@windmillcode/angular-wml-components-base';
import { HttpClient } from '@angular/common/http';

import { WmlButtonZeroParams,WMLButtonParamsTypeEnum} from '@windmillcode/angular-wml-button-zero';
import { AdsZeroParams } from '@shared/components/ads-zero/ads-zero.component';



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
    public baseService:BaseService
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
  ads0  = new WMLImage({
    src:"assets/media/scratchpad/skin1.png",
    click:()=>{
      window.open("https://www.medscape.com/public/medscapeapp")
    }
  })
  mechImgs = Array(5)
  .fill(null)
  .map((nullVal,index0)=>{
    let src= `assets/media/scratchpad/skin${index0+1}.jpg`
    if(index0 === 4){
      src = `assets/media/scratchpad/skin${index0+1}.png`
    }
    return new WMLImage({
      src
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






