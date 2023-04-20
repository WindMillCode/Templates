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
import { WMLImage, WMLUIProperty } from '@windmillcode/wml-components-base';
import { toggleDarkMode } from '@core/utility/common-utils';

import i18nTranslations from "src/assets/i18n/en.json";

@Component({

  selector: 'nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class NavMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,

  ) { }

  classPrefix = this.utilService.generateClassPrefix('NavMain')
  logoImg = new WMLImage({
    src:"assets/media/app/logo"
  })


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  darkMode = "NavMain.lightMode"
  mainMenuItems = i18nTranslations.NavMain.mainMenuItems
  .map((text,index0)=>{


      let pageRoute = ["home","profile","sample"][index0]
      return new WMLUIProperty({
        text:"NavMain.mainMenuItems."+index0,
        click:()=>{
          this.utilService.router.navigateByUrl(ENV.nav.urls[pageRoute])
        }
      })

  })

  ngOnInit(): void {
    this.toggleDarkMode(true)
  }
  toggleDarkMode(init=false){
    this.darkMode =  toggleDarkMode(init) ?  "NavMain.darkMode"  : "NavMain.lightMode"
  }

  navToHome(){
    this.utilService.router.navigateByUrl(ENV.nav.urls.home)
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




