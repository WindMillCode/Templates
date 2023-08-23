import { SITE_OFFLINE_ENUM } from '@core/site-offline/site-offline.component';
import { makeTitleCase } from '@core/utility/string-utils';

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
      },
      originalConsoleObj :[]
    }
    return app
  })()


  backendDomain0 ="https://example.com:5001"
  frontendDomain0 ="https://example.com:4201"
  // backendDomain0 =" https://localhost:5001"
  // frontendDomain0 ="https://localhost:4201"
  classPrefix= {
    app:"App",
    products:"Products"
  }

  idPrefix:{[k:string]:string} ={
    nav:"Nav_"
  }

  nav = (()=>{
    let nav = {
      urls:{
        home:"/",
        homeAlt:"/home",
        about:"/about",
        contact:"/contact",
        blog:"/blog",
        onlineEvents:"/events/online",
        inPersonEvents:"/events/in-person",
        initialURL:"",
        siteOffline:"/site-offline",
        storeProducts:"/store/products",
        storeCheckout:"/store/checkout",
        storeProductDetail:"/store/product-detail",
        privacyPolicy:"/legal/privacy-policy",
        termsAdConditions:"/legal/terms-and-conditions",
        signUp:"/auth/sign-up",
        signIn:"/auth/sign-in",
        labs:"/labs",
        account:"/account",
        accountProfile:"/account/profile",
        accountBilling:"/account/billing",
        accountManageYourData:"/account/manage-your-data",
      },
    }

    let idPrefixes = Object.entries(nav.urls).map(([key,val])=>{
      return [key,makeTitleCase(key)+"_"]
    })
    this.idPrefix ={
      ...Object.fromEntries(idPrefixes),
      ...this.idPrefix
    }
    return nav
  })()

  firebase={
    config:{
      apiKey: "AIzaSyAsoFBcz3VnCmJqyefv5R2VAhuswpgIINg",
      authDomain: "127.0.0.1",
      appId: "1:159461117267:web:74b2b8198f5a4e96fc65a6",
      measurementId: "G-L9NS74L8R1"
    }
  }

  sqaure ={
    appID:"sandbox-sq0idb-02bQDPd4HhYAbErWF85rFw",
    locationId:"locationId"
  }

  contactUsForm = {
    mainForm:{
      nameFormControlName:"name",
      companyFormControlName:"company",
      emailFormControlName:"email",
      phoneFormControlName:"phone",
      descFormControlName:"desc"
    }
  }

  productsDetailMain = {
    mainForm:{
      titleFormControlName:"title",
      imgFormControlName:"img",
      idFormControlName:"id",
      quantityFormControlName:"quantity",
      colorFormControlName:"color",
      sizeFormControlName:"size",
    }
  }

  accountBillingZero = {
    addressForm:{
      streetAdrFormControlName:"streetAdr",
      secondaryAdrFormControlName:"secondaryAdr",
      cityFormControlName:"city",
      stateFormControlName:"state",
      zipcodeFormControlName:"zipcode",
      countryFormControlName:"country",
    }
  }



  accountsService = {
    createUserInAPI:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/accounts/users/create",
    }),
    listUsers:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/accounts/users/list",
    }),
    updateAddress:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/accounts/users/update",
    }),
    deleteUser:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/accounts/users/delete",
    }),
    addCardToUser:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/accounts/cards/create",
    }),
    listCards:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/accounts/cards/list",
    }),
    deleteCards:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/accounts/cards/delete",
    }),
    getSquareCustomerIDVIAFirebaseID:new WMLEndpoint({
      url:()=>this.backendDomain0 + "/accounts/get_square_customer_id_via_firebase_access_token"
    }),
    exportUsers:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/accounts/users/export",
    })
  }

  blogService = {
    listBlogs:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/blogs/list",
    })
  }

  storeService= {
    listProducts:new WMLEndpoint({
      url:()=>this.backendDomain0 + "/store/products/list"
    }),
    purchaseProducts:new WMLEndpoint({
      url:()=>this.backendDomain0 + "/store/products/purchase"
    })
  }
  eventService ={
    getOnlineEvents:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/events/online",
    }),
    getInPersonEvents:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/events/in-person",
    }),
  }

  contactService = {
    submitNewClient:new WMLEndpoint({
      url:()=> this.backendDomain0 + "/contact/submit-new-client",
    })
  }

  constructor(){
    this.app.originalConsoleObj = Object.entries(console)
    // traverseClassAndRemoveAutomationForProduction(this)
  }
}

export let ENV =   new DevEnv()


