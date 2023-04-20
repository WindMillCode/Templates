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
import { FormArray } from '@angular/forms';
import { CSSVARS } from '@core/utility/common-utils';
import { WMLAPIError, WMLUIProperty } from '@windmillcode/wml-components-base';
import { WMLField } from '@windmillcode/wml-field';
import { WMLForm } from '@windmillcode/wml-form';
import { ButtonOneParams } from '../button-one/button-one.component';
import { FileUploadParams, FileUploadParamsPodTypeEnum } from '../file-upload/file-upload.component';
import { FormsService } from '@shared/services/forms/forms.service';
import { WmlNotifyBarType } from '@windmillcode/wml-notify';
import { ResumeService } from '@shared/services/resume/resume.service';
import { SpecificService } from '@core/specific/specific.service';
import { WmlInputParams } from '@windmillcode/wml-input';



@Component({

  selector: 'candidacy-info-form',
  templateUrl: './candidacy-info-form.component.html',
  styleUrls: ['./candidacy-info-form.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class CandidacyInfoFormComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public specificService:SpecificService,
    public formsService:FormsService,
    public resumeService:ResumeService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('CandidacyInfoForm')


  @Input('params') params: CandidacyInfoFormParams = new CandidacyInfoFormParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  formVars = ENV.candidacyInfoForm.mainForm
  resumeUpload = new FileUploadParams({
    limit:1,
    border:new WMLUIProperty({
      type:FileUploadParamsPodTypeEnum.SECONDARY
    }),
    title:new WMLUIProperty({
      text:"CandidacyInfoForm.resumeUpload.title"
    }),
    button: new ButtonOneParams({
      text:new WMLUIProperty({
        text:"CandidacyInfoForm.resumeUpload.button"
      })
    }),
    subText:new WMLUIProperty({
      text:"CandidacyInfoForm.resumeUpload.subText"
    }),
    uploadAllowedPredicate : (file, fileList)=> {
      return true
    },
    afterUploadPredicate:()=>{

      if(this.resumeUpload.files.length> this.resumeUpload.limit){
        let amntToRemove = this.resumeUpload.files.length - this.resumeUpload.limit
        for (let index = 0; index < amntToRemove; index++) {
          this.resumeUpload.files.shift()
        }
      }
      return this.resumeUpload.files
    },
    formArray:this.formsService.candidacyInfoForm.mainForm.controls[this.formVars.resumeFormControlName] as unknown as FormArray
  })
  resumeUploadField = this.specificService.generateCandidacyInfoFileFormField({
    fieldFormControlName:this.formVars.resumeFormControlName,
    fieldParentForm:this.formsService.candidacyInfoForm.mainForm,
    fieldCustomParams:this.resumeUpload,
    errorMsgs:{
      required:"CandidacyInfoForm.uploadForm.resumeUploadField.error.required",
      extension:"CandidacyInfoForm.uploadForm.resumeUploadField.error.extension"
    }
  })
  resumeForm:WMLForm

  companyField = this.baseService.generateInputFormField({
    labelValue:"CandidacyInfoForm.uploadForm.companyField.label",
    fieldFormControlName:this.formVars.companyFormControlName,
    fieldParentForm:this.formsService.candidacyInfoForm.mainForm,
    selfType:"standalone",
    fieldCustomParams:new WmlInputParams({
      input:{
        placeholder:"CandidacyInfoForm.uploadForm.companyField.placeholder"
      }
    })

  });
  jobDescField = this.baseService.generateTextAreaFormField({
    labelValue:"CandidacyInfoForm.uploadForm.jobDescField.label",
    fieldFormControlName:this.formVars.jobDescFormControlName,
    fieldParentForm:this.formsService.candidacyInfoForm.mainForm,
    errorMsgs:{
      required:"CandidacyInfoForm.uploadForm.jobDescField.error.required"
    },
    selfType:"standalone",
    fieldCustomParams:new WmlInputParams({
      textarea:{
        placeholder:"CandidacyInfoForm.uploadForm.jobDescField.placeholder"
      }
    })
  });
  wmlForm:WMLForm

  initForm = ()=>{
    this.resumeUploadField.deleteLabel()
    this.resumeForm = new WMLForm({
      fields:[this.resumeUploadField]
    })
    this.companyField.deleteRequiredLabelPart()
    this.wmlForm = new WMLForm({
      fields:[
        this.companyField,this.jobDescField
      ]
    })
  }

  submitBtnClick = ()=>{
    if(!this.formsService.candidacyInfoForm.mainForm.valid){
      this.baseService.tellUserToFillOutRequiredFields(
        this.formsService.candidacyInfoForm.mainForm,this.cdref
      )
      return
    }
    this.baseService.openOverlayLoading()
    let result =this.specificService.endUseAfterFreeTrial(true)
    if(result instanceof WMLAPIError){
      this.baseService.toggleOverlayLoadingSubj.next(false)
      return
    }
    // @ts-ignore
    this.resumeService.submitFormToAnalyzeResume(this.formsService.candidacyInfoForm.mainForm.value)
    .pipe(
      takeUntil(this.ngUnsub),
      tap({
        next:(res)=>{
          this.specificService.endUseAfterFreeTrial(false)
          // @ts-ignore
          this.resumeService.submitFormToAnalyzeResumeSubj.next(res)
          this.baseService.generateWMLNote("global.formSubmitSuccess",WmlNotifyBarType.Success,true)
          this.baseService.resetFormControls(this.formsService.candidacyInfoForm.mainForm)
          this.utilService.router.navigateByUrl(ENV.nav.urls.sample)
        },
        error:()=>{
          this.baseService.generateWMLNote("global.systemError",WmlNotifyBarType.Error)
        }
      }),
      this.baseService.closeOverlayLoading,

    )
    .subscribe()

  }

  submitBtn = new ButtonOneParams({
    text:new WMLUIProperty({
      text:"global.submiBtn",
      style:{
        textAlign:"center",
        margin:"0",
        padding:"0 "+CSSVARS.spacing9
      }
    }),
    button:new WMLUIProperty({
      click:this.submitBtnClick
    })
  })

  ngOnInit(): void {
    this.initForm()
    this.resumeUpload = this.params.resumeUpload ?? this.resumeUpload
    this.companyField = this.params.companyField ?? this.companyField
    this.jobDescField = this.params.jobDescField ?? this.jobDescField
    this.submitBtn = this.params.submitBtn ?? this.submitBtn
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class CandidacyInfoFormParams {
  constructor(params:Partial<CandidacyInfoFormParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  resumeNotRequiredIsPresent = false
  resumeUpload:FileUploadParams
  companyField:WMLField
  jobDescField:WMLField
  submitBtn:ButtonOneParams
}


