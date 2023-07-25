import { SITE_OFFLINE_ENUM } from '@core/site-offline/site-offline.component';
import { makeTitleCase } from '@core/utility/common-utils';
import { WMLEndpoint } from '@windmillcode/angular-wml-components-base';

export let environment = {
  production: false
}

export class DevEnv {

  type:"dev" | "preview" | "prod" = "dev"
  endpointMsgCodes = {
    'success':'OK',
    'error':'ERROR',
  }

  errorCodes = {
  }

  app=(()=>{
    let firebaseStorageImageUrl = "http://127.0.0.1:9199/v0/b/windmillcodesite.appspot.com/o/"
    let app ={
      backendHealthCheck:() =>this.backendDomain0 + "/healthz/",
      siteOffline:SITE_OFFLINE_ENUM.FALSE,
      freeTrialEndsAfter:Infinity,
      firebaseStorageImageUrl,
      getImageUrlFromFirebaseStorage:(resourcePath?:string)=>{
        return `${app.firebaseStorageImageUrl}${encodeURIComponent(resourcePath)}?alt=media`
      }
    }
    return app
  })()


  backendDomain0 =" https://example.com:5014"
  frontendDomain0 ="https://example.com:4214"
  classPrefix= {
    app:"App",
    products:"Products"
  }

  nav = (()=>{
    let idPrefixes
    let nav = {
      urls:{
        home:"/",
        homeAlt:"/home",
        about:"/about",
        initialURL:"",
        siteOffline:"/site-offline",
        storeProducts:"/store/products",
        storeCheckout:"/store/checkout",
        storeProductDetail:"/store/product-detail",
        privacyPolicy:"/legal/privacy-policy",
        termsAdConditions:"/legal/terms-and-conditions",
        signUp:"/auth/sign-up",
        signIn:"/auth/sign-in"
      },
      idPrefixes
    }

    idPrefixes = Object.entries(nav.urls).map(([key,val])=>{
      return [key,makeTitleCase(key)+"_"]
    })
    nav.idPrefixes =Object.fromEntries(idPrefixes)
    nav.idPrefixes.nav = "Nav_"
    return nav
  })()






  constructor(){
    // traverseClassAndRemoveAutomationForProduction(this)
  }
}

export let ENV =   new DevEnv()


