// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';


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
import { SpecificService } from '@core/specific/specific.service';



@Component({

  selector: 'logo-display-zero',
  templateUrl: './logo-display-zero.component.html',
  styleUrls: ['./logo-display-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,

})
export class LogoDisplayZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public specificService:SpecificService,
    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('LogoDisplayZero')

  @Input('params') params: LogoDisplayZeroParams = new LogoDisplayZeroParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class LogoDisplayZeroParams {
  constructor(params:Partial<LogoDisplayZeroParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}


