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
import { WMLCustomComponent, WMLImage, WMLUIProperty } from '@windmillcode/wml-components-base';
import { WMLOptionItemParams, WMLOptionsParams } from '@windmillcode/wml-options';
import { FormsService } from '@shared/services/forms/forms.service';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { WMLForm, WMLFormFieldsUpdateSubjParams } from '@windmillcode/wml-form';
import { GetProfileTypeQuestionsUIResponseBody, UserService } from '@shared/services/user/user.service';
import { ButtonOneParams } from '@shared/components/button-one/button-one.component';
import { WmlNotifyBarType } from '@windmillcode/wml-notify';
import { OptionOneComponent, OptionOneParams } from '@shared/components/option-one/option-one.component';



@Component({
  selector: 'questionaire-one-main',
  templateUrl: './questionaire-one-main.component.html',
  styleUrls: ['./questionaire-one-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class QuestionaireOneMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public formsService:FormsService,
    public userService:UserService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('QuestionaireOneMain')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  backdropImg = new WMLImage({
    src:"assets/media/questionaireOneMain/backdrop.jpg",
    alt:"QuestionaireOneMain.backdropImgAlt"
  })

  optionFields = []

  fields = []
  wmlForm:WMLForm = new WMLForm({
    fields: []
  })

  clickSubmitBtn = ()=>{
    let {mainForm}= this.formsService.questionaireOneMain
    if(!mainForm.valid){
      this.baseService.tellUserToFillOutRequiredFields(
        mainForm,this.cdref
      )
      return
    }

    this.baseService.openOverlayLoading()
    this.userService.saveProfileTypeAnswers(mainForm.value as any)
      .pipe(
        takeUntil(this.ngUnsub),
        this.baseService.closeOverlayLoading,
        tap({
          next:()=>{
            this.baseService.generateWMLNote("global.formSubmitSuccess")
          },
          error:()=>{
            this.baseService.generateWMLNote("global.systemError",WmlNotifyBarType.Error)
          }
        })
      )
      .subscribe()

  }
  submitBtn = new ButtonOneParams({
    text:new WMLUIProperty({
      text:"global.submiBtn"
    }),
    button:new WMLUIProperty({
      click:this.clickSubmitBtn
    })
  })

  initForm = ()=>{
    this.baseService.openOverlayLoading()
    this.userService.getProfileTypeQuestions()
    .pipe(
      takeUntil(this.ngUnsub),
      this.baseService.closeOverlayLoading,
      tap((res:GetProfileTypeQuestionsUIResponseBody)=>{

        this.initOptionFields(res);
        this.fields = this.optionFields
        this.wmlForm.fieldsUpdateSubj.next(new WMLFormFieldsUpdateSubjParams({
          fields:this.fields
        }))
      })
    )
    .subscribe()



  }


  initOptionFields(res: GetProfileTypeQuestionsUIResponseBody) {
    this.optionFields = res.questions.map((question, index0) => {
      // @ts-ignore
      this.formsService.questionaireOneMain.mainForm.addControl(question.id, new FormArray([],Validators.required));

      ENV.questionaireOneMain.mainForm[question.id + "FormControlName"] = question.id;
      let options = new WMLOptionsParams({
        limit: 1,
        options: question.options
          .map((value, index0) => {
            return new WMLOptionItemParams({
              text: value.text,
              value: value.id,
              customCpnt:new WMLCustomComponent({
                cpnt:OptionOneComponent,
                params:new OptionOneParams()
              })
            });
          }),
        formArray: this.formsService.questionaireOneMain.mainForm.controls[question.id] as unknown as FormArray,
        updateFormArrayPredicate: (option) => option.value
      });
      let field = this.baseService.generateOptionsFormField(
        question.label,
        ENV.questionaireOneMain.mainForm[question.id + "FormControlName"],
        this.formsService.questionaireOneMain.mainForm,
        // null,
        {
          required:"global.errorRequired"
        },
        "standalone",
        options
      );

      return field;
    });
  }

  ngOnInit(): void {
    this.checkForUserId();

  }

  checkForUserId() {
    let {mainForm} = this.formsService.questionaireOneMain
    if (mainForm.value[ENV.questionaireOneMain.mainForm.cognitoUserIdFormControlName] === '') {
      this.utilService.router.navigateByUrl(ENV.nav.urls.home);
    }
    else{
      this.initForm()
    }
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




