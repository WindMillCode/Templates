import { silenceAllConsoleLogs, traverseClassAndRemoveAutomationForProduction } from "@core/utility/env-utils"
import { DevEnv } from "./environment.dev"


export let environment = {
  production: true
}
class PreviewEnv extends DevEnv  {


  constructor(){
    super()
    this.app.freeTrialEndsAfter = 5
    this.type = "preview"
    this.backendDomain0 = "https://api.preview.windmillcode.com"
    silenceAllConsoleLogs()
    traverseClassAndRemoveAutomationForProduction(this)
    this.app.firebaseStorageImageUrl ="https://firebasestorage.googleapis.com/v0/b/windmillcodesite.appspot.com/o/"
    this.firebase.config ={
      ...this.firebase.config,
      authDomain: "windmillcode.com",
    }
  }
}


export let ENV =   new PreviewEnv()
