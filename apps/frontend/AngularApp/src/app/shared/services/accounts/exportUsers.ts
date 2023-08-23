
import { transformObjectKeys } from "@core/utility/common-utils"
import { RecursiveSnakeCaseType, transformFromCamelCaseToSnakeCase, transformFromSnakeCaseToCamelCase } from "@core/utility/string-utils"
import { Observable, of, take } from "rxjs"

export let exportUsersLoad = (uiBody:ExportUsersUIRequestBody): Observable<ExportUsersAPIRequestBody>=>{

  let apiBody = new ExportUsersAPIRequestBody({data:transformObjectKeys(
    uiBody,
    transformFromCamelCaseToSnakeCase
  )})
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let exportUsersSuccess = (apiBody:ExportUsersAPIResponseBody):ExportUsersUIResponseBody=>{
  let uiBody = new ExportUsersUIResponseBody(transformObjectKeys(
    apiBody.data,
    transformFromSnakeCaseToCamelCase
  ))
  return uiBody
}

export class ExportUsersUIRequestBody {
  constructor(params:Partial<ExportUsersUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  accessToken:string
  targetUsers:Array<{
    firebaseUserId:string,
    squareCustomerId:string,
  }>
}

export class ExportUsersAPIRequestBody {
  constructor(params:Partial<ExportUsersAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:RecursiveSnakeCaseType<ExportUsersUIRequestBody>
}

export class ExportUsersUIResponseBody {
  constructor(params:Partial<ExportUsersUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  content:string
}

export class ExportUsersAPIResponseBody {
  constructor(params:Partial<ExportUsersAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:RecursiveSnakeCaseType<ExportUsersUIResponseBody>
}

