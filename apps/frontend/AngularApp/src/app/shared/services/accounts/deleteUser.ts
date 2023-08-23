
import { transformObjectKeys } from "@core/utility/common-utils"
import { RecursiveSnakeCaseType, transformFromCamelCaseToSnakeCase, transformFromSnakeCaseToCamelCase } from "@core/utility/string-utils"
import { Observable, of, take } from "rxjs"

export let deleteUserLoad = (uiBody:DeleteUserUIRequestBody): Observable<DeleteUserAPIRequestBody>=>{

  let apiBody = new DeleteUserAPIRequestBody({data:transformObjectKeys(
    uiBody,
    transformFromCamelCaseToSnakeCase
  )})
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let deleteUserSuccess = (apiBody:DeleteUserAPIResponseBody):DeleteUserUIResponseBody=>{
  let uiBody = new DeleteUserUIResponseBody(transformObjectKeys(
    apiBody.data,
    transformFromSnakeCaseToCamelCase
  ))
  return uiBody
}

export class DeleteUserUIRequestBody {
  constructor(params:Partial<DeleteUserUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  accessToken:string
  customersToDelete:Array<{
    firebaseUserId:string,
    squareCustomerId:string,
  }>
}

export class DeleteUserAPIRequestBody {
  constructor(params:Partial<DeleteUserAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )


  }
  data:RecursiveSnakeCaseType<DeleteUserUIRequestBody>

}

export class DeleteUserUIResponseBody{
  constructor(params:Partial<DeleteUserUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

}

export class DeleteUserAPIResponseBody {
  constructor(params:Partial<DeleteUserAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:RecursiveSnakeCaseType<DeleteUserUIResponseBody>
}

