import { Injectable } from '@angular/core';
import { ENV } from '@env/environment';
import { BaseService } from '@core/base/base.service';
import { WmlNotifyBarType, WmlNotifyService } from '@windmillcode/angular-wml-notify';
import { WMLAPIError, WMLImage } from '@windmillcode/angular-wml-components-base';
import { UtilityService } from '@core/utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class SpecificService  {
  constructor(
    public utilService:UtilityService,
    public wmlNotifyService:WmlNotifyService,
    public baseService:BaseService
  ){}
  logoImg = ()=>new WMLImage({
    src:"assets/media/app/logo-no-bg.png",
    alt:"global.logoImgAlt",
    click:()=>{
      this.utilService.router.navigateByUrl(ENV.nav.urls.home)
    }
  })

  paintSploshBg = ()=>new WMLImage({
    src:"assets/media/app/paint_stroke_background.svg",
    alt:"global.paintStrokeBgAlt"
  })

  private _manageWebStorage(webStorage:Storage,thisWebStorage:any,predicate:Function) {
    let myWebStorage = webStorage.getItem(ENV.classPrefix.app);
    myWebStorage = JSON.parse(myWebStorage);
    Object.assign(thisWebStorage, myWebStorage);
    predicate()
    webStorage.setItem(ENV.classPrefix.app, JSON.stringify(thisWebStorage))
  }


}
