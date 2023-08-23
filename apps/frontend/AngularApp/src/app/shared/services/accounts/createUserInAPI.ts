
import { transformObjectKeys } from "@core/utility/common-utils"
import { transformFromSnakeCaseToCamelCase } from "@core/utility/string-utils"
import { Observable, of, take } from "rxjs"

export let createUserInAPILoad = (uiBody:CreateUserInAPIUIRequestBody): Observable<CreateUserInAPIAPIRequestBody>=>{

  let apiBody = new CreateUserInAPIAPIRequestBody({data:{uid:uiBody.id,email:uiBody.email,access_token:uiBody.accessToken}})
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let createUserInAPISuccess = (apiBody:CreateUserInAPIAPIResponseBody):CreateUserInAPIUIResponseBody=>{
  let uiBody = new CreateUserInAPIUIResponseBody(
    transformObjectKeys(
      apiBody.data,
      transformFromSnakeCaseToCamelCase
    )
  )
  return uiBody
}

export class CreateUserInAPIUIRequestBody {
  constructor(params:Partial<CreateUserInAPIUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  id:string
  email:string
  accessToken:string
}

export class CreateUserInAPIUIResponseBody {
  constructor(params:Partial<CreateUserInAPIUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  sqaureCustomerId:string
}

export class CreateUserInAPIAPIRequestBody {
  constructor(params:Partial<CreateUserInAPIAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data : {
    uid:string,
    email:string
    access_token:string
  }
}

export class CreateUserInAPIAPIResponseBody {
  constructor(params:Partial<CreateUserInAPIAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:{
    sqaure_customer_id:string
  }
}
