// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';



// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLImage, WMLUIProperty, generateClassPrefix, generateRandomColor } from '@windmillcode/angular-wml-components-base';
import { getRandomImage } from '../../../core/utility/misc-utils';



// misc

import { ENV } from '@env/environment';
import { StoreService } from '@shared/services/store/store.service';
import { StoreServiceCartItem, StoreServiceCartItemPrice } from '../../services/store/models';
import { ColorOptionParams } from '../color-option/color-option.component';
import { WMLOptionItemParams } from '@windmillcode/angular-wml-options';
import { WmlButtonZeroParams,WMLButtonParamsTypeEnum} from '@windmillcode/angular-wml-button-zero';



@Component({

  selector: 'panel-cart',
  templateUrl: './panel-cart.component.html',
  styleUrls: ['./panel-cart.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class PanelCartComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public baseService:BaseService,
    public storeService:StoreService
  ) { }

  classPrefix = generateClassPrefix('PanelCart')
  @Input('params') params: PanelCartParams = new PanelCartParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  init = false
  shoppingCartTotal = new StoreServiceCartItemPrice()


  removeItem = (index:number)=>{
    this.params.cart.splice(index,1)
    this.calculateShoppingCartTotal()
    this.cdref.detectChanges()
  }
  createRemoveItemBtn = (index:number)=>{
    return new WmlButtonZeroParams({
      type:WMLButtonParamsTypeEnum.SECONDARY,
      text:new WMLUIProperty({
        text:"PanelCart.removeItemBtn"
      }),
      button:new WMLUIProperty({
        click:()=>{this.removeItem(index)}
      })
    })
  }

  calculateShoppingCartTotal = ()=>{
    if(!this.params.cart[0]){
      return
    }

    let currency = this.params.cart[0].totalPrice.value.currency
    let business = 0
    Object.assign(
      this.shoppingCartTotal.value,
      {
        business,
        currency
      }
    )

    this.params.cart.forEach((item)=>{
      this.shoppingCartTotal.value.business += item.totalPrice.value.business

    })
  }
  ngOnInit(): void {
    if(this.init) return
    this.init = true
    this.params = this.params?? new PanelCartParams()
    this.calculateShoppingCartTotal()
    this.params.checkoutBtn.button.click = ()=>{
      this.storeService.buyNow()
      this.params.closePanel()

    }
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class PanelCartParams {
  constructor(params:Partial<PanelCartParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.cart
    .forEach((item)=>{
      item.color.wmlOptionItem.updateClassString(
        item.color.wmlOptionItem.toggleClass
      )

    })
  }
  cart:StoreServiceCartItem[] =[]
  closePanel:Function
  checkoutBtn=new WmlButtonZeroParams({
    button:new WMLUIProperty({

    }),
    text:new WMLUIProperty({
      text:"PanelCart.buyNowBtn"
    })
  })
}


