// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  Input   } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc

import { WMLUIProperty } from '@windmillcode/angular-wml-components-base';



@Component({

  selector: 'stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class StepperComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,

    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('Stepper')


  @Input('params') params: StepperParams = new StepperParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class StepperParams {
  constructor(params:Partial<StepperParams | any>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.multiline = this.multiline.map((text)=>{
      if(typeof text === "string"){
        return new WMLUIProperty({
          text
        })
      }
      return text
    })

  }


  multiline:WMLUIProperty[] = []
}


