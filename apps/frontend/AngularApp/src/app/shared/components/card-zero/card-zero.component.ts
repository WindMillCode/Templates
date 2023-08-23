// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  Input, HostListener, ViewChild, ElementRef   } from '@angular/core';




// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc
import { WMLImage, WMLUIProperty, updateClassString,toggleClassString, selectRandomOptionFromArray } from '@windmillcode/angular-wml-components-base';

import { WmlNotifyBarType } from '@windmillcode/angular-wml-notify';
import { WMLPanelItemParams } from '@windmillcode/angular-wml-panel';
import VanillaTilt from 'vanilla-tilt';


@Component({

  selector: 'card-zero',
  templateUrl: './card-zero.component.html',
  styleUrls: ['./card-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class CardZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,

    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('CardZero')


  @Input('params') params: CardZeroParams = new CardZeroParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  @ViewChild("mainPod",{static:true})  mainPod:ElementRef
  cardTypeClass  =this.classPrefix(`View`)+selectRandomOptionFromArray([0,1])
  classList:Array<string> = []
  updateClassString = updateClassString(this,"myClass","classList")
  ngUnsub= new Subject<void>()


  @HostListener("click",['$event.target'])
  toggleCard($evt:HTMLElement){
    if(!($evt.tagName === "A" ||  $evt.className === "CardZeroPod0Title0"  )){

      if(  this.params.type ==="expand"){
        toggleClassString(this.cardTypeClass+"Clicked",this.classList,this.updateClassString)
      }
      else if(this.params.type ==="panel"){
        this.params.panel.toggle()
      }
    }

  }

  openLink=(url:string)=>{
    if(!url){
      this.baseService.generateWMLNote(
        "CardZero.wmlNotify.missingArticleLink",
        WmlNotifyBarType.Info
      )
    }
    else{
      window.open(url,'_blank')
    }
  }

  initVanillaTilt= ()=>{
    VanillaTilt.init(this.mainPod.nativeElement,{
      perspective:500,
    });
  }

  ngOnInit(): void {
    this.updateClassString(this.classPrefix(`View`))
    this.updateClassString(this.cardTypeClass)
    this.initVanillaTilt()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class CardZeroParams extends WMLUIProperty {
  constructor(params:Partial<CardZeroParams>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  panel = new WMLPanelItemParams()
  override type:"expand" | "panel" | "lab" = "expand"
  title ="My Article Title"
  summary= `
  There's a report for that. Our 2023 Tech Forecast combines the top takeaways from Pluralsight's State of Upskilling report and State of Cloud report with user data from our platforms. Discover what makes employees 94% more likely to stay and why there’s a gap between tech leaders who want to develop in the cloud (75%) and technologists who have extensive cloud experience (8%).
  `
  resourceUrl:string
  imgUrl =new WMLImage()
}


