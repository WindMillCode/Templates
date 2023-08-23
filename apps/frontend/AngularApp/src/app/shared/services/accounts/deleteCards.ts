
import { transformObjectKeys } from "@core/utility/common-utils"
import { transformFromCamelCaseToSnakeCase } from "@core/utility/string-utils"
import { Observable, of, take } from "rxjs"

export let deleteCardsLoad = (uiBody:DeleteCardsUIRequestBody): Observable<DeleteCardsAPIRequestBody>=>{

  let apiBody = new DeleteCardsAPIRequestBody({
    data:transformObjectKeys(
      uiBody,transformFromCamelCaseToSnakeCase
    )
  })
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let deleteCardsSuccess = (apiBody:DeleteCardsAPIResponseBody):DeleteCardsUIResponseBody=>{
  let uiBody = new DeleteCardsUIResponseBody()
  return uiBody
}

export class DeleteCardsUIRequestBody {
  constructor(params:Partial<DeleteCardsUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  ids:Array<string> = []
  accessToken:string
}

export class DeleteCardsUIResponseBody {
  constructor(params:Partial<DeleteCardsUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}

export class DeleteCardsAPIRequestBody {
  constructor(params:Partial<DeleteCardsAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:DeleteCardsUIRequestBody
}

export class DeleteCardsAPIResponseBody {
  constructor(params:Partial<DeleteCardsAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}
