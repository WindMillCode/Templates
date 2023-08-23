// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  Input   } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc

import { WMLImage, WMLUIProperty } from '@windmillcode/angular-wml-components-base';
import { RatingStarsParams } from '../rating-stars/rating-stars.component';



@Component({

  selector: 'rating-card',
  templateUrl: './rating-card.component.html',
  styleUrls: ['./rating-card.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class RatingCardComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,

    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('RatingCard')


  @Input('params') params: RatingCardParams = new RatingCardParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class RatingCardParams {
  constructor(params:Partial<RatingCardParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  title = new WMLUIProperty({
    text:"Rating Card Title"
  })
  subTitle = new WMLUIProperty({
    text:"Rating Card Subtitle"
  })
  desc = new WMLUIProperty({
    text:"Sed tincidunt orci non varius sodales. Vestibulum imperdiet nisi sit amet elit pharetra finibus. Duis finibus velit odio, sed placerat ex commodo elementum. Duis risus est, hendrerit vel elementum pretium, consequat a lacus"
  })
  avatar= new WMLImage()
  rating = new RatingStarsParams();
}


