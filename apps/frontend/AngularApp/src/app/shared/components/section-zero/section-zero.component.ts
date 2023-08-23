// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  Input   } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc

import { WMLRoute, WMLUIProperty } from '@windmillcode/angular-wml-components-base';



@Component({

  selector: 'section-zero',
  templateUrl: './section-zero.component.html',
  styleUrls: ['./section-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class SectionZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,

    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('SectionZero')


  @Input('params') params: SectionZeroParams = new SectionZeroParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


export class SectionZeroParamsInput {
  constructor(params:Partial<SectionZeroParamsInput>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  title:string | WMLUIProperty ="YOUR TITLE HERE"
  items:Array<string | WMLRoute> = [
    "ARAY","OF","LINKS","HERE"
  ]
}

export class SectionZeroParams {
  constructor(params:Partial<SectionZeroParamsInput>=new SectionZeroParamsInput()){

    this.title= params.title instanceof WMLUIProperty ? params.title : new WMLUIProperty({
      text:params.title
    })
    this.items= params.items?.map((item)=>{
      return item instanceof WMLRoute ? item : new WMLRoute({
        text:item
      })
    })

  }
  title:  WMLUIProperty
  items:Array<  WMLRoute>
}


