// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  } from '@angular/core';



// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLButton, WMLImage, WMLUIProperty, generateClassPrefix } from '@windmillcode/angular-wml-components-base';

// misc
import { ENV } from '@env/environment';
import { SpecificService } from '@core/specific/specific.service';
import enTranslations from "src/assets/i18n/en.json";
import { WmlButtonZeroParams, WMLButtonParamsTypeEnum,WmlButtonOneParams} from '@windmillcode/angular-wml-button-zero';
import { makeTitleCase } from '@core/utility/common-utils';
import { AccountService } from '@shared/services/account/account.service';


@Component({

  selector: 'sign-up-sign-in-main',
  templateUrl: './sign-up-sign-in-main.component.html',
  styleUrls: ['./sign-up-sign-in-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class SignUpSignInMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService,
    public specificService:SpecificService,
    public accountService:AccountService
  ) { }

  classPrefix = generateClassPrefix('SignUpSignInMain')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  optionsObj = {
    [ENV.nav.urls.signIn]:{
      i18nObj:"SignIn",
    },
    [ENV.nav.urls.signUp]:{
      i18nObj:"SignUp",

    }
  }[this.utilService.router.url]
  enTranslations = enTranslations
  legalLinks = ["",ENV.nav.urls.termsAdConditions,"",ENV.nav.urls.privacyPolicy]
  socialSignBtns = []
  updateSocialSignBtns = ()=>{
    this.socialSignBtns =Object.keys(enTranslations[this.optionsObj.i18nObj])
    .map((key,index0)=>{
      let iconSrc = "assets/media/app/"+[
        "google-logo.png",
        "microsoft-logo.png",
        "facebook-logo.png",
        "yahoo-logo.png",
        "github-logo.png"
      ][index0]

      let wmlButton = new WmlButtonOneParams({
        type:index0<2? WMLButtonParamsTypeEnum.PRIMARY : WMLButtonParamsTypeEnum.SECONDARY,
        text:this.optionsObj.i18nObj+"."+key,
        btnClass:"SignUpSignInMainPod0Btn0Btn SignUpSignInMainPod0Btn0"+makeTitleCase(key),
        iconSrc,
        iconIsPresent:true,
        click:()=>{
          this.accountService.createUserViaFirebaseProvider(
            // @ts-ignore
            ["GOOGLE" ,"MICROSOFT" , "FACEBOOK" , "YAHOO"  , "GITHUB"][index0]
          )
        }
      })
      return wmlButton
    })
    this.cdref.detectChanges()
  }
  ngOnInit(): void {
    this.updateSocialSignBtns()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




