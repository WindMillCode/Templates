import { FormArray } from '@angular/forms';
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
