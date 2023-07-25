// angular
import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { fromEvent, map, Observable, Subject } from 'rxjs';

// i18n
import {  TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { generateClassPrefix } from '@windmillcode/angular-wml-components-base';


@Injectable({
  providedIn: 'root',

})
export class UtilityService {

  constructor(
    public translateService: TranslateService,
    public router:Router,
    public route:ActivatedRoute

  ) { }

  isIframe = window !== window.parent && !window.opener;

  changeLanguage(langCode:string){
    this.translateService.use(langCode)
  }

  /**
   * @deprecated use the export from @windmillcode/angular-wml-components-base instead
  */
  generateClassPrefix= generateClassPrefix







}



