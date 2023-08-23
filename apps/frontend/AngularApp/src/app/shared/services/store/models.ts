import { ColorOptionParams } from '@shared/components/color-option/color-option.component';
import { WmlTableZeroSampleCardParams } from '@windmillcode/angular-wml-table-zero';
import { WMLImage, WMLUIProperty } from '@windmillcode/angular-wml-components-base';
import { ListProductsDataAPIResponseBody, ListProductsUIResponseBody } from './listProducts';

export class StoreServiceCartItem {
  constructor(params:Partial<StoreServiceCartItem>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  img:WMLImage
  title:string
  id:string
  quantity:string
  color:ColorOptionParams
  size:WMLUIProperty
  price:StoreServiceCartItemPrice
  variationId:string
  get totalPrice(){
    let value = +(this.price.value.business*+this.quantity).toFixed(2)

    let result = new StoreServiceCartItemPrice({

      value:{
        business:value,
        currency:this.price.value.currency,
        display:this.price.value.currency+value
      }
    })
    return result
  }
}

export class StoreServiceCartItemPrice extends WMLUIProperty {
  constructor(params:Partial<StoreServiceCartItemPrice>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  override value = {
    business: 0,
    currency: "USD",
    get display(){
      return this.currency+this.business
    }
  };


}

export class StoreServiceTableCardItem extends WmlTableZeroSampleCardParams{
  constructor(params:Partial<StoreServiceTableCardItem>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  productDetail:ListProductsDataAPIResponseBody
}
