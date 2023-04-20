// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc

import { ENV } from '@env/environment';
import { ButtonOneParams, ButtonOneParamsTypeEnum } from '../button-one/button-one.component';
import { WMLUIProperty } from '@windmillcode/wml-components-base';
import { CSSVARS } from '@core/utility/common-utils';



@Component({

  selector: 'decide-to-do-survey',
  templateUrl: './decide-to-do-survey.component.html',
  styleUrls: ['./decide-to-do-survey.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class DecideToDoSurveyComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('DecideToDoSurvey')


  @Input('params') params: DecideToDoSurveyParams = new DecideToDoSurveyParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  title= new WMLUIProperty({
    style:{
      fontSize:CSSVARS.displayXXSmall
    }
  })

  clickFinishBtn = ()=>{
    this.baseService.closePopup()
  }
  finishedBtn = new ButtonOneParams({
    type:ButtonOneParamsTypeEnum.SECONDARY,
    text:new WMLUIProperty({
      text:"DecideToDoSurvey.finishedBtn",

    }),
    button:new WMLUIProperty({
      click:this.clickFinishBtn
    })
  })

  clickFillOutSurveyBtn= ()=>{
    this.baseService.closePopup()
    this.utilService.router.navigateByUrl(ENV.nav.urls.profileTypeQuestionaire)
  }
  fillOutSurveyBtn = new ButtonOneParams({
    type:ButtonOneParamsTypeEnum.SECONDARY,
    text:new WMLUIProperty({
      text:"DecideToDoSurvey.fillOutSurveyBtn",
    }),
    button:new WMLUIProperty({
      click:this.clickFillOutSurveyBtn
    })
  })

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }



}



export class DecideToDoSurveyParams {
  constructor(params:Partial<DecideToDoSurveyParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}


