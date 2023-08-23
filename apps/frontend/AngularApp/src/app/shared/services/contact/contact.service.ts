import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { concatMap, iif, map, of,             tap } from 'rxjs';
import { SubmitNewClientUIRequestBody, SubmitNewClientUIResponseBody, submitNewClientLoad, submitNewClientSuccess } from './submitNewClient';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    public http:HttpClient,
    public utilityService:UtilityService
  ) { }

  submitNewClient = (uiBody:SubmitNewClientUIRequestBody,raw = false)=>{

    return iif(
    ()=>ENV.contactService.submitNewClient.automate,
      of(new SubmitNewClientUIResponseBody()),

      submitNewClientLoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
            .post(ENV.contactService.submitNewClient.url(),apiBody)
            .pipe(raw ? tap() : map(submitNewClientSuccess))
        })
      )
    )
  }

}


