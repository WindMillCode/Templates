// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  Input   } from '@angular/core';



// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc

import { WMLSamplePanelItemParams } from '@windmillcode/angular-wml-panel';
import { CardZeroParams } from '@shared/components/card-zero/card-zero.component';

import { WMLUIProperty } from '@windmillcode/angular-wml-components-base';
import { WmlButtonZeroParams, WMLButtonParamsTypeEnum } from '@windmillcode/angular-wml-button-zero';



@Component({

  selector: 'events-panel-item',
  templateUrl: './events-panel-item.component.html',
  styleUrls: ['./events-panel-item.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class EventsPanelItemComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,

    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('EventsPanelItem')
  @Input('params') params: EventsPanelItemParams = new EventsPanelItemParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  clickNavigateBtn=()=>{
    window.open(this.params.cardInfo.resourceUrl)
  }
  navigateBtn = new WmlButtonZeroParams({
    text:new WMLUIProperty({
      text:"EventsPanelItem.navigateToSiteBtn",
    }),
    button:new WMLUIProperty({
      click:this.clickNavigateBtn
    })
  })
  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class EventsPanelItemParams extends WMLSamplePanelItemParams {
  constructor(params:Partial<EventsPanelItemParams>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  cardInfo = new CardZeroParams()
}


