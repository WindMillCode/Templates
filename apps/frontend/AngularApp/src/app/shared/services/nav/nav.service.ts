import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from '@core/utility/utility.service';
import { WmlMobileNavZeroParams } from '@windmillcode/angular-wml-mobile-nav-zero';
import enTranslations from "src/assets/i18n/en.json";
import { WMLInfiniteDropdownOptionBase, WmlInfiniteDropdownOption, WmlInfiniteDropdownParams } from '@windmillcode/angular-wml-infinite-dropdown';
import { CSSVARS } from '@core/utility/common-utils';
import { WMLCustomComponent, WMLRoute, WMLUIProperty, replaceValuesWithPaths } from '@windmillcode/angular-wml-components-base';
import { ENV } from '@env/environment';
import { BaseService } from '@core/base/base.service';

import { NavigationEnd } from '@angular/router';
import { filter, tap } from 'rxjs';
import { AccountService } from '../account/account.service';
import { LogoDisplayZeroComponent } from '@shared/components/logo-display-zero/logo-display-zero.component';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(
    public http:HttpClient,
    public utilService:UtilityService,
    public baseService:BaseService,
    public accountService:AccountService
  ) { }


  updatePageBasedOnLoginStatus = ()=>{
    let [homeDesktop,aboutDesktop,storeDesktop,signUpDesktop,signInDesktop,profileDesktop,signOutDesktop] = this.desktopNav
    let [,homeMobile,aboutMobile,storeMobile,signUpMobile,signInMobile,profileMobile,signOutMobile] = this.mobileNav.items
    .map((dropdown)=>{
      // @ts-ignore
      return dropdown.options[0].custom.params
    })

    return this.accountService.onAuthStateChangedEvent
    .pipe(
      tap(()=>{
        signInMobile.isPresent = signInDesktop.isPresent = !(!!this.accountService.currentUser)
        signUpMobile.isPresent = signUpDesktop.isPresent = !(!!this.accountService.currentUser)
        profileMobile.isPresent = profileDesktop.isPresent = !!this.accountService.currentUser
        signOutMobile.isPresent = signOutDesktop.isPresent =!!this.accountService.currentUser
        this.triggerMobileNaveChangeDetection()
      })
    )
  }


  generateDesktopNavItems = ()=>{
    let desktopNav:any =replaceValuesWithPaths(enTranslations.NavZero.mainOptions,"NavZero.mainOptions.")
    desktopNav = desktopNav.map((text)=>{
      let route = new WMLRoute({
        text:text[0]
      })
      return route
    })
    this.setActionsForDesktopNavItems(desktopNav)
    this.updateIdsForDesktopNavItems(desktopNav)
    return desktopNav
  }
  setActionsForDesktopNavItems =  (navItems:WMLRoute[])=>{
    let [home,about,store,signUp,signIn,profile,signOut,language] = navItems
    navItems.forEach((option)=>{
      option.click=this.baseService.openFeatureIsComingSoon
    })

    ;[home,store].forEach((option,index0)=>{
      let route = ["home","storeProducts"][index0]
      option.click=()=>{
        this.utilService.router.navigateByUrl(ENV.nav.urls[route])
      }
    })


  }

  updateIdsForDesktopNavItems = (navItems:WMLRoute[])=>{
    navItems.forEach((item,index0)=>{
      item.id = ENV.nav.idPrefixes.nav + ['Home', 'About', 'Store', 'Signup', 'Signin', 'Profile', 'Signout', 'Language'][index0]+"Link"
    })
  }

  desktopNav =  (()=>{
    let desktopNav =this.generateDesktopNavItems()
    return desktopNav
  })()

  triggerMobileNaveChangeDetection = ()=>{
    this.mobileNav.items
    .forEach((dropdown)=>{
      try{
        // @ts-ignore
         dropdown.options[0].custom.params.detectChangeSubj.next()
      }
      catch(e){}
    })
  }
  openMobileNav= ()=>{
    this.mobileNav.open()
}

  generateDropdown = (
    interactionType:WmlInfiniteDropdownParams["customize"]["interactionType"]="click" ):WmlInfiniteDropdownParams[]=>{

      let i18nDropdown:any = replaceValuesWithPaths(enTranslations.NavZero.mainOptions,"NavZero.mainOptions.")
      let dropdown =  i18nDropdown.map((items)=>{
      let dropdown = new WmlInfiniteDropdownParams({
        items
      })

      return dropdown
    })
    return dropdown
  }

  addLogoToMobileNav = (mobileNav)=> {
    let logoDisplayOptions = new WmlInfiniteDropdownOption({
      class: "MobileNavLogoDisplay",
      custom: new WMLCustomComponent({
        cpnt: LogoDisplayZeroComponent
      })
    });
    let logoDisplay = new WmlInfiniteDropdownParams({
      items: [logoDisplayOptions],
    });
    mobileNav.items.unshift(logoDisplay);
  }

  updateMobileDropdownNavOptions = (dropdowns:WmlInfiniteDropdownParams[])=>{
    let dropdownOptions = dropdowns
    .map((dropdown)=>{
      return dropdown.options[0]
    });
    let [logoMobile,homeMobile,aboutMobile,storeMobile,signUpMobile,signInMobile,profileMobile,signOutMobile,langMobile] = dropdownOptions
    dropdownOptions
    .forEach((item)=>{
      item.click = this.baseService.openFeatureIsComingSoon
    })

    ;[homeMobile,storeMobile]
    .forEach((option,index0)=>{
      let route = ["home","storeProducts"][index0]
      option.click=()=>{
        this.utilService.router.navigateByUrl(ENV.nav.urls[route])
        this.mobileNav.close()
      }
    })
    langMobile.click = ()=>{
      this.mobileNav.close()
    }


  }

  mobileNav = (()=>{
    let  mobileNav = new WmlMobileNavZeroParams({
      items:this.generateDropdown()
    })
    this.addLogoToMobileNav(mobileNav);
    this.updateMobileDropdownNavOptions(mobileNav.items)

    return mobileNav
  })()


}

