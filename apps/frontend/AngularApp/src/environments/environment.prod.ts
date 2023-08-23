import { silenceAllConsoleLogs, traverseClassAndRemoveAutomationForProduction } from "@core/utility/env-utils"
import { DevEnv } from "./environment.dev"


export let environment = {
  production: true
}
class ProdEnv extends DevEnv  {


  constructor(){
    super()
    this.app.freeTrialEndsAfter = 1
    this.type = "prod"
    this.backendDomain0 = "https://api.windmillcode.com"
    this.app.firebaseStorageImageUrl ="https://firebasestorage.googleapis.com/v0/b/windmillcodesite.appspot.com/o/"
    silenceAllConsoleLogs()
    traverseClassAndRemoveAutomationForProduction(this)
    this.firebase.config ={
      ...this.firebase.config,
      authDomain: "windmillcode.com",
    }
    this.sqaure.appID ="sq0idp-XNrOiSpEkLA2F6wNNQ_ukw"
  }
}


export let ENV =   new ProdEnv()
