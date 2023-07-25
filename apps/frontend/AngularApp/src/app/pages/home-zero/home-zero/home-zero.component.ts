// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  } from '@angular/core';



// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLImage, WMLUIProperty, generateClassPrefix } from '@windmillcode/angular-wml-components-base';

// misc
import { ENV } from '@env/environment';
import { CarouselZeroItemParams, CarouselZeroParams } from '@shared/components/carousel-zero/carousel-zero.component';
import enTranslations from "src/assets/i18n/en.json";
@Component({

  selector: 'home-zero',
  templateUrl: './home-zero.component.html',
  styleUrls: ['./home-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class HomeZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public baseService:BaseService
  ) { }

  classPrefix = generateClassPrefix('HomeZero')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()


  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




