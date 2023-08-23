// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';



// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLCustomComponent, WMLUIProperty, generateClassPrefix } from '@windmillcode/angular-wml-components-base';
import {WMLTab, WMLTabHeader, WMLTabsParams, WMLTabsParamsUpdateTabsSubjParams} from '@windmillcode/angular-wml-tabs';

// misc

import { ENV } from '@env/environment';
import { WmlButtonZeroParams } from '@windmillcode/angular-wml-button-zero';
import { StoreService } from '@shared/services/store/store.service';
import { PanelCartComponent, PanelCartParams } from '../panel-cart/panel-cart.component';


@Component({

  selector: 'panel-cart-container',
  templateUrl: './panel-cart-container.component.html',
  styleUrls: ['./panel-cart-container.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class PanelCartContainerComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService,
    public storeService:StoreService
  ) { }

  classPrefix = generateClassPrefix('PanelCartContainer')
  @Input('params') params: PanelCartContainerParams = new PanelCartContainerParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  tabParams = new WMLTabsParams({
    tabs:[]
  })
  addCart = ()=>{
    if(this.storeService.carts.length > 3) return
    this.storeService.carts.push([])
    this.storeService.cartSubj.next("addCart")
  }
  removeCart = ()=>{
    if(this.storeService.carts.length <= 1) return
    this.storeService.carts.pop()
    this.storeService.cartSubj.next("removeCart")
  }
  addCartBtn = new WmlButtonZeroParams({
    text:new WMLUIProperty({
      text:"PanelCartContainer.addCartBtn"
    }),
    button:new WMLUIProperty({
      click:this.addCart
    })
  })
  removeCartBtn = new WmlButtonZeroParams({
    text:new WMLUIProperty({
      text:"PanelCartContainer.removeCartBtn"
    }),
    button:new WMLUIProperty({
      click:this.removeCart
    })
  })

  currentCartNumber = 1
  listenForTabChange= ()=>{
    return this.tabParams.tabChangedEvent
    .pipe(
      takeUntil(this.ngUnsub),
      tap((res)=>{
        this.currentCartNumber = res.index+1
        this.storeService.currentCart =this.storeService.carts[res.index]
      })
    )

  }
  listenForCartQuantity = ()=>{
    return this.storeService.cartSubj
    .pipe(
      takeUntil(this.ngUnsub),
      tap((res)=>{
        this.tabParams.tabs = this.storeService.carts
        .map((cart,index0)=>{
          return new WMLTab({
            body:new WMLCustomComponent({
              cpnt:PanelCartComponent,
              params:new PanelCartParams({
                cart,
                closePanel:this.params.close
              })
            }),
            header:{
              type:"wmlTabHeader",
              wmlTabHeader:new WMLTabHeader({
                text:[
                  new WMLUIProperty({
                    text:"PanelCartContainer.tabHeader"
                  }),
                  new WMLUIProperty({
                    text:(index0+1).toString()
                  })

                ]
              })
            }
          })
        })
        this.tabParams.updateTabsSubj.next(new WMLTabsParamsUpdateTabsSubjParams({
          currentTable:res ==="removeCart"? 0: this.tabParams.tabs.length-1
        }))
        this.cdref.detectChanges()
      })
    )

  }
  init = false
  ngOnInit(): void {
    if(this.init) return
    this.init = true
    this.listenForCartQuantity().subscribe()
    this.listenForTabChange().subscribe()
    this.storeService.cartSubj.next("removeItem")
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class PanelCartContainerParams {
  constructor(params:Partial<PanelCartContainerParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  close:Function
}


