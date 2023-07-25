// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// wml components
import { WmlNotifyNGXTranslateModule} from '@windmillcode/angular-wml-notify';
import { WmlPopupNGXTranslateModule} from '@windmillcode/angular-wml-popup';
import { WmlFieldNGXTranslateModule} from '@windmillcode/angular-wml-field';
import { WmlFormNGXTranslateModule} from '@windmillcode/angular-wml-form';
import { WmlInputNGXTranslateModule} from '@windmillcode/angular-wml-input';
import {WmlSliceboxModule} from '@windmillcode/angular-wml-slicebox';
import {PenroseModule} from "@windmillcode/penrose";
import { WmlPanelNGXTranslateModule} from "@windmillcode/angular-wml-panel";
import { WmlMobileNavZeroNGXTranslateModule} from "@windmillcode/angular-wml-mobile-nav-zero";
import { WmlTableZeroNGXTranslateModule} from "@windmillcode/angular-wml-table-zero";
import { WmlInfiniteDropdownNGXTranslateModule} from "@windmillcode/angular-wml-infinite-dropdown";
import { WmlButtonZeroNGXTranslateModule} from '@windmillcode/angular-wml-button-zero';
import { WmlTabsNGXTranslateModule} from '@windmillcode/angular-wml-tabs'
import { WmlOptionsNGXTranslateModule } from '@windmillcode/angular-wml-options';

let modules = [
  PenroseModule,
  WmlFieldNGXTranslateModule,
  WmlFormNGXTranslateModule,
  WmlInputNGXTranslateModule,
  WmlNotifyNGXTranslateModule,
  WmlPopupNGXTranslateModule,
  WmlMobileNavZeroNGXTranslateModule,
  WmlInfiniteDropdownNGXTranslateModule,
  WmlTableZeroNGXTranslateModule,
  WmlButtonZeroNGXTranslateModule,
  WmlTabsNGXTranslateModule,
  WmlSliceboxModule,
  WmlPanelNGXTranslateModule,
  WmlOptionsNGXTranslateModule
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    ...modules
  ],
  exports:[
    ...modules

  ]
})
export class WmlComponentsModule { }
