import { ChangeDetectorRef, Injectable, Type } from '@angular/core';
import { delay, finalize, Subject, tap } from 'rxjs';

// services

// reactive forms
import { FormArray, FormControl, FormGroup } from '@angular/forms';

// wml components
import { CustomLabelComponent } from '@shared/components/custom-label/custom-label.component';
import { WmlLabelParams, WMLField } from '@windmillcode/wml-field';
import { WmlInputComponent, WmlInputParams } from '@windmillcode/wml-input';
import { WmlPopupComponentParams } from '@windmillcode/wml-popup';
import { WmlNotifyBarModel, WmlNotifyBarType, WmlNotifyService } from '@windmillcode/wml-notify';
import { NotifyBannerComponent, NotifyBannerParams } from '@shared/components/notify-banner/notify-banner.component';
import { WMLButton, WMLCustomComponent, WMLUIProperty } from '@windmillcode/wml-components-base';
import { WMLOptionItemParams, WmlOptionsComponent, WMLOptionsParams } from '@windmillcode/wml-options';
import { WMLChipsParams, WmlChipsComponent } from '@windmillcode/wml-chips';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private utilService:UtilityService,
    public wmlNotifyService:WmlNotifyService,
    public notifyService:WmlNotifyService
  ) { }

  appCdRef!:ChangeDetectorRef
  // @ts-ignore
  toggleOverlayLoadingSubj:Subject<boolean> =new Subject<boolean>()
  toggleOverlayLoadingSubj$ = this.toggleOverlayLoadingSubj.asObservable()
  .pipe(
    delay(300),
    tap((val)=> {
      this.appCdRef.detectChanges()
    })
  )

  updateOverlayLoadingText:string = "global.overlayLoading"
  closeOverlayLoading = finalize(()=>{
    this.toggleOverlayLoadingSubj.next(false)
  })
  openOverlayLoading = ()=>{
    this.toggleOverlayLoadingSubj.next(true)
  }

  toggleMobileNavSubj = new Subject<boolean>()
  togglePopupSubj =new Subject<boolean>()

  popupParams= new WmlPopupComponentParams({})
  openPopup =(params:WMLCustomComponent)=>{

    this.popupParams.cpnt = params.cpnt
    this.popupParams.params = params.params ?? {}
    this.togglePopupSubj.next(true)
  }
  closePopup = ()=>{
    this.togglePopupSubj.next(false)
  }

  generateWMLNote = (i18nKey:string ="Success",type:WmlNotifyBarType=WmlNotifyBarType.Success,autoHide=false,autoOpen=true )=>{
    type = type ?? WmlNotifyBarType.Success
    let note =new WmlNotifyBarModel({
      type,
      autoHide,
      msgtype:"custom",
      custom:new WMLCustomComponent({
        cpnt:NotifyBannerComponent,
        meta:new NotifyBannerParams({
          i18nKey
        })
      })
    })
    if(autoOpen){
      this.wmlNotifyService.create(note)
    }
    return  note
  }

  generateInputFormField=(params:{
    labelValue?:string,
    fieldFormControlName,
    fieldParentForm:FormGroup,
    errorMsgs?:WmlLabelParams["errorMsgs"],
    selfType?:WMLField["self"]["type"],
    fieldCustomParams?:WmlInputParams
  })=>{
      let {
        labelValue,
        fieldFormControlName,
        fieldParentForm,
        errorMsgs,
        selfType,
        fieldCustomParams
      } = params
    let wmlField
    wmlField = new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        fieldCustomCpnt:WmlInputComponent,
        fieldCustomMeta:new WmlInputParams({
          ...fieldCustomParams,
          wmlField,
        }),
        errorMsgs: errorMsgs ?? {
          required:"global.errorRequired"
        }
      }
    })


    return this.generateFormField(wmlField)
  }


  generateTextAreaFormField=(params:{
    labelValue:string,
    fieldFormControlName,
    fieldParentForm,
    errorMsgs?:WmlLabelParams["errorMsgs"],
    selfType?:WMLField["self"]["type"],
    fieldCustomParams?:WmlInputParams
  })=>{
    let {
      labelValue,
      fieldFormControlName,
      fieldParentForm,
      errorMsgs,
      selfType,
      fieldCustomParams
    } = params
    let wmlField
    wmlField =  new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        fieldCustomCpnt:WmlInputComponent,
        errorMsgs:errorMsgs??{
          required:"global.errorRequired"
        },
        fieldCustomMeta:new WmlInputParams({
          ...fieldCustomParams,
          wmlField,
          type:"textarea"
        })
      }
    })
    return this.generateFormField(wmlField)
  }

  generateRangeFormField=(labelValue:string,fieldFormControlName,fieldParentForm,errorMsgs?:WmlLabelParams["errorMsgs"],selfType?:WMLField["self"]["type"])=>{
    let wmlField
    wmlField =      new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"global.errorRequired"
        },
        fieldCustomCpnt:WmlInputComponent,
        fieldCustomMeta:new WmlInputParams({
          wmlField,
          type:"range"
        })
      }
    })
    return this.generateFormField(wmlField)
  }

  generateCheckboxFormField=(labelValue:string,fieldFormControlName,fieldParentForm,errorMsgs?:WmlLabelParams["errorMsgs"],selfType?:WMLField["self"]["type"],checkboxDesc?:string)=>{
    let wmlField
    wmlField = new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"global.errorRequired"
        },
        fieldCustomMeta:new WmlInputParams({
          wmlField,
          type:"checkbox",
          checkboxDesc
        })
      }
    })
    return this.generateFormField(wmlField)
  }

  generateOptionsFormField=(
    labelValue:string,
    fieldFormControlName,
    fieldParentForm,
    errorMsgs?:WmlLabelParams["errorMsgs"],
    selfType?:WMLField["self"]["type"],
    optionsParams?:WMLOptionsParams
    )=>{
    let wmlField
    wmlField = new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"global.errorRequired"
        },
        fieldCustomCpnt:WmlOptionsComponent,
        fieldCustomMeta:optionsParams ?? new WMLOptionsParams({
          options:[new WMLOptionItemParams({
            text:"use WMLOptionsParams from the wmloptions component and fill me w/ options"
          })]
        })
      }
    })
    return this.generateFormField(wmlField)
  }

  tellUserToFillOutRequiredFields = (rootFormGroup:FormGroup,cdref?:ChangeDetectorRef)=>{
    let fillOutFormNote =this.generateWMLNote("global.fillOutForm",WmlNotifyBarType.Error)
    this.wmlNotifyService.create(fillOutFormNote)
    this.validateAllFormFields(rootFormGroup)
    cdref?.detectChanges()
  }

  generateChipsFormField=(
    labelValue:string,
    fieldFormControlName,
    fieldParentForm,
    errorMsgs?:WmlLabelParams["errorMsgs"],
    selfType?:WMLField["self"]["type"],
    chipsParams:WMLChipsParams=new WMLChipsParams({})
    )=>{
    let wmlField
    chipsParams.placeholder = "global.wmlChipsplaceholder"
    chipsParams.userInputsAriaLabel = "global.wmlChipsuserInputsAriaLabel"
    chipsParams.removeChipAriaLabel = "wmlChipsremoveChipAriaLabel"
    wmlField = new WMLField({
      type: "custom",
      custom: {

        selfType: selfType ?? "standalone",
        fieldParentForm,
        fieldFormControlName,
        labelValue,
        errorMsgs:errorMsgs??{
          required:"global.errorRequired"
        },
        fieldCustomCpnt:WmlChipsComponent,
        fieldCustomMeta:chipsParams
      }
    })
    return this.generateFormField(wmlField)
  }

  generateFormField= (wmlField:WMLField)=>{
    wmlField.label.custom.cpnt = CustomLabelComponent
    wmlField.error.custom.cpnt = CustomLabelComponent
    return wmlField
  }


  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl || control instanceof FormArray) {
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity({ emitEvent: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }


  resetFormControls(formGroup: FormGroup | FormArray) {
    // Iterate through all the controls in the form group
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        // Recursively reset controls in nested FormGroup
        this.resetFormControls(control);
      } else if (control instanceof FormControl) {
        // Reset FormControl to its initial state
        control.reset();
      } else if (control instanceof FormArray) {
        // Reset FormArray to its initial state
        control.clear();
      }
    });
  }



}


export class GenerateMobileNavBtnItemParams {
  constructor(params:Partial<GenerateMobileNavBtnItemParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  i18nKey!:WMLButton["value"]
  btnClick!:WMLButton["click"]
  btnClass:WMLButton["class"]
  btnIconIsPresent!:WMLButton["iconIsPresent"]
  btnIconSrc!:WMLButton["iconSrc"]
  btnIconAlt!:WMLButton["iconAlt"]
}
