import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ENV } from '@env/environment';
import {RxwebValidators} from "@rxweb/reactive-form-validators";
@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(

  ) { }

  contactUsForm = {
    mainForm:new FormGroup({
      [ENV.contactUsForm.mainForm.nameFormControlName]:new FormControl(""),
      [ENV.contactUsForm.mainForm.emailFormControlName]:new FormControl("",[Validators.required,Validators.email]),
      [ENV.contactUsForm.mainForm.phoneFormControlName]:new FormControl(""),
      [ENV.contactUsForm.mainForm.companyFormControlName]:new FormControl(""),
      [ENV.contactUsForm.mainForm.descFormControlName]:new FormControl("",Validators.required),
    })
  }




}
