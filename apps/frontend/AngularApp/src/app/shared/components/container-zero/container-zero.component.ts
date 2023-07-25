// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input, ViewEncapsulation  , } from '@angular/core';


// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { generateClassPrefix } from '@windmillcode/angular-wml-components-base';


// misc

import { ENV } from '@env/environment';



@Component({

  selector: 'container-zero',
  templateUrl: './container-zero.component.html',
  styleUrls: ['./container-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush




})
export class ContainerZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('ContainerZero')

  @Input('params') params: ContainerZeroParams = new ContainerZeroParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class ContainerZeroParams {
  constructor(params:Partial<ContainerZeroParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}


