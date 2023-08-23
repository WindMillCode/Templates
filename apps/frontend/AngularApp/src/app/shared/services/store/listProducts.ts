import { WMLAPIPaginationRequestModel, WMLAPIPaginationResponseModel, WMLCustomComponent, WMLImage, WMLUIProperty, generateRandomNumber } from "@windmillcode/angular-wml-components-base"
import { Observable, concatMap, defer, of, take } from "rxjs"
import {WMLTableZeroTablePredicateReturnValue, WmlTableZeroItemParams, WmlTableZeroSampleCardComponent, WmlTableZeroSampleCardParams, WmlTableZeroSampleCardPriceParams} from "@windmillcode/angular-wml-table-zero";
import { ENV } from "@env/environment";
import { StoreService } from "./store.service";
import { StoreServiceTableCardItem } from "./models";
;
import { AccountsService, AccountsServiceUser } from "../accounts/accounts.service";
import { transformObjectKeys } from "@core/utility/common-utils";
import { transformFromCamelCaseToSnakeCase, transformFromSnakeCaseToCamelCase } from "@core/utility/string-utils";


let navigatorObs$ = (apiBody:ListProductsAPIRequestBody)=> defer(
  ()=>new Promise((res,rej)=>{
    navigator.geolocation.getCurrentPosition(
      (position)=>{
        apiBody.data.ai_data.location = {
          lat:position.coords.latitude,
          lng:position.coords.longitude
          // lat:generateRandomNumber(),
          // lng:generateRandomNumber()
        }
        res(apiBody)
      },
      ()=>{
        res(apiBody)
      }
    )
  })
)
export let listProductsLoad = (
  uiBody:ListProductsUIRequestBody,
  visitedLinks:Array<string>,
  darkMode:boolean,
  useAiPricing:boolean,
  currentUser?:AccountsServiceUser
): Observable<ListProductsAPIRequestBody>=>{


  let aiData = transformObjectKeys({
    visitedLinks,
    darkMode,
    useAiPricing
  },transformFromCamelCaseToSnakeCase)
  if(currentUser){
    let {user}= currentUser
    Object.assign(
      aiData,
      transformObjectKeys({
        accountCreated:user.metadata.creationTime,
        lastSignInTime:user.metadata.lastSignInTime,
        isAnonymous:user.isAnonymous,
        name:user.displayName,
        email:user.email,
        emailVerified:user.emailVerified

      },transformFromCamelCaseToSnakeCase)
    )
  }
  let apiBody = new ListProductsAPIRequestBody(transformObjectKeys({
    data:{
      pageData:Object.assign({},uiBody),
      aiData
    }
  },transformFromCamelCaseToSnakeCase))
  // @ts-ignore
  apiBody.data.page_data.page_num = parseInt(apiBody.data.page_data.page_num)
  // @ts-ignore
  apiBody.data.page_data.page_size = parseInt(apiBody.data.page_data.page_size)
  // @ts-ignore
  return navigatorObs$(apiBody)
  .pipe(
    take(1),
  )

}

export let listProductsSuccess = (
  uiReqBody:ListProductsUIRequestBody,
  navToProductDetailsPage:StoreService["navToProductDetailsPage"]
)=>(apiBody:ListProductsAPIResponseBody):ListProductsUIResponseBody=>{



  let apiData = transformObjectKeys(apiBody.data,transformFromSnakeCaseToCamelCase)
  let uiResBody = new WMLAPIPaginationResponseModel<WmlTableZeroItemParams>(apiData)
  uiResBody.data =apiBody.data.data.map((row)=>{

    row.image_urls = row.image_urls.map((url)=>{
      return ENV.app.getImageUrlFromFirebaseStorage(url)
    })
    let tableRow = new WmlTableZeroItemParams({
      businessData:{
        price:row.price.business,
        subtitle:row.subtitle,
        title:row.title,
      },
    })
    tableRow.customCpnts[0].custom =new WMLCustomComponent({
      cpnt:WmlTableZeroSampleCardComponent,
      params:new StoreServiceTableCardItem({
        title : new WMLUIProperty({
          text:row.title
        }),
        subtitle : new WMLUIProperty({
          text:row.subtitle
        }),
        price : new WmlTableZeroSampleCardPriceParams({
          text:row.price.display
        }),
        img:new WMLImage({
          src:row.image_urls[0],
          alt:"StoreService.merchAlt"
        }),
        metadata:row
      })
    })
    let cardParams:WmlTableZeroSampleCardParams = tableRow.customCpnts[0].custom.params

    cardParams.container.click = ()=>{
      navToProductDetailsPage(row.id)
    }
    return tableRow
  })
  let uiBody = new ListProductsUIResponseBody({
    req:uiReqBody,
    res:uiResBody
  })
  return uiBody
}

export class ListProductsUIRequestBody extends WMLAPIPaginationRequestModel {
  constructor(params:Partial<ListProductsUIRequestBody>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  aiMetadata?:{
    [k:string]:any
  }
}

export class ListProductsUIResponseBody extends WMLTableZeroTablePredicateReturnValue {
  constructor(params:Partial<ListProductsUIResponseBody>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}

export class ListProductsAPIRequestBody {
  constructor(params:Partial<ListProductsAPIRequestBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:{
    page_data:{
      filter:WMLAPIPaginationRequestModel["filter"]
      sort:WMLAPIPaginationRequestModel["sort"]
      page_num:WMLAPIPaginationRequestModel["pageNum"] | number
      page_size:WMLAPIPaginationRequestModel["pageSize"] | number
    },
    ai_data:{
      visited_links?:Array<string>,
      dark_mode?:boolean,
      location?:any,
      use_ai_pricing:boolean
    }
  }
}

export class ListProductsAPIResponseBody {
  constructor(params:Partial<ListProductsAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  data:WMLAPIPaginationResponseModel<ListProductsDataAPIResponseBody>
}

export class ListProductsDataAPIResponseBody {
  constructor(params:Partial<ListProductsDataAPIResponseBody>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  id: string;
  image_urls: string[];
  options:{
    key: {
      id: string;
      name: string;
    }[];
    values: {
      [id:string]: {
        id: string;
        name: string;
      }[];
    };
  }
  price: {
    business: number;
    currency: string;
    display: string;
  };
  subtitle: string;
  title: string;
  variations:{
    id: string;
    option_ids: {
      key: string;
      value: string;
    }[];
  }[]


}
