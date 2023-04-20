import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { concatMap, iif, map, Observable, of, take, tap } from 'rxjs';
import { BaseService } from '@core/base/base.service';
import { FormGroup } from '@angular/forms';
import { WmlLabelParams, WMLField } from '@windmillcode/wml-field';
import { WmlInputComponent, WmlInputParams } from '@windmillcode/wml-input';
import { CandidacyInfoFormComponent, CandidacyInfoFormParams } from '@shared/components/candidacy-info-form/candidacy-info-form.component';
import { FileUploadComponent, FileUploadParams } from '@shared/components/file-upload/file-upload.component';
import { WmlNotifyBarType } from '@windmillcode/wml-notify';
import { WMLAPIError } from '@windmillcode/wml-components-base';

@Injectable({
  providedIn: 'root'
})
export class SpecificService extends BaseService {

  sessionStorage = {
    siteUnderConstructionBannerWasOpened:false
  }
  localStorage ={
    freeTrial:0
  }

  endUseAfterFreeTrial =(justChecking:boolean)=>{
    let result
    this._manageWebStorage(
      localStorage,
      this.localStorage,
      ()=>{
        if(this.localStorage.freeTrial >= ENV.app.freeTrialEndsAfter){
          this.generateWMLNote("app.freeTrialEnded",WmlNotifyBarType.Error,true)
          result  = new WMLAPIError()
        }
        else if(!justChecking){
          this.localStorage.freeTrial += 1
        }
      }
    );
    return result

  }
  openSiteUnderConstructionBanner = ()=>{
    this._manageWebStorage(
      sessionStorage,
      this.sessionStorage,
      ()=>{
        if(!this.sessionStorage.siteUnderConstructionBannerWasOpened){
          this.sessionStorage.siteUnderConstructionBannerWasOpened = true
          sessionStorage.setItem(ENV.classPrefix.app, JSON.stringify(this.sessionStorage))

          this.generateWMLNote("global.siteUnderConstruction",WmlNotifyBarType.Info,true)
          this.appCdRef?.detectChanges()

        }
      }
    );


  }

  private _manageWebStorage(webStorage:Storage,thisWebStorage:any,predicate:Function) {
    let myWebStorage = webStorage.getItem(ENV.classPrefix.app);
    myWebStorage = JSON.parse(myWebStorage);
    Object.assign(thisWebStorage, myWebStorage);
    predicate()
    webStorage.setItem(ENV.classPrefix.app, JSON.stringify(thisWebStorage))
  }

  generateCandidacyInfoFileFormField=(params:{
    labelValue?:string,
    fieldFormControlName,
    fieldParentForm:FormGroup,
    errorMsgs?:WmlLabelParams["errorMsgs"],
    selfType?:WMLField["self"]["type"],
    fieldCustomParams?:FileUploadParams
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
        fieldCustomCpnt:FileUploadComponent,
        fieldCustomMeta:fieldCustomParams ?? new FileUploadParams({}),
        errorMsgs: errorMsgs ?? {
          required:"global.errorRequired"
        }
      }
    })


    return this.generateFormField(wmlField)
  }


}
