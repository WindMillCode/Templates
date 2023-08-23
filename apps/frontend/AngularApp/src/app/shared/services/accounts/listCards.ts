
import { transformObjectKeys } from "@core/utility/common-utils"
import { RecursiveSnakeCaseType, transformFromCamelCaseToSnakeCase, transformFromSnakeCaseToCamelCase } from "@core/utility/string-utils"
import { WMLAPIPaginationRequestModel, WMLAPIPaginationResponseModel } from "@windmillcode/angular-wml-components-base"
import { Observable, of, take } from "rxjs"

export let listCardsLoad = (uiBody:ListCardsUIRequestBody): Observable<ListCardsAPIRequestBody>=>{

  let apiBody = new ListCardsAPIRequestBody({data:transformObjectKeys(
    uiBody,
    transformFromCamelCaseToSnakeCase
  )})
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let listCardsSuccess = (apiBody:ListCardsAPIResponseBody):ListCardsUIResponseBody=>{

  let uiBody = new ListCardsUIResponseBody(transformObjectKeys(
    apiBody.data,
    transformFromSnakeCaseToCamelCase
  ))
  return uiBody
}

export class ListCardsUIRequestBody extends WMLAPIPaginationRequestModel {
  constructor(params:Partial<ListCardsUIRequestBody>={}){
    super(params)
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  accessToken:string
}

export class ListCardsUIResponseBody extends WMLAPIPaginationResponseModel{
  constructor(params:Partial<ListCardsUIResponseBody>={}){
    super(params)
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  override data:{
    enabled: boolean;
    expMonth: number;
    expYear: number;
    last4: string;
    cardBrand:string;
    id:string
  }[][] = []
}

export class ListCardsAPIRequestBody {
  constructor(params:Partial<ListCardsAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:  RecursiveSnakeCaseType<ListCardsUIRequestBody>
}

export class ListCardsAPIResponseBody {
  constructor(params:Partial<ListCardsAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:RecursiveSnakeCaseType<ListCardsUIResponseBody>
}
