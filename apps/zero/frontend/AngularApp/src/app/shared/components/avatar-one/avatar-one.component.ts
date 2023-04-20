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
import { WMLImage } from '@windmillcode/wml-components-base';



@Component({

  selector: 'avatar-one',
  templateUrl: './avatar-one.component.html',
  styleUrls: ['./avatar-one.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class AvatarOneComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('AvatarOne')


  @Input('params') params = new WMLImage({
    src:"assets/media/app/avatar-one.svg",
    alt:"AvatarOne.iconAlt"
  })


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}






