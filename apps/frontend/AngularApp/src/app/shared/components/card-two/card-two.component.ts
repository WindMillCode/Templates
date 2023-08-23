// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';


// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLImage, WMLUIProperty, generateClassPrefix, generateRandomColor, generateRandomNumber } from '@windmillcode/angular-wml-components-base';


// misc

import { ENV } from '@env/environment';



@Component({

  selector: 'card-two',
  templateUrl: './card-two.component.html',
  styleUrls: ['./card-two.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,




})
export class CardTwoComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('CardTwo')

  @Input('params') params: CardTwoParams = new CardTwoParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class CardTwoParams {
  constructor(params:Partial<CardTwoParams>={},addtl:Partial<{
    cardProviderImg:string,
    lastFour:string,
    expiration:string,

  }>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    if(addtl.cardProviderImg){
      this.cardProviderImg.src = addtl.cardProviderImg
    }

    if(addtl.lastFour){
      this.lastFour.value = addtl.lastFour
    }
    if(addtl.expiration){
      this.expiration.value = addtl.expiration
    }
  }
  id:string
  container = new WMLUIProperty({
    style:{
      background:`linear-gradient(${generateRandomNumber(360)}deg,${generateRandomColor()},${generateRandomColor()},${generateRandomColor()})`
    }
  })

  cardProviderImg=  new WMLImage({
    src:"assets/media/cardTwo/mastercard.svg",
    alt:"CardTwo.cardProviderImgAlt"
  })
  lastFour = new WMLUIProperty({
    value:"0000"
  })
  expiration = new WMLUIProperty({
    value:"00 / 00"
  })
}


