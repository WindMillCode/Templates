// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  Input   } from '@angular/core';

// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { Subject } from 'rxjs';

// misc
import { RatingCardParams } from '../rating-card/rating-card.component';
import { WMLUIProperty, generateClassPrefix } from '@windmillcode/angular-wml-components-base';



@Component({

  selector: 'rating-carousel',
  templateUrl: './rating-carousel.component.html',
  styleUrls: ['./rating-carousel.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class RatingCarouselComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('RatingCarousel')


  @Input('params') params: RatingCarouselParams = new RatingCarouselParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  moveLeft(){
    if(this.params.direction !=="still"){
      return
    }
    let card = this.params.cards.splice(this.params.cards.length-1,this.params.cards.length)[0]
    this.params.cards.unshift(card)
    this.params.cards.forEach((card)=>{
      card.pod.updateClassString("RatingCarouselPod0Item1")
    })
    this.params.direction = "left"
    this.cdref.detectChanges()

  }

  moveRight(){
    if(this.params.direction !=="still"){
      return
    }
    this.params.cards.forEach((card)=>{
      card.pod.updateClassString("RatingCarouselPod0Item2")
    })
    this.params.direction = "right"
    this.cdref.detectChanges()

  }

  cleanupAnimation(){

    this.params.cards.forEach((card)=>{
      card.pod.updateClassString("RatingCarouselPod0Item1","remove")
      card.pod.updateClassString("RatingCarouselPod0Item2","remove")
    })

    if(this.params.direction === "right"){
      let card = this.params.cards.shift()
      this.params.cards.push(card)
    }
    this.params.direction = "still"
    this.cdref.detectChanges()

  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class RatingCarouselParams {
  constructor(params:Partial<{cards:RatingCardParams[]}>={cards:[]}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.cards = params.cards.map((card)=>{
      return{
        pod:new WMLUIProperty(),
        card
      }
    })
  }

  cards:{card:RatingCardParams,pod:WMLUIProperty}[] = []
  direction:"left" | "right" | "still" = "still"
}


