// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc

import { WmlSliceboxImg, WmlSliceboxParams } from '@windmillcode/angular-wml-slicebox';



@Component({

  selector: 'home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class HomeMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,

    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('HomeMain')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  images: WmlSliceboxImg[] = [
    "crexi.png",
    "sports.png",
    "holiday.png",
  ]
  .map((imgSrc, index0) => {


    let img = new WmlSliceboxImg({
      src:"assets/media/home/"+imgSrc,
      value: index0.toString(),
    });


    return img;
  });
  sliceBoxParams = new WmlSliceboxParams({
    images: this.images,
    orientation:"v",
    disperseFactor:20,
    disperseSpeed:4000,
    speed:7500,
    sequentialFactor:1750,
    autoplay:true
  });

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




