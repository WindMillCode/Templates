// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';


// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLUIProperty, generateClassPrefix } from '@windmillcode/angular-wml-components-base';


// misc
import { ENV } from '@env/environment';
import { WmlButtonOneParams } from '@windmillcode/angular-wml-button-zero';



@Component({

  selector: 'card-one',
  templateUrl: './card-one.component.html',
  styleUrls: ['./card-one.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,

})
export class CardOneComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('CardOne')

  @Input('params') params: CardOneParams = new CardOneParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
    if(!this.params.actionBtn.click){
      this.params.actionBtn.click = this.baseService.openFeatureIsComingSoon
    }
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class CardOneParams {
  constructor(params:Partial<CardOneParams & {paramTitle:string,viewBtnClick:Function } >={},
    /**
     * @deprecated use the same properties on params instead
    */
    addtl:Partial<{paramTitle:string,viewBtnClick:Function }>={}){
    Object.assign(
      this,
      {
        ...params,
      }
    )
    let paramTitle = params?.paramTitle ?? addtl?.paramTitle
    if(paramTitle){
      this.title = new WMLUIProperty({
        text:paramTitle
      })
    }
    let viewBtnClick = params?.viewBtnClick ?? addtl?.viewBtnClick
    if(viewBtnClick){
      // @ts-ignore
      this.actionBtn.click = viewBtnClick
    }
  }
  title= new WMLUIProperty({
    text:"My title"
  })
  actionBtn = new WmlButtonOneParams({
    text:"CardOne.actionBtn",
    click : null
  })
}


