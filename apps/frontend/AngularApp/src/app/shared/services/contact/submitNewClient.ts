import { Observable, of, take } from "rxjs"

export let submitNewClientLoad = (uiBody:SubmitNewClientUIRequestBody): Observable<SubmitNewClientAPIRequestBody>=>{

  let apiBody = new SubmitNewClientAPIRequestBody({data:uiBody})
  return of(apiBody)
  .pipe(
    take(1),
  )
}

export let submitNewClientSuccess = (apiBody:SubmitNewClientAPIResponseBody):SubmitNewClientUIResponseBody=>{
  let uiBody = new SubmitNewClientUIResponseBody()
  return uiBody
}



export class SubmitNewClientUIRequestBody  {
  constructor(params:Partial<SubmitNewClientUIRequestBody>={}){

    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  name: string;
  email: string;
  phone: string;
  company: string;
  desc: string;
}

export class SubmitNewClientUIResponseBody {
  constructor(params:Partial<SubmitNewClientUIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}

export class SubmitNewClientAPIRequestBody {
  constructor(params:Partial<SubmitNewClientAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:SubmitNewClientUIRequestBody

}

export class SubmitNewClientAPIResponseBody {
  constructor(params:Partial<SubmitNewClientAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}
