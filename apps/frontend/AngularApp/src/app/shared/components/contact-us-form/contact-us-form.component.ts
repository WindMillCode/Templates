// angular
import { ChangeDetectorRef, Component, HostBinding   } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService, BaseServiceSubmitFormParams } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc

import { ENV } from '@env/environment';
import { WMLForm } from '@windmillcode/angular-wml-form';
import { FormsService } from '@shared/services/forms/forms.service';
import { CSSVARS } from '@core/utility/common-utils';
import { WMLUIProperty } from '@windmillcode/angular-wml-components-base';
import { WmlButtonZeroParams,WMLButtonParamsTypeEnum} from '@windmillcode/angular-wml-button-zero';

import { ContactService } from '@shared/services/contact/contact.service';
import { useFormControlNamesAsFieldVariableNames } from '@core/utility/form-utils';



@Component({

  selector: 'contact-us-form',
  templateUrl: './contact-us-form.component.html',
  styleUrls: ['./contact-us-form.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush



})
export class ContactUsFormComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public baseService:BaseService,
    public formsService:FormsService,
    public contactService:ContactService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('ContactUsForm')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()


  mainForm:WMLForm
  formVars = ENV.contactUsForm.mainForm
  fields =useFormControlNamesAsFieldVariableNames(ENV.contactUsForm.mainForm)
  .map((val,index0)=>{
    let myGenerator = index0 < 4 ? this.baseService.createInputFormField : this.baseService.createTextAreaFormField
    let field = myGenerator({
      labelValue:"ContactUsForm.mainForm."+val+".label",
      fieldFormControlName:this.formVars[val.split("Field")[0]+"FormControlName"],
      fieldParentForm:this.formsService.contactUsForm.mainForm,
      selfType:"standalone",
      errorMsgs:{
        required:"ContactUsForm.mainForm."+val+".error.required",
        extension:"ContactUsForm.mainForm."+val+".error.extension",
        email:"ContactUsForm.mainForm."+val+".error.email"
      }

    });
    if(![2,4].includes(index0)){
      field.deleteRequiredLabelPart()
    }
    return field
  })

  submitBtnClick = ()=>{
    this.baseService.submitForm(new BaseServiceSubmitFormParams({
      rootFormGroup:this.formsService.contactUsForm.mainForm,
      cdref:this.cdref,
      validFormPredicateTypeDefault:{
        ngUnsub:this.ngUnsub,
        // @ts-ignore
        apiCall$:this.contactService.submitNewClient(this.formsService.contactUsForm.mainForm.value)
      }
    }))
  }

  submitBtn = new WmlButtonZeroParams({
    type:WMLButtonParamsTypeEnum.SECONDARY,
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



  initForm = ()=>{

    this.mainForm = new WMLForm({
      fields:this.fields,
      fieldSections:[2,2,1]
    })
  }
  ngOnInit(): void {
    this.initForm()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


