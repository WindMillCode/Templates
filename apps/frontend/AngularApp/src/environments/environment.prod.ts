import { silenceAllConsoleLogs, traverseClassAndRemoveAutomationForProduction } from "@core/utility/env-utils"
import { DevEnv } from "./environment.dev"
import { SITE_OFFLINE_ENUM } from "@core/site-offline/site-offline.component"


export let environment = {
  production: true
}
class ProdEnv extends DevEnv  {


  constructor(){
    super()
    // this.app.siteOffline = SITE_OFFLINE_ENUM.TRUE
    this.app.freeTrialEndsAfter = 1
    this.type = "prod"
    this.backendDomain0 = "https://api.windmillcode.com"
    this.app.firebaseStorageImageUrl ="https://firebasestorage.googleapis.com/v0/b/windmillcodesite.appspot.com/o/"
    silenceAllConsoleLogs()
    traverseClassAndRemoveAutomationForProduction(this)
  }
}


export let ENV =   new ProdEnv()
