// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding   } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc

import { ENV } from '@env/environment';
import { WMLImage, WMLRoute } from '@windmillcode/angular-wml-components-base';
import { SectionZeroParams } from '../section-zero/section-zero.component';
import enTranslations from "src/assets/i18n/en.json";


@Component({

  selector: 'footer-zero',
  templateUrl: './footer-zero.component.html',
  styleUrls: ['./footer-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class FooterZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,

    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('FooterZero')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  fullYear =  new Date().getFullYear();








  socialMediaImgs = Array(12)
  .fill(null)
  .map((nullVal,index0)=>{
    return new WMLImage({
      src:"assets/media/footer/footer_"+index0+".png",
      alt:"FooterZero.socialMedia.socialIconsAlt."+index0,
      click:()=>{
        window.location.href = [
          "https://theblacktube.com/@WindMillCode",
          "https://www.facebook.com/Windmillcode-100338862024871/",
          "https://twitter.com/windmillcode",
          "https://www.instagram.com/WindMillCode/",
          "https://patreon.com/WindMillCode",
          "https://www.tiktok.com/@windmillcode?lang=en",
          "https://discord.com/channels/801450776090247168/",
          "https://app.slack.com/workspace-signin?redir=%2Fgantry%2Fauth%3Fapp%3Dclient%26lc%3D1628494381%26return_to%3D%252Fclient%252FT01KAH3L82E%252FC01K3PRF5K8%26teams%3DT02ASQWG396%252CT02AMB34T1P%252CT0B0LG60J",
          "https://www.pinterest.com/Windmillcode/_saved/",
          "https://windmillcode.tumblr.com/",
          "https://www.reddit.com/user/windmillcode",
          "https://www.youtube.com/@windmillcode9189"
        ][index0]
      }
    })
  })


  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




