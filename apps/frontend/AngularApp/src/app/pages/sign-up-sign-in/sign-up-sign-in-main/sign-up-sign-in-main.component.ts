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
import { makeTitleCase } from '@core/utility/string-utils';
import { AccountsService } from '@shared/services/accounts/accounts.service';


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
    public accountsService:AccountsService
  ) { }

  classPrefix = generateClassPrefix('SignUpSignInMain')

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  optionsObj = {
    [ENV.nav.urls.signIn]:{
      i18nObj:"SignIn",
      action:"signin",
      idPrefix:ENV.idPrefix.signIn
    },
    [ENV.nav.urls.signUp]:{
      i18nObj:"SignUp",
      action:"signup",
      idPrefix:ENV.idPrefix.signUp

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
        "github-logo.png",
        "twitter.png"
      ][index0]

      let wmlButton = new WmlButtonOneParams({
        type:index0<2? WMLButtonParamsTypeEnum.PRIMARY : WMLButtonParamsTypeEnum.SECONDARY,
        text:this.optionsObj.i18nObj+"."+key,
        btnClass:"SignUpSignInMainPod0Btn0Btn SignUpSignInMainPod0Btn0"+makeTitleCase(key),
        iconSrc,
        iconIsPresent:true,
        id:this.optionsObj.idPrefix + ["googleBtn" ,"microsoftBtn" , "facebookBtn" , "yahooBtn", "githubBtn","twitterBtn"][index0],
        click:()=>{
          this.accountsService.authenticateViaFirebaseProvider(
            // @ts-ignore
            ["GOOGLE" ,"MICROSOFT" , "FACEBOOK" , "YAHOO"  , "GITHUB","TWITTER"][index0],
            this.optionsObj.action
          )
          .pipe(
            takeUntil(this.ngUnsub),
          )
          .subscribe()

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




