// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';


// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject, interval } from 'rxjs';
import { startWith, takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLImage, generateClassPrefix, updateClassString } from '@windmillcode/angular-wml-components-base';


// misc

import { ENV } from '@env/environment';
import { LinkedList } from '@core/utility/common-utils';



@Component({

  selector: 'ads-zero',
  templateUrl: './ads-zero.component.html',
  styleUrls: ['./ads-zero.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush,
})
export class AdsZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('AdsZero')

  @Input('params') params: AdsZeroParams = new AdsZeroParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  myClassList = [""]
  updateClassString = updateClassString(this,"myClass","myClassList")
  ngUnsub= new Subject<void>()
  img =  new WMLImage({})


  ngOnInit(): void {
    this.revolveThroughAds().subscribe()
  }

  revolveThroughAds = ()=>{
    return interval(9000)
    .pipe(
      startWith({}),
      takeUntil(this.ngUnsub),
      tap(()=>{
        this.params.adsLinkedList.moveToNextItemInList()
        if(this.params.type=== AdsZeroTypeParams.HORIZ){

          
          this.img.src =  this.params.adsLinkedList.list.val.horiz
        }
        else{
          this.img.src =  this.params.adsLinkedList.list.val.vert
        }
        this.img.click = ()=>{
          window.open(this.params.adsLinkedList.list.val.link)
        }
        this.cdref.detectChanges()


        this.baseService.appCdRef?.detectChanges()
      })
    )

  }

  hideAd = ()=>{
    this.updateClassString("AdsZeroViewStates1")
    this.cdref.detectChanges()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}


export enum AdsZeroTypeParams {
  HORIZ,VERT
}
export class AdsZeroParams {
  constructor(params:Partial<AdsZeroParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    if(!this.imgAlt){
      this.imgAlt ="AdsZero.adImgAlt"
    }
    this.adsLinkedList = new LinkedList<AdsZeroParams["adsArray"][number]>(null,this.adsArray)

    this.adsLinkedList.closeList()
  }
  imgAlt
  type:AdsZeroTypeParams = AdsZeroTypeParams.VERT
  adsLinkedList : LinkedList<AdsZeroParams["adsArray"][number]>
  adsArray = [
    {
      vert:"prestiege-mercedes-vert.png",
      horiz:"prestiege-mercedes-horiz.png",
      link:"https://www.p-mercedes.com"
    },
    {
      vert:"neutrogena-vert.png",
      horiz:"neutrogena-horiz.png",
      link:"https://www.neutrogena.com"
    }
  ]
  .map((ad)=>{
    return{
      ...ad,
      vert:"assets/media/adsZero/"+ad.vert,
      horiz:"assets/media/adsZero/"+ad.horiz
    }
  })


}


