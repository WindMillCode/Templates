import { FormArray, FormGroup } from '@angular/forms';
import { WMLFileUploadItem } from '@windmillcode/angular-wml-file-manager';

export let WMLValidatorFileExtensions = (params:{ext:string[]}) => {
  return (c: FormArray) => {
    let validatorObj = null
    // until rxweb wants to work properly
    // let fn = RxwebValidators.extension({extensions:['docx','pdf'],isExcludeExtensions:true})

    // c.value
    // .map((file:WMLFileUploadItem )=>{
    //   let fileControl = new FormControl([file.file])
    //   let result = fn(fileControl)
    //   console.log(result)

    // })
    let allValidFiles = c.value.every((item:WMLFileUploadItem )=>{

      let splitText = item.file.name.split(".");
      let extension = splitText[splitText.length - 1];

      return params.ext.includes(extension)
    })
    if(!allValidFiles){
      validatorObj = {
        extension:true
      }
    }
    return validatorObj
  };
};


export let WMLValidatorConditionalRequired =(predicate:Function,fields:string[] =[])=>{

  return (parent:FormGroup)=>{
    predicate(fields,parent)


    return null
  }
}


export let WMLValidatorConditionalRequiredPredicate = (fields:Array<string>,c:FormGroup)=>{

  let groupRequired = !fields.some((field)=>{
    let targetControl = c.controls[field]
    let myField = targetControl.value
    let required = ["",undefined,null].includes(myField )
    return !required
  })
  fields.forEach((field)=>{
    let targetControl = c.controls[field]
    let myField = targetControl.value
    let required = ["",undefined,null].includes(myField )

    if(groupRequired){
      if(required){
        targetControl.setErrors({required:true})
      }
    }
    else{
      let errors = targetControl.errors ??{}
      delete errors.required
      if(Object.keys(errors).length===0){
        targetControl.setErrors(null)
      }
      else{
        targetControl.setErrors(errors)
      }
    }
  })



}
