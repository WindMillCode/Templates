import { FormArray, FormControl, FormGroup } from "@angular/forms"
import { WMLField, WmlLabelParams } from "@windmillcode/angular-wml-field"
import { WmlInputComponent, WmlInputParams } from "@windmillcode/angular-wml-input"

export let useFormControlNamesAsFieldVariableNames =(param:{[k:string]:string})=>{
  return Object.values(param)
  .map((val)=>{
    return val+"Field"
  })
}

export   let createWMLFormField = (params:GenerateFieldParams<any>)=>{
  let {
    labelValue,
    fieldFormControlName,
    fieldParentForm,
    errorMsgs,
    selfType,
    fieldCustomParams,
    id
  } = params
  let wmlField:WMLField
  wmlField =  new WMLField({
    type: "custom",
    custom: {

      selfType: selfType ?? "standalone",
      fieldParentForm,
      fieldFormControlName,
      labelValue,
      fieldCustomCpnt:WmlInputComponent,
      errorMsgs:errorMsgs??{
        required:"global.errorRequired"
      },
      fieldCustomMeta:new WmlInputParams({
        ...fieldCustomParams,
        wmlField
      })
    }
  })
  wmlField.view.id = id
  return wmlField
}

export class GenerateFieldParams<F=WmlInputParams> {
  constructor(params:Partial<GenerateFieldParams<F>>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  labelValue?:string
  fieldFormControlName:string
  fieldParentForm:FormGroup
  errorMsgs:WmlLabelParams["errorMsgs"] ={}
  selfType:WMLField["self"]["type"] ="standalone"
  fieldCustomParams?:F
  id?:string

}

export let resetFormControls =(formGroup: FormGroup | FormArray)=> {
  // Iterate through all the controls in the form group
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);

    if (control instanceof FormGroup) {
      // Recursively reset controls in nested FormGroup
      resetFormControls(control);
    } else if (control instanceof FormControl) {
      // Reset FormControl to its initial state
      control.reset();
    } else if (control instanceof FormArray) {
      // Reset FormArray to its initial state
      control.clear();
      control.markAsPristine()
    }
  });
}

export let createI18nErrorMsgsBasedOnValidations = (prefix:string,val:string,checklist:Array<string>=[])=>{
  let obj = checklist
  .map((errorKey)=>{
    let errorVal = [prefix,val,"error",errorKey].join(".")
    return [errorKey,errorVal]
  })
  return Object.fromEntries(obj)

}
