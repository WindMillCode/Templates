
import { transformObjectKeys } from "@core/utility/common-utils"
import { transformFromCamelCaseToSnakeCase, transformFromSnakeCaseToCamelCase } from "@core/utility/string-utils"
import { Observable, of, take } from "rxjs"



export let addCardToUserLoad = (uiBody:AddCardToUserUIRequestBody): Observable<AddCardToUserAPIRequestBody>=>{

  let apiBody = new AddCardToUserAPIRequestBody({
    data:    transformObjectKeys(
      uiBody,
      transformFromCamelCaseToSnakeCase
    )
  })
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let addCardToUserSuccess = (apiBody:AddCardToUserAPIResponseBody):AddCardToUserUIResponseBody=>{
  let uiBody = new AddCardToUserUIResponseBody(
    transformObjectKeys(
      apiBody.data ?? {},
      transformFromSnakeCaseToCamelCase
    )
  )
  return uiBody
}

export class AddCardToUserUIRequestBody {
  constructor(params:Partial<AddCardToUserUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  accessToken:string
  paymentMethodToken:string
}

export class AddCardToUserUIResponseBody {
  constructor(params:Partial<AddCardToUserUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

}

export class AddCardToUserAPIRequestBody {
  constructor(params:Partial<AddCardToUserAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:AddCardToUserUIRequestBody
}

export class AddCardToUserAPIResponseBody {
  constructor(params:Partial<AddCardToUserAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:AddCardToUserUIResponseBody
}

