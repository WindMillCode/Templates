import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { WmlMobileNavZeroParams } from '@windmillcode/angular-wml-mobile-nav-zero';
import enTranslations from 'src/assets/i18n/en.json';
import {
  WMLInfiniteDropdownOptionBase,
  WmlInfiniteDropdownOption,
  WmlInfiniteDropdownParams,
} from '@windmillcode/angular-wml-infinite-dropdown';
import { CSSVARS } from '@core/utility/common-utils';
import {
  WMLCustomComponent,
  WMLUIProperty,
  replaceValuesWithPaths,
} from '@windmillcode/angular-wml-components-base';
import { ENV } from '@env/environment';
import { BaseService } from '@core/base/base.service';
import { LogoDisplayZeroComponent } from '@shared/components/logo-display-zero/logo-display-zero.component';
import { StoreService } from '../store/store.service';
import { NavigationEnd } from '@angular/router';
import { filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  constructor(
    public http: HttpClient,
    public utilService: UtilityService,
    public baseService: BaseService,
    public storeService: StoreService
  ) {}



  mobileParams: WmlMobileNavZeroParams;
  updateDropdownOptionStyles = (dropdowns) => {
    dropdowns.forEach((dropdown) => {
      dropdown.options.forEach((option) => {
        option.style = {
          borderLeft: 'calc(2/16 * 1rem) solid ' + CSSVARS.wmlsecondary,
          background: 'transparent',
        };
      });
    });
  };

  addIdsToOptions = (dropdowns: WMLInfiniteDropdownOptionBase[]) => {
    dropdowns.forEach((option, index0) => {
      let id = [
        'homeOption',
        'aboutOption',
        'mediaOption',
        'coursesOption',
        'pricingOption',
        'contactOption',
        'blogOption',
        'eventsOption',
        'labsOption',
        'onlineOption',
        'inPersonOption',
        'plansOption',
        'storeOption',
        'donateOption',
        'productsOption',
        'cartOption',
        'checkoutOption',
      ][index0];
      option.id = ENV.idPrefix.nav + id;
    });
  };
  updateDropdownOptions = (dropdowns: WmlInfiniteDropdownParams[]) => {
    let [
      homeOption,
      aboutOption,
      mediaOption,
      coursesOption,
      pricingOption,
      contactOption,
    ] = dropdowns.map((dropdown) => {
      return dropdown.options[0];
    });
    let [blogOption, eventsOption, , labsOption] = (
      mediaOption as WmlInfiniteDropdownOption
    ).dropdown.options;
    let [onlineOption, inPersonOption] = (
      eventsOption as WmlInfiniteDropdownOption
    ).dropdown.options;
    let [plansOption, storeOption, , donateOption] = (
      pricingOption as WmlInfiniteDropdownOption
    ).dropdown.options;
    let [productsOption, cartOption, checkoutOption] = (
      storeOption as WmlInfiniteDropdownOption
    ).dropdown.options;

    this.addIdsToOptions([
      homeOption,
      aboutOption,
      mediaOption,
      coursesOption,
      pricingOption,
      contactOption,
      blogOption,
      eventsOption,
      labsOption,
      onlineOption,
      inPersonOption,
      plansOption,
      storeOption,
      donateOption,
      productsOption,
      cartOption,
      checkoutOption,
    ]);

    [
      homeOption,
      aboutOption,
      contactOption,
      blogOption,
      onlineOption,
      inPersonOption,
      productsOption,
      checkoutOption,
    ].forEach((option, index0) => {
      let route = [
        'home',
        'about',
        'contact',
        'blog',
        'onlineEvents',
        'inPersonEvents',
        'storeProducts',
        'storeCheckout',
      ][index0];
      option.click = () => {
        this.closeMobileParentDropdowns([mediaOption, pricingOption]);
        this.mobileParams.close();
        this.utilService.router.navigateByUrl(ENV.nav.urls[route]);
      };
    });
    [coursesOption, labsOption, plansOption, donateOption].forEach((option) => {
      option.click = this.baseService.openFeatureIsComingSoon;
    });
    [cartOption].forEach((option) => {
      option.click = () => {
        this.closeMobileParentDropdowns([mediaOption, pricingOption]);
        this.mobileParams.close();
        this.storeService.cartPanelItemParams.open();
      };
    });
  };

  ensureMobileOpensToTheSide = (
    mobileDropdown: WmlInfiniteDropdownParams[]
  ) => {
    mobileDropdown.forEach((dropdown) => {
      dropdown.options.map((item) => {
        if (item instanceof WmlInfiniteDropdownParams) {
          dropdown.openClass = 'WmlInfiniteDropdownMainStates0';
        }
      });
    });
  };

  initMobileParams = (dropdown) => {
    this.mobileParams = new WmlMobileNavZeroParams({
      items: dropdown,
    });
  };

  generateDropdown = (
    interactionType: WmlInfiniteDropdownParams['customize']['interactionType'] = 'click'
  ): WmlInfiniteDropdownParams[] => {
    let i18nDropdown: any = replaceValuesWithPaths(
      enTranslations.NavZero.mainOptions,
      'NavZero.mainOptions.'
    );
    let dropdown = i18nDropdown.map((items) => {
      let dropdown = new WmlInfiniteDropdownParams({
        items,
        customize: {
          interactionType,
          option: new WMLUIProperty({
            style: {
              background: CSSVARS.wmlgradient1,
              borderBottom: '',
            },
          }),
        },
      });

      return dropdown;
    });
    this.updateDropdownOptions(dropdown);
    return dropdown;
  };

  mobileDropdowns = (() => {
    let dropdown = this.generateDropdown();
    this.shiftMobileNavItemsAround(dropdown);
    let logoDisplayOptions = new WmlInfiniteDropdownOption({
      class: 'MobileNavLogoDisplay',
      custom: new WMLCustomComponent({
        cpnt: LogoDisplayZeroComponent,
        params: {},
      }),
    });
    let logoDisplay = new WmlInfiniteDropdownParams({
      items: [logoDisplayOptions],
      customize: {
        // @ts-ignore
        option: new WMLUIProperty({
          style: {
            background: CSSVARS.wmlgradient1,
            borderBottom: '',
          },
        }),
      },
    });
    dropdown.unshift(logoDisplay);
    return dropdown;
  })();

  desktopDropdowns = (() => {
    let mainDropdowns = this.generateDropdown('hover');
    this.updateDropdownOptionStyles(mainDropdowns);
    this.initMobileParams(this.mobileDropdowns);
    this.ensureMobileOpensToTheSide(this.mobileDropdowns);
    return mainDropdowns;
  })();

  openMobileNav = () => {
    this.mobileParams.open();
  };

  private closeMobileParentDropdowns(
    options: Array<WmlInfiniteDropdownOption | any>
  ) {
    options.forEach((optionHead) => {
      optionHead.closeDropdown();
    });
  }

  private shiftMobileNavItemsAround(dropdown: any[]) {
    // @ts-ignore
    let mediaOptions = dropdown[2].options[1].options;
    // @ts-ignore
    let eventOptions = dropdown[2].options[1].options[2].options;
    mediaOptions.splice(1, 2, ...eventOptions);
    let pricingOptions = dropdown[4].options[1].options;
    let storeOptions = dropdown[4].options[1].options[2].options;
    pricingOptions.splice(1, 2, ...storeOptions);
  }
}
