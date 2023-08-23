
import { transformObjectKeys } from "@core/utility/common-utils"
import { RecursiveSnakeCaseType, transformFromCamelCaseToSnakeCase, transformFromSnakeCaseToCamelCase } from "@core/utility/string-utils"
import { WMLAPIPaginationRequestModel, WMLAPIPaginationResponseModel } from "@windmillcode/angular-wml-components-base"
import { Observable, of, take } from "rxjs"

export let listUsersLoad = (uiBody:ListUsersUIRequestBody): Observable<ListUsersAPIRequestBody>=>{

  let apiBody = new ListUsersAPIRequestBody({data:transformObjectKeys(
    uiBody,
    transformFromCamelCaseToSnakeCase
  )})
  apiBody.data.page_size =1
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let listUsersSuccess = (apiBody:ListUsersAPIResponseBody):ListUsersUIResponseBody=>{
  let uiBody = new ListUsersUIResponseBody(transformObjectKeys(
    apiBody.data,
    transformFromSnakeCaseToCamelCase
  ))
  return uiBody
}


export enum ListUsersUIRequestBodyTypeEnum {
  GETPROFILE
}
export class ListUsersUIRequestBody extends WMLAPIPaginationRequestModel {
  constructor(params:Partial<ListUsersUIRequestBody>={}){
    super(params)
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  accessToken:string
  type:ListUsersUIRequestBodyTypeEnum.GETPROFILE
}

export class ListUsersUIResponseBody extends WMLAPIPaginationResponseModel {
  constructor(params:Partial<ListUsersUIResponseBody>={}){
    super(params)
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  override data:{
    address?:{
      addressLine_1: string;
      addressLine_2: string;
      administrativeDistrictLevel_1: string;
      country: string;
      locality: string;
      postalCode: string;
    }
    createdAt: string;
    creationSource: string;
    emailAddress: string;
    givenName: string;
    id: string;
    preferences: {
      emailUnsubscribed: boolean;
    };
    referenceId: string;
    segmentIds: {[k:string]:string}[];
    updatedAt: string;
    version: number;
  }[]

}

export class ListUsersAPIRequestBody {
  constructor(params:Partial<ListUsersAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:RecursiveSnakeCaseType<ListUsersUIRequestBody>

}

export class ListUsersAPIResponseBody {
  constructor(params:Partial<ListUsersAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:RecursiveSnakeCaseType<ListUsersUIResponseBody>
}
