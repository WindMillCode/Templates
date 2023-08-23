// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';


// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { generateClassPrefix, replaceValuesWithPaths } from '@windmillcode/angular-wml-components-base';


// misc

import { ENV } from '@env/environment';
import { WMLOptionItemParams, WMLOptionsParams } from '@windmillcode/angular-wml-options';
import enTranslations from "src/assets/i18n/en.json";


@Component({

  selector: 'confirm-dialog-zero',
  templateUrl: './confirm-dialog-zero.component.html',
  styleUrls: ['./confirm-dialog-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,




})
export class ConfirmDialogZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('ConfirmDialogZero')

  @Input('params') params: ConfirmDialogZeroParams = new ConfirmDialogZeroParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
    if(this.params.type === ConfirmDialogZeroTypeParams.DEFAULT){
      this.params.options.options[1].click =()=>{
        this.baseService.closePopup()
      }
    }
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


export enum ConfirmDialogZeroTypeParams{
  DEFAULT,CUSTOM
}
export class ConfirmDialogZeroParams {
  constructor(params:Partial<ConfirmDialogZeroParams &{paramOptionIds:Array<string>} >={}){
    Object.assign(
      this,
      {
        ...params
      }
    )

    ;(params.paramOptionIds ??[])
    .map((id,index0)=>{
      this.options.options[index0].id = id
    })
  }
  updateYesAction =(value)=>{
    this.options.options[0].click = value
  }
  type = ConfirmDialogZeroTypeParams.DEFAULT
  title = "ConfirmDialogZero.title"
  options = new WMLOptionsParams({
    options: replaceValuesWithPaths(
      enTranslations.ConfirmDialogZero.options,
      'ConfirmDialogZero.options.'
    )
    // @ts-ignore
    .map((val)=>{
      return new WMLOptionItemParams({
        text:val,
      })
    })
  })
}


