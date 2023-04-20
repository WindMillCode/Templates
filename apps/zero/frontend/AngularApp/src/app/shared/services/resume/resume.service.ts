import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { readFileContent, transformFromSnakeCaseToCamelCase } from '@core/utility/common-utils';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { myAutomate } from '@helpers/automation/automation/myautomate';
import { WMLFileUploadItem } from '@windmillcode/wml-file-manager';
import { BehaviorSubject, concatMap, iif, map, Observable, of, ReplaySubject, Subject, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(
    public http:HttpClient,
    public utilityService:UtilityService
  ) { }
  submitFormToAnalyzeResumeSubj = new BehaviorSubject<SubmitFormToAnalyzeResumeUIResponseBody>(null)
  submitFormToAnalyzeResume = (uiBody:SubmitFormToAnalyzeResumeUIRequestBody,raw = false)=>{

    return iif(
      ()=>ENV.resumeService.submitFormToAnalyzeResume.automate,
      of(new SubmitFormToAnalyzeResumeUIResponseBody(myAutomate.resumeService.submitFormToAnalyzeResume)),

      submitFormToAnalyzeResumeLoad(uiBody)
      .pipe(
        concatMap((apiBody)=>{
          return this.http
          .post(ENV.resumeService.submitFormToAnalyzeResume.url(),apiBody)
          .pipe(raw ? tap() : map(submitFormToAnalyzeResumeSuccess(uiBody.company)))
        })
      )
    )
  }

}

let submitFormToAnalyzeResumeLoad  = (uiBody:SubmitFormToAnalyzeResumeUIRequestBody): Observable<SubmitFormToAnalyzeResumeAPIRequestBody>=>{

  let apiBody = new SubmitFormToAnalyzeResumeAPIRequestBody({})
  // @ts-ignore

  apiBody.data = {
    jobDesc : uiBody.jobDesc,
    company:  uiBody.company
  }
  return of({})
  .pipe(concatMap(()=>{
    return  readFileContent(uiBody.resume[0].file,"readAsBinaryString")
    .pipe(
      take(1),
      map((res)=>{
        apiBody.data.resume={
          name:uiBody.resume[0].file.name,
          content:res.content,
          type:uiBody.resume[0].file.type
        }
        return apiBody
      })
    )
  }))

}

let submitFormToAnalyzeResumeSuccess =(company:string)=> (apiBody:SubmitFormToAnalyzeResumeAPIResponseBody):SubmitFormToAnalyzeResumeUIResponseBody=>{
  let neededInfo:SubmitFormToAnalyzeResumeUIResponseBody = JSON.parse(apiBody.data)
  // @ts-ignore
  neededInfo[transformFromSnakeCaseToCamelCase("candidate_questions")] =neededInfo.candidate_questions
  // @ts-ignore
  neededInfo[transformFromSnakeCaseToCamelCase("company_logo_url")] =neededInfo.company_logo_url
  // @ts-ignore
  delete neededInfo.candidate_questions
  // @ts-ignore
  delete neededInfo.company_logo_url
  let uiBody = new SubmitFormToAnalyzeResumeUIResponseBody(neededInfo)
  if(company){
    uiBody.role += " @ " + company
  }
  return uiBody
}


export class SubmitFormToAnalyzeResumeUIRequestBody {
  constructor(params:Partial<SubmitFormToAnalyzeResumeUIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  jobDesc: string
  company?:string
  resume: Array<WMLFileUploadItem>
}

export class SubmitFormToAnalyzeResumeUIResponseBody {
  constructor(params:Partial<SubmitFormToAnalyzeResumeUIResponseBody>={}){

    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  role:string
  companyLogoUrl:string
  interviewer:{
    question:string,
    answer:string
  }[] = []
  facts:string[] =[]
  news:string[] =[]
  candidateQuestions:string[] =[]
}


export class SubmitFormToAnalyzeResumeAPIRequestBody {
  constructor(params:Partial<SubmitFormToAnalyzeResumeAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data: {
    jobDesc: string
    resume: {
      name:string,
      content:string,
      type:string
    }
    company?:string
  }
}

export class SubmitFormToAnalyzeResumeAPIResponseBody {
  constructor(params:Partial<SubmitFormToAnalyzeResumeAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  code:string
  data:string
}
