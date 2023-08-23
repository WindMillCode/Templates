import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { concatMap, delay, iif, map, of, Subject, switchMap, tap, timeout, timer } from 'rxjs';
import {WmlButtonZeroParams} from "@windmillcode/angular-wml-button-zero";
import { replaceValuesWithPaths, WMLCustomComponent, WMLUIProperty } from '@windmillcode/angular-wml-components-base';
import { FormsService } from '../forms/forms.service';

import { WMLPanelItemParams, WMLPanelParams } from '@windmillcode/angular-wml-panel';
import { PanelCartContainerComponent, PanelCartContainerParams } from '@shared/components/panel-cart-container/panel-cart-container.component';
import {StoreServiceCartItem} from './models';
import {listProductsLoad, listProductsSuccess, ListProductsUIRequestBody, ListProductsUIResponseBody,} from "./listProducts";
import {purchaseProductsLoad, purchaseProductsSuccess, PurchaseProductsUIRequestBody, PurchaseProductsUIResponseBody,} from "./purchaseProducts";
import { WmlTableZeroParams } from '@windmillcode/angular-wml-table-zero';
import { BaseService } from '@core/base/base.service';
import {  updateWebStorage } from '@core/utility/common-utils';
import { AccountsService } from '../accounts/accounts.service';
import enTranslations from "src/assets/i18n/en.json";
import { WmlNotifyBarType } from '@windmillcode/angular-wml-notify';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    public http:HttpClient,
    public utilService:UtilityService,
    public formsService:FormsService,
    public baseService:BaseService,
    public accountsService:AccountsService
  ) {

  }

  useAiPricing = false
  carts:Array<StoreServiceCartItem[]> = [[]]
  currentCart = this.carts[0]
  cartSubj = new Subject<"addCart"|"removeCart"|"addItem"|"removeItem">()
  cartPanelItemParams= (()=>{
    let panelItem = new WMLPanelItemParams({
      custom:new WMLCustomComponent<PanelCartContainerComponent,PanelCartContainerParams>({
        cpnt:PanelCartContainerComponent
      })
    })
    panelItem.custom.params =  new PanelCartContainerParams({
      close:panelItem.close
    })

    return panelItem
  })()
  cartPanelParams = new WMLPanelParams({
    container:new WMLUIProperty({
      class:"StoreServiceView"
    }),
    items:[this.cartPanelItemParams]
  })
  payments =  (()=>{
    let payments
    try{
      payments = Square.payments(ENV.sqaure.appID, ENV.sqaure.locationId)
    }
    catch(e){
      this.baseService.generateWMLNote("StoreService.wmlNotify.squarePayments",WmlNotifyBarType.Error)
    }
    return payments
  })()

  addToCart = ()=>{

  }
  buyNow = ()=>{
    this.utilService.router.navigateByUrl(ENV.nav.urls.storeCheckout)
  }
  generateAddToCartBtn = (clickMethod = this.addToCart)=> new WmlButtonZeroParams({
    text:new WMLUIProperty({
      text:"StoreService.addToCartBtn"
    }),
    button:new WMLUIProperty({
      click:clickMethod
    })
  })
  generateBuyNowBtn = (clickMethod = this.buyNow)=> new WmlButtonZeroParams({
    text:new WMLUIProperty({
      text:"StoreService.buyNowBtn"
    }),
    button:new WMLUIProperty({
      click:clickMethod
    })
  })
  navToProductDetailsPage =(id:string)=>{
    this.utilService.router.navigate([ENV.nav.urls.storeProductDetail,id])
  }


  // @ts-ignore
  listProducts:WmlTableZeroParams["tablePredicate"] = (uiBody =new ListProductsUIRequestBody({pageSize:2}),raw = false)=>{

    this.baseService.openOverlayLoading()
    let {visitedLinks}= this.baseService;
    // @ts-ignore
    let {darkMode} = JSON.parse(localStorage.getItem(ENV.classPrefix.app))

    return iif(
    ()=>ENV.storeService.listProducts.automate,
      of(new ListProductsUIResponseBody()),

      of(null)
      .pipe(
        switchMap(()=>{
          return this.accountsService.onAuthStateChangedEvent
        }),
        concatMap(()=>{
          return listProductsLoad(uiBody,visitedLinks,darkMode,this.useAiPricing,this.accountsService.currentUser)
        }),
        concatMap((apiBody)=>{
          return this.http
          .post(ENV.storeService.listProducts.url(),apiBody)
          .pipe(
            raw ? tap() : map(listProductsSuccess(uiBody,this.navToProductDetailsPage)),
            this.baseService.closeOverlayLoading
          )

      })
      )

    )
  }

  productTableParams:WmlTableZeroParams =  new WmlTableZeroParams({
    paramsTextContent:replaceValuesWithPaths(enTranslations.ProductsMain.WMLTable,"ProductsMain.WMLTable."),
    instructionStackCachingLimit:this.useAiPricing?  0:3,
    currentRowType:0,
    changeRowTypeBasedOnWindowSizeIsPresent:false,
    tablePredicate:  this.listProducts,

  })

  purchaseProducts = (uiBody:PurchaseProductsUIRequestBody,raw = false)=>{

    this.baseService.openOverlayLoading()
    return iif(
    ()=>ENV.storeService.purchaseProducts.automate,
      of(new PurchaseProductsUIResponseBody()),

      purchaseProductsLoad(uiBody)
        .pipe(
          concatMap((apiBody)=>{
            return this.http
            .post(ENV.storeService.purchaseProducts.url(),apiBody)
            .pipe(raw ? tap() : tap(purchaseProductsSuccess),
            this.baseService.closeOverlayLoading
          )
        })
      )
    )
  }



}




