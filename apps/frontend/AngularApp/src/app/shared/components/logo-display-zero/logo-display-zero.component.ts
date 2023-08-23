// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input,  } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc

import { WMLImage } from '@windmillcode/angular-wml-components-base';



@Component({

  selector: 'logo-display-zero',
  templateUrl: './logo-display-zero.component.html',
  styleUrls: ['./logo-display-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class LogoDisplayZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public baseService:BaseService,

  ) { }

  classPrefix = this.utilService.generateClassPrefix('LogoDisplayZero')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  @Input('params') params: any
  ngUnsub= new Subject<void>()
  logoImg = new WMLImage({
    src:"assets/media/app/logo-no-bg.png",
    alt:"FooterZero.logoImgAlt"
  })

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




