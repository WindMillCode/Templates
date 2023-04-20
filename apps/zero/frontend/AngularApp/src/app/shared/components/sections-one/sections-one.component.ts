// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc

import { ENV } from '@env/environment';
import { WMLUIProperty } from '@windmillcode/wml-components-base';



@Component({

  selector: 'sections-one',
  templateUrl: './sections-one.component.html',
  styleUrls: ['./sections-one.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class SectionsOneComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('SectionsOne')


  @Input('params') params: SectionsOneParams = new SectionsOneParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class SectionsOneParams {
  constructor(params:Partial<SectionsOneParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  multiline:{
    title:WMLUIProperty,
    desc:WMLUIProperty[]
  }[] = []
}


