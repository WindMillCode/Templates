
import { transformObjectKeys } from "@core/utility/common-utils"
import { transformFromSnakeCaseToCamelCase } from "@core/utility/string-utils"
import { WmlInfiniteDropdownOption } from "@windmillcode/angular-wml-infinite-dropdown"
import { Observable, of, take } from "rxjs"

export let updateAddressLoad = (uiBody:UpdateAddressUIRequestBody,squareCustomerId:string,accessToken:string): Observable<UpdateAddressAPIRequestBody>=>{

  let apiBody = new UpdateAddressAPIRequestBody({
    data:{
      access_token:accessToken,
      customers_to_update:[
        {
          id:squareCustomerId,
          address:{
            address_line_1:uiBody.streetAdr,
            address_line_2:uiBody.secondaryAdr,
            locality:uiBody.city,
            administrative_district_level_1:uiBody.state?.value,
            postal_code:uiBody.zipcode,
            country:uiBody.country?.value,
          }
        }
      ]
    }
  })
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let updateAddressSuccess = (apiBody:UpdateAddressAPIResponseBody):UpdateAddressUIResponseBody=>{
  let uiBody = new UpdateAddressUIResponseBody(transformObjectKeys(
    apiBody.data,
    transformFromSnakeCaseToCamelCase
  ))
  return uiBody
}

export class UpdateAddressUIRequestBody {
  constructor(params:Partial<UpdateAddressUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  streetAdr: string;  //streetAdr
  secondaryAdr: string;  //secondaryAdr
  city: string;  //city
  state: WmlInfiniteDropdownOption ;  //state
  zipcode: string;  //zipcode
  country: WmlInfiniteDropdownOption ;  //country
}

export class UpdateAddressUIResponseBody{
  constructor(params:Partial<UpdateAddressUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

}

export class UpdateAddressAPIRequestBody {
  constructor(params:Partial<UpdateAddressAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:{
    access_token:string
    customers_to_update:Array<{
      id:string
      address:{
        address_line_1: string;  //streetAdr
        address_line_2: string;  //secondaryAdr
        locality: string;  //city
        administrative_district_level_1: string;  //state
        postal_code: string;  //zipcode
        country: string;  //country
      }

    }>
  }
}

export class UpdateAddressAPIResponseBody {
  constructor(params:Partial<UpdateAddressAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:any
}

