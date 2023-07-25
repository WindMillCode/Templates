import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { ENV } from '@env/environment';
import { concatMap, iif, map, Observable, of, take, tap } from 'rxjs';
import { WmlTableZeroParams } from '@windmillcode/angular-wml-table-zero';
import enTranslations from "src/assets/i18n/en.json";
import { replaceValuesWithPaths } from '@windmillcode/angular-wml-components-base';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    public http:HttpClient,
    public utilService:UtilityService
  ) { }

  productTableParams:WmlTableZeroParams =  new WmlTableZeroParams({
    paramsTextContent:replaceValuesWithPaths(enTranslations.ProductsMain.WMLTable,"ProductsMain.WMLTable."),

  })
}
