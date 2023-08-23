// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  } from '@angular/core';



// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLUIProperty, generateClassPrefix } from '@windmillcode/angular-wml-components-base';


// misc

import { ENV } from '@env/environment';
import enTranslations from "src/assets/i18n/en.json";


@Component({

  selector: 'legal-doc-main',
  templateUrl: './legal-doc-main.component.html',
  styleUrls: ['./legal-doc-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class LegalDocMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('LegalDocMain')


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  optionsObj = {
    [ENV.nav.urls.privacyPolicy]:{
      title:"PrivacyPolicy.title",
      sections:enTranslations.PrivacyPolicy.sections
      .map((sectionText,index0)=>{
        return new WMLUIProperty<any,"text"|"section"|"list" |"value"| "bold_text">({
          // @ts-ignore
          text:sectionText,
          // @ts-ignore
          type:[
            "text",
            "section","text","list","text","list","text",
            "section","text","text",
            "section","text","text","text",
            "section","text","list","text",
            "section","text","list","text","list",
            "section","text","text",
            "section","text",
            "section","text","text",
            "section","text",
            "section","text",
            "section","text","text","text","text","value"
          ][index0]?? "text"
        })
      })
    },
    [ENV.nav.urls.termsAdConditions]:{
      title:"TermsAndContions.title",
      sections:enTranslations.TermsAndContions.sections
      .map((sectionText,index0)=>{
        return new WMLUIProperty<any,"text"|"section"|"list" |"value">({
          // @ts-ignore
          text:sectionText,
          // @ts-ignore
          type:[
            "bold_text",
            "section",
            "text",
            "text",
            "text",
            "text",
            "text",
            "text",
            "text",
            "section",
            "text",
            "text",
            "section",
            "bold_text",
            "text",
            "text",
            "text",
            "bold_text",
            "text",
            "list",
            "text",
            "text",
            "text",
            "text",
            "text",
            "bold_text",
            "text",
            "text",
            "text",
            "text",
            "text",
            "text",
            "text",
            "list",
            "text",
            "text",
            "bold_text",
            "text",
            "section",
            "text",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "list",
            "text",
            "text",
            "text",
            "section",
            "text",
            "section",
            "text",
            "text",
            "list",
            "section",
            "text",
            "list",
            "text",
            "section",
            "text",
            "text",
            "text",
            "text",
            "section",
            "text",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "text",
            "section",
            "text",
            "text",
            "section",
            "text",
            "section",
            "text",
            "text",
            "section",
            "text",
            "text",
            "text",
            "section",
            "text",
            "text",
            "text",
            "text",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "section",
            "text",
            "text",
            "text",
            "text",
            "text"
          ][index0]?? "text"
        })
      })
    }
  }[this.utilService.router.url]
  sections = this.optionsObj.sections

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}





