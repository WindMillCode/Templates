// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc

import { ENV } from '@env/environment';
import { ButtonOneParams, ButtonOneParamsTypeEnum } from '@shared/components/button-one/button-one.component';
import { WMLCustomComponent, WMLImage, WMLUIProperty } from '@windmillcode/wml-components-base';
import { StepperParams } from '@shared/components/stepper/stepper.component';
import { FileUploadParams, FileUploadParamsPodTypeEnum } from '@shared/components/file-upload/file-upload.component';
import { SectionsOneParams } from '@shared/components/sections-one/sections-one.component';
import  i18nTranslations from "src/assets/i18n/en.json";
import { RatingCarouselParams } from '@shared/components/rating-carousel/rating-carousel.component';
import { RatingCardParams } from '@shared/components/rating-card/rating-card.component';
import { Router } from '@angular/router';
import { SampleCpntComponent } from '@shared/components/sample-cpnt/sample-cpnt.component';
import { JoinWaitlistFormComponent, JoinWaitlistFormParams } from '@shared/components/join-waitlist-form/join-waitlist-form.component';
import { FormArray } from '@angular/forms';
import { FormsService } from '@shared/services/forms/forms.service';
import { WMLForm } from '@windmillcode/wml-form';
import { CSSVARS } from '@core/utility/common-utils';
import { DecideToDoSurveyComponent, DecideToDoSurveyParams } from '@shared/components/decide-to-do-survey/decide-to-do-survey.component';


@Component({

  selector: 'home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class HomeMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public router:Router,
    public formsService:FormsService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('HomeMain')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  navToSamplePage = ()=>{
    this.utilService.router.navigateByUrl(ENV.nav.urls.sample)
  }
  viewSampleBtn = new ButtonOneParams({
    text:new WMLUIProperty({
      text:"HomeMain.viewSampleBtn"
    }),
    button:new WMLUIProperty({
      click:this.navToSamplePage
    })
  })

  openJoinWaitlistPopup = ()=>{
    this.baseService.openPopup(new WMLCustomComponent({
      cpnt:JoinWaitlistFormComponent,
      params:new JoinWaitlistFormParams({
        view:new WMLUIProperty({
          class:"HomeMain"
        })
      })
    }))
  }
  freeTrialBtn = new ButtonOneParams({
    type:ButtonOneParamsTypeEnum.SECONDARY,
    text:new WMLUIProperty({
      text:"HomeMain.freeTrailBtn"
    }),
    button:new WMLUIProperty({
      click:this.openJoinWaitlistPopup,
    }),
    icon: [
      new WMLImage({
        class:"fa-arrow-right"
      })
    ]
  })
  primaryStepper = new StepperParams({
    multiline:Array(i18nTranslations.HomeMain.workSteps.length)
    .fill(null)
    .map((nullVal,index0)=>{
      return "HomeMain.workSteps."+index0
    })
  })

  descSections = new SectionsOneParams({
    multiline:Array(i18nTranslations.HomeMain.benefits.sections.length)
    .fill(null)
    .map((nullVal,index0)=>{
      return {
        title:new WMLUIProperty({
          text:"HomeMain.benefits.sections."+index0+".title"
        }),
        desc:[
          new WMLUIProperty({
            text:"HomeMain.benefits.sections."+index0+".desc"
          }),
        ]
      }
    })
  })
  mainCarousel = new RatingCarouselParams({
    cards:Array(3)
    .fill(null)
    .map((nullVal,index0)=>{
      return new RatingCardParams({
        title:new WMLUIProperty({
          text:["Alhouseny Camara","Ron","Kimbe Okala"][index0],
          // text:index0.toString()
        }),
        subTitle:new WMLUIProperty({
          text:"-Software Engineer,UVii"
        }),
        desc:new WMLUIProperty({
          text:`FindMyRole helped me get hired for my software engineer role at Uvii. It boosted my confidence and communication skills, leading to a successful interview and job offer. Highly recommend!`
        }),
        avatar:new WMLImage({
          src:"assets/media/homeMain/avatar.png",
          alt:"HomeMain.ratings.avatarAlt"
        }),
        rating:this.utilService.generateRandomNumber(5)
      })
    })
  })

  ngOnInit(): void {
    // this.openJoinWaitlistPopup()

  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




