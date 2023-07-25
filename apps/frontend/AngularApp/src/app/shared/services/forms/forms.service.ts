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

  productsDetailMain = {
    mainForm:new FormGroup({
      [ENV.productsDetailMain.mainForm.titleFormControlName]:new FormControl(""),
      [ENV.productsDetailMain.mainForm.imgFormControlName]:new FormControl(""),
      [ENV.productsDetailMain.mainForm.idFormControlName]:new FormControl(""),
      [ENV.productsDetailMain.mainForm.quantityFormControlName]:new FormControl("",[
        Validators.required,
        Validators.min(0),
        RxwebValidators.digit()
      ]),
      [ENV.productsDetailMain.mainForm.colorFormControlName]:new FormArray([],Validators.required),
      [ENV.productsDetailMain.mainForm.sizeFormControlName]:new FormArray([],Validators.required),
    })
  }



}
