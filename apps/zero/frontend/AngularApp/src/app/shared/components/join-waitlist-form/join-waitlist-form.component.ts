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
import { WMLForm } from '@windmillcode/wml-form';
import { FormsService } from '@shared/services/forms/forms.service';
import { ButtonOneParams, ButtonOneParamsTypeEnum } from '../button-one/button-one.component';
import { WMLCustomComponent, WMLUIProperty } from '@windmillcode/wml-components-base';
import { IntakeService, JoinWaitListUIResponseBody } from '@shared/services/intake/intake.service';
import { WmlNotifyBarType } from '@windmillcode/wml-notify';
import { CSSVARS } from '@core/utility/common-utils';
import { DecideToDoSurveyComponent, DecideToDoSurveyParams } from '../decide-to-do-survey/decide-to-do-survey.component';
import {  WmlInputParams } from '@windmillcode/wml-input';


@Component({

  selector: 'join-waitlist-form',
  templateUrl: './join-waitlist-form.component.html',
  styleUrls: ['./join-waitlist-form.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class JoinWaitlistFormComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public formsService:FormsService,
    public intakeService:IntakeService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('JoinWaitlistForm')


  @Input('params') params: JoinWaitlistFormParams = new JoinWaitlistFormParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  title= new WMLUIProperty({
    style:{
      fontSize:CSSVARS.displayXXSmall
    }
  })
  nameField = this.baseService.generateInputFormField({
    labelValue:"JoinWaitlistForm.mainForm.nameField.label",
    fieldFormControlName:ENV.joinWaitlistForm.mainForm.nameFormControlName,
    fieldParentForm:this.formsService.joinWaitlistForm.mainForm,
    errorMsgs:{
      required:"JoinWaitlistForm.mainForm.nameField.error.required"
    },
    selfType:"standalone",
    fieldCustomParams:new WmlInputParams({
      input:{
        placeholder:"JoinWaitlistForm.mainForm.nameField.label"
      }
    })
  })

  emailField = this.baseService.generateInputFormField({
    labelValue:"JoinWaitlistForm.mainForm.emailField.label",
    fieldFormControlName:ENV.joinWaitlistForm.mainForm.emailFormControlName,
    fieldParentForm:this.formsService.joinWaitlistForm.mainForm,
    errorMsgs:{
      email:"JoinWaitlistForm.mainForm.emailField.error.email"
    },
    fieldCustomParams:new WmlInputParams({
      input:{
        placeholder:"JoinWaitlistForm.mainForm.emailField.label"
      }
    }),
    selfType:"standalone"
  })

  phoneField = this.baseService.generateInputFormField({
    labelValue:"JoinWaitlistForm.mainForm.phoneField.label",
    fieldFormControlName:ENV.joinWaitlistForm.mainForm.phoneFormControlName,
    fieldParentForm:this.formsService.joinWaitlistForm.mainForm,
    selfType:"standalone"
  })

  mainForm = new WMLForm({
    fields:[
      this.nameField,this.emailField,
      // this.phoneField
    ]
  })

  initForm= ()=>{
    this.nameField.deleteLabel()
    this.emailField.deleteLabel()
    this.phoneField.deleteRequiredLabelPart()
  }
  clickSubmitBtn = ()=>{
    let {mainForm}= this.formsService.joinWaitlistForm
    if(!mainForm.valid){
      this.baseService.tellUserToFillOutRequiredFields(
        mainForm,this.cdref
      )
      return
    }
    this.baseService.openOverlayLoading()
    this.intakeService.joinWaitList(mainForm.value as any)
    .pipe(
      takeUntil(this.ngUnsub),
      this.baseService.closeOverlayLoading,
      tap({
        next:(res:JoinWaitListUIResponseBody)=>{
          this.baseService.generateWMLNote("global.formSubmitSuccess")
          this.baseService.closePopup()
          this.formsService.joinWaitlistForm.mainForm.reset()
          this.baseService.openPopup(new WMLCustomComponent({
            cpnt:DecideToDoSurveyComponent,
            params:new DecideToDoSurveyParams({})
          }))
          this.formsService.questionaireOneMain.mainForm.patchValue({
            [ENV.questionaireOneMain.mainForm.cognitoUserIdFormControlName]:res.cognitoUserId
          })
        },
        error:()=>{
          this.baseService.generateWMLNote("global.systemError",WmlNotifyBarType.Error)
        }
      }),
    )
    .subscribe()
  }
  submitBtn = new ButtonOneParams({
    type: ButtonOneParamsTypeEnum.SECONDARY,
    text:new WMLUIProperty({
      text:"global.submiBtn",

    }),
    button:new WMLUIProperty({
      click:this.clickSubmitBtn
    })
  })

  ngOnInitWasCalled= false
  ngOnInit(): void {
    if(this.ngOnInitWasCalled){
      return
    }
    this.ngOnInitWasCalled = true
    this.myClass += " " +this.params.view.class
    this.initForm()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class JoinWaitlistFormParams {
  constructor(params:Partial<JoinWaitlistFormParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  view = new WMLUIProperty()
}


