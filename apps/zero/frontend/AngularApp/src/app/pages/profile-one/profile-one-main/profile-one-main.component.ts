// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { delay, takeUntil,tap } from 'rxjs/operators';

// misc

import { ENV } from '@env/environment';
import { SectionsTwoParams, SectionsTwoParamsPartsType, SectionsTwoParamsPartsTypeJobSummaryType } from '@shared/components/sections-two/sections-two.component';
import { WMLUIProperty } from '@windmillcode/wml-components-base';
import { ButtonOneParams, ButtonOneParamsTypeEnum } from '@shared/components/button-one/button-one.component';
import { FileUploadParams, FileUploadParamsPodTypeEnum } from '@shared/components/file-upload/file-upload.component';
import { CSSVARS } from '@core/utility/common-utils';
import { WMLForm } from '@windmillcode/wml-form';
import { WMLField } from '@windmillcode/wml-field';
import { FormsService } from '@shared/services/forms/forms.service';
import { FormArray } from '@angular/forms';
import { ResumeService } from '@shared/services/resume/resume.service';
import { WmlNotifyBarModel, WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { CandidacyInfoFormParams } from '@shared/components/candidacy-info-form/candidacy-info-form.component';



@Component({

  selector: 'profile-one-main',
  templateUrl: './profile-one-main.component.html',
  styleUrls: ['./profile-one-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class ProfileOneMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public formsService:FormsService,
    public resumeService:ResumeService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('ProfileOneMain')


  @Input('params') params: ProfileOneMainParams = new ProfileOneMainParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  lastAnalysisSection = new SectionsTwoParams({
    title:new WMLUIProperty({
      text:"ProfileOneMain.lastAnalysis.title"
    }),
    parts:[
      new WMLUIProperty({
        type:SectionsTwoParamsPartsType.JOB_SUMMARY,
        value:[
          new WMLUIProperty({
            text:"Job Role: Software Engineer @ NBA",
            type:SectionsTwoParamsPartsTypeJobSummaryType.HEADER
          }),
          ...[
            "3 generated questions",
            "3 generated answers",
            "3 questions to ask recruiters",
            "3 facts about company",
            "3 latest news about comapny"
          ]
          .map((text)=>{
            return new WMLUIProperty({
              text
            })
          })

        ]
      })
    ]

  })



  mabyeLaterBtn = new ButtonOneParams({
    type:ButtonOneParamsTypeEnum.TERTIARY,
    text:new WMLUIProperty({
      text:"ProfileOneMain.helpUs.mabyeLater"
    })
  })

  submitPersonalInfoBtn = new ButtonOneParams({
    type:ButtonOneParamsTypeEnum.SECONDARY,
    text:new WMLUIProperty({
      text:"ProfileOneMain.helpUs.submitPersonalInfo"
    })
  })

  candidacyInfoForm = new CandidacyInfoFormParams({
    resumeNotRequiredIsPresent:true
  })

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class ProfileOneMainParams {
  constructor(params:Partial<ProfileOneMainParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}


