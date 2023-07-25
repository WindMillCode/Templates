// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';



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
import { WMLOptionItemParams } from '@windmillcode/angular-wml-options';



@Component({

  selector: 'color-option',
  templateUrl: './color-option.component.html',
  styleUrls: ['./color-option.component.scss'],



})
export class ColorOptionComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('ColorOption')

  @Input('params') params: ColorOptionParams = new ColorOptionParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()


  ngOnInit(): void {
    this.cdref.detectChanges()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class ColorOptionParams  {
  constructor(params:Partial<ColorOptionParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    if(this.wmlOptionItem){

      this.wmlOptionItem.toggleClass  = this.wmlOptionItem.toggleClass??"ColorOptionMainPod0"
    }
  }
  wmlOptionItem!:WMLOptionItemParams
  color = new WMLUIProperty({})
}


