
import { transformObjectKeys } from "@core/utility/common-utils"
import { transformFromCamelCaseToSnakeCase } from "@core/utility/string-utils"
import { Observable, of, take } from "rxjs"

export let purchaseProductsLoad = (uiBody:PurchaseProductsUIRequestBody): Observable<PurchaseProductsAPIRequestBody>=>{

  let apiBody = new PurchaseProductsAPIRequestBody({
    data:transformObjectKeys(
      uiBody,transformFromCamelCaseToSnakeCase
    )
  })
  apiBody.data.cart_items = uiBody.items.map((item)=>{
    return {
      quantity:item.quantity,
      catalog_object_id:item.variationId
    }
  })
  // @ts-ignore
  delete  apiBody.data.items

  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let purchaseProductsSuccess = (apiBody:PurchaseProductsAPIResponseBody):void=>{
  window.location.href = apiBody.data.payment_link
}

export class PurchaseProductsUIRequestBody {
  constructor(params:Partial<PurchaseProductsUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  items:{
    quantity:string
    variationId:string
  }[] =[]
  accessToken?:string
}

export class PurchaseProductsUIResponseBody {
  constructor(params:Partial<PurchaseProductsUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}

export class PurchaseProductsAPIRequestBody {
  constructor(params:Partial<PurchaseProductsAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:{
    cart_items:{
      quantity:string
      catalog_object_id:string
    }[]
  } ={
    cart_items:[]
  }
}

export class PurchaseProductsAPIResponseBody {
  constructor(params:Partial<PurchaseProductsAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:{
    payment_link:string
  }
}

