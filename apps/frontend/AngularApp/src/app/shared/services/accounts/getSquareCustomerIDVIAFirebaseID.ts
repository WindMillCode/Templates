
import { transformObjectKeys } from "@core/utility/common-utils"
import { transformFromCamelCaseToSnakeCase, transformFromSnakeCaseToCamelCase } from "@core/utility/string-utils"
import { Observable, of, take } from "rxjs"

export let getSquareCustomerIDVIAFirebaseIDLoad = (uiBody:GetSquareCustomerIDVIAFirebaseIDUIRequestBody): Observable<GetSquareCustomerIDVIAFirebaseIDAPIRequestBody>=>{

  let apiBody = new GetSquareCustomerIDVIAFirebaseIDAPIRequestBody({
    data:transformObjectKeys(uiBody,transformFromCamelCaseToSnakeCase)
  })
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let getSquareCustomerIDVIAFirebaseIDSuccess = (apiBody:GetSquareCustomerIDVIAFirebaseIDAPIResponseBody):GetSquareCustomerIDVIAFirebaseIDUIResponseBody=>{
  let uiBody = new GetSquareCustomerIDVIAFirebaseIDUIResponseBody(
    transformObjectKeys(apiBody.data,transformFromSnakeCaseToCamelCase)
  )
  return uiBody
}

export class GetSquareCustomerIDVIAFirebaseIDUIRequestBody {
  constructor(params:Partial<GetSquareCustomerIDVIAFirebaseIDUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  accessToken:string
}

export class GetSquareCustomerIDVIAFirebaseIDUIResponseBody {
  constructor(params:Partial<GetSquareCustomerIDVIAFirebaseIDUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  squareCustomerId:string

}

export class GetSquareCustomerIDVIAFirebaseIDAPIRequestBody {
  constructor(params:Partial<GetSquareCustomerIDVIAFirebaseIDAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:GetSquareCustomerIDVIAFirebaseIDUIRequestBody
}

export class GetSquareCustomerIDVIAFirebaseIDAPIResponseBody {
  constructor(params:Partial<GetSquareCustomerIDVIAFirebaseIDAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:GetSquareCustomerIDVIAFirebaseIDUIResponseBody
}
