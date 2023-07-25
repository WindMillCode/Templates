import { ChangeDetectorRef, Injectable } from '@angular/core';
import { debounceTime, delay, finalize, forkJoin, fromEvent, merge, Observable, of, Subject, takeUntil, tap } from 'rxjs';

// services

// reactive forms
import { FormArray, FormControl, FormGroup } from '@angular/forms';

// wml components

import {  WMLField } from '@windmillcode/angular-wml-field';
import { WmlInputComponent, WmlInputParams } from '@windmillcode/angular-wml-input';
import {  WMLPopupParams } from '@windmillcode/angular-wml-popup';
import { WmlNotifyBarModel, WmlNotifyBarType, WmlNotifyService } from '@windmillcode/angular-wml-notify';
import { WMLAPIError, WMLAPIPaginationRequestModel, WMLAPIPaginationResponseModel, WMLButton, WMLCustomComponent, generateRandomColor, selectRandomOptionFromArray } from '@windmillcode/angular-wml-components-base';
import { WMLOptionItemParams, WmlOptionsComponent, WMLOptionsParams } from '@windmillcode/angular-wml-options';
import { WMLChipsParams, WmlChipsComponent } from '@windmillcode/angular-wml-chips';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { GenerateFieldParams, generateFormField, resetFormControls } from '@core/utility/form-utils';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(
    private utilService:UtilityService,
    public wmlNotifyService:WmlNotifyService
  ) { }

  visitedLinks: string[] = [];
  appCdRef!:ChangeDetectorRef
  navToHome = ()=>{
    this.utilService.router.navigateByUrl(ENV.nav.urls.home)
  }
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
  popupParams= new WMLPopupParams({})

  openPopup =(params:WMLCustomComponent)=>{

    this.popupParams.cpnt = params.cpnt
    this.popupParams.params = params.params ?? {}
    this.togglePopupSubj.next(true)
  }
  closePopup = ()=>{
    this.togglePopupSubj.next(false)
  }


  openFeatureIsComingSoon = ()=>{
    this.generateWMLNote("global.comingSoon",WmlNotifyBarType.Info)
  }
  openSystemError = ()=>{
    this.generateWMLNote("global.systemError",WmlNotifyBarType.Error)
  }

  generateWMLNote = (i18nKey:string ="Success",type:WmlNotifyBarType=WmlNotifyBarType.Success,autoHide=false,autoOpen=true )=>{
    type = type ?? WmlNotifyBarType.Success
    let note =new WmlNotifyBarModel({
      type,
      autoHide,
      message:i18nKey
    })
    if(autoOpen){
      this.wmlNotifyService.create(note)
    }
    return  note
  }

  generateInputFormField=(params:GenerateFieldParams)=>{
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


    return generateFormField(wmlField)
  }

  generateTextAreaFormField=(params:GenerateFieldParams)=>{
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
    return generateFormField(wmlField)
  }

  generateRangeFormField=(params:GenerateFieldParams )=>{
    let {
      labelValue,
      fieldFormControlName,
      fieldParentForm,
      errorMsgs,
      selfType,
    } = params
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
        fieldCustomCpnt:WmlInputComponent,
        fieldCustomMeta:new WmlInputParams({
          wmlField,
          type:"range"
        })
      }
    })
    return generateFormField(wmlField)
  }

  generateCheckboxFormField=(params:GenerateFieldParams & {checkboxDesc?:string})=>{
    let {
      labelValue,
      fieldFormControlName,
      fieldParentForm,
      errorMsgs,
      selfType,
      checkboxDesc
    } = params
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
    return generateFormField(wmlField)
  }

  generateOptionsFormField=(params:GenerateFieldParams<WMLOptionsParams>)=>{
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
        errorMsgs:errorMsgs??{
          required:"global.errorRequired"
        },
        fieldCustomCpnt:WmlOptionsComponent,
        fieldCustomMeta:fieldCustomParams ?? new WMLOptionsParams({
          options:[new WMLOptionItemParams({
            text:"use WMLOptionsParams from the wmloptions component and fill me w/ options",
          })]
        })
      }
    })
    return generateFormField(wmlField)
  }


  generateChipsFormField=(params =new GenerateFieldParams<WMLChipsParams>({
    fieldCustomParams:new WMLChipsParams()
  }))=>{
      let {
        labelValue,
        fieldFormControlName,
        fieldParentForm,
        errorMsgs,
        selfType,
        fieldCustomParams
      } = params
    let wmlField
    fieldCustomParams.placeholder = "global.wmlChipsplaceholder"
    fieldCustomParams.userInputsAriaLabel = "global.wmlChipsuserInputsAriaLabel"
    fieldCustomParams.removeChipAriaLabel = "wmlChipsremoveChipAriaLabel"
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
        fieldCustomMeta:fieldCustomParams
      }
    })
    return generateFormField(wmlField)
  }

  submitForm = (params=new BaseServiceSubmitFormParams())=>{
    let {rootFormGroup,cdref,validFormPredicateTypeCustom,invalidFormPredicate,openOverlayLoading,closeOverlayLoading} = params
    if(!rootFormGroup.valid){
      invalidFormPredicate ?invalidFormPredicate(): this.tellUserToFillOutRequiredFields(
        rootFormGroup,cdref
      )
    }
    else{
      if(openOverlayLoading){
        this.openOverlayLoading()
      }
      if(params.validFormPredicateType === "default"){
        let {apiCall$,submitFormSuccess,submitFormFail}= params.validFormPredicateTypeDefault
        apiCall$
        .pipe(
          takeUntil(params.validFormPredicateTypeDefault.ngUnsub),
          tap({
            next:submitFormSuccess ?? (()=>{
              this.generateWMLNote("global.formSubmitSuccess",WmlNotifyBarType.Success,true)
              resetFormControls(rootFormGroup)
            }),
            error:submitFormFail ?? (()=>{
              this.openSystemError()
            })
          }),
          closeOverlayLoading ? this.closeOverlayLoading : tap()
        )
        .subscribe()
      }
      else{
        validFormPredicateTypeCustom()
      }

    }
  }

  tellUserToFillOutRequiredFields = (rootFormGroup:FormGroup,cdref?:ChangeDetectorRef)=>{
    let fillOutFormNote =this.generateWMLNote("global.fillOutForm",WmlNotifyBarType.Error)
    this.wmlNotifyService.create(fillOutFormNote)
    this.validateAllFormFields(rootFormGroup)
    cdref?.detectChanges()
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

  notifyUserThatThereAreNoRecords(apiBody: {data:WMLAPIPaginationResponseModel}, uiBody: WMLAPIPaginationRequestModel) {
    if (apiBody.data.totalItems === 0) {
      this.generateWMLNote("EntityMain.wmlNotify.noRecords");
    }
    else {
      uiBody.pageNum += 1;
    }
  }

}



export class ScolllPaginationParams<T=any> {
  constructor(params:Partial<ScolllPaginationParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.populateItemsAtStart()
    this.initPopulateWhenBottomIsReached()
    this.listenForScroll()
  }

  cdref?:ChangeDetectorRef
  ngUnsub:Subject<void>
  items:Array<T>=[]
  amntOfPixelsFromBottomBeforeRetrievingData:number = 5
  notifyError!:(err,failedApiCalls)=> void
  elementToDetermineXFromBottom:HTMLElement =document.documentElement
  stopMakingAPICalls=false
  listenForScroll$!: Observable<any>
  timesToCallAPIForMoreItemsAtStart =1
  listenForScollDebounceTime = 500
  onItemsRetrievedListener = ()=>{}
  private determineXPixelsFromBottom=()=> {
    let element = this.elementToDetermineXFromBottom;

    let xPixelsFromTheBottom = Math.abs(
      ((element.scrollHeight - element.scrollTop) - element.clientHeight)
    );
    return xPixelsFromTheBottom;
  }
  private populateItemsAtStart=()=>{
    let populateCalls$ = Array(this.timesToCallAPIForMoreItemsAtStart)
    .fill(null)
    .map((nullVal,index0)=>{
      return this.callAPIForMoreItems()

    })
    forkJoin(populateCalls$)
    .pipe(

      takeUntil(this.ngUnsub),
    )
    .subscribe()

  }
  private initPopulateWhenBottomIsReached=()=>{
    this.listenForScroll$ = merge(
      fromEvent(this.elementToDetermineXFromBottom, 'scroll'),
      fromEvent(window, 'resize')
    )
    .pipe(
      debounceTime(this.listenForScollDebounceTime),
      tap(() => {

        let xPixelsFromTheBottom = this.determineXPixelsFromBottom();
        if(xPixelsFromTheBottom < this.amntOfPixelsFromBottomBeforeRetrievingData && !this.stopMakingAPICalls ){
          this.callAPIForMoreItems().subscribe()
        }
      })
    )

  }
  private listenForScroll = ()=>{
    this.listenForScroll$
    .pipe(
      takeUntil(this.ngUnsub)
    )
    .subscribe()
  }
  private callAPIForMoreItems:()=>Observable<any> = ()=> {
    return this.callAPIForMoreItemsPredicate(this)
    .pipe(
      tap((res:WMLAPIPaginationResponseModel|WMLAPIError)=>{
        if(res instanceof WMLAPIPaginationResponseModel){
          this.items.push(...res.data)
          this.onItemsRetrievedListener()
          this.cdref?.detectChanges()
        }
      }),
      takeUntil(this.ngUnsub),
    )
  }

  callAPIForMoreItemsPredicate:any | (()=>Observable<WMLAPIPaginationResponseModel >) =(()=>{
    let pageNum = 0
    let pageSize = 4

    return  ()=> of(
      new WMLAPIPaginationResponseModel({

        data:Array(5)
        .fill(null)
        .map((nullVal,index0)=>{
          return {
            title:selectRandomOptionFromArray(["Home","About","Media","Courses","Pricing"]),
            color:generateRandomColor()
          }
        }),
        pageNum,
        pageSize
      })
    )
    .pipe(
      tap(()=>{
        pageNum++
        this.stopMakingAPICalls = pageNum >=  pageSize

      })
    )

  })()


}

export class BaseServiceSubmitFormParams {
  constructor(params:Partial<BaseServiceSubmitFormParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  rootFormGroup = new FormGroup({})
  cdref?:ChangeDetectorRef
  invalidFormPredicate?:Function
  openOverlayLoading = true
  closeOverlayLoading = true
  submitFormErrorPredicate:Function
  validFormPredicateType: "default" | "custom" ="default"
  validFormPredicateTypeCustom?:Function
  validFormPredicateTypeDefault: Partial<{
    apiCall$:Observable<any>,
    ngUnsub:Subject<any>
    submitFormSuccess:(value: any) => void
    submitFormFail:(value: any) => void
  }>
}
