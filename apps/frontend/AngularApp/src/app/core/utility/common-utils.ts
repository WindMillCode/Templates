import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { ENV } from '@env/environment';
import { fromEvent, map } from 'rxjs';


export let makeLowerCase = new LowerCasePipe().transform
export let makeTitleCase = new TitleCasePipe().transform

export   function eventDispatcher(event: string, element: HTMLElement | Window | Element,keyboardCharCode:number =13) {

  try {
    let eventModern
    if(["keydown","keyup"].includes(event) ){
      let eventInitObj = {
        13:{
          code: 'Enter',
          key: 'Enter',
          charCode: 13,
          keyCode: 13,
          view: window,
          bubbles: true
        }
      }[keyboardCharCode]
      eventModern = new KeyboardEvent(event,eventInitObj)
    }
    else{

      eventModern = new Event(event)
    }

    element.dispatchEvent(eventModern)
  }
  catch (e) {
    let eventLegacy = document.createEvent("Event");
    eventLegacy.initEvent(event, false, true);
    element.dispatchEvent(eventLegacy)
  }
}
export function   numberParse(dimension: any /* string or array */): number {

  if (typeof dimension === "string") {
    return parseFloat(dimension.split("p")[0])
  }
  else {
    return dimension
      .map((x: string) => {
        return parseFloat(x.split("p")[0])
      })
  }
}
export function   clearArray(A: Array<any>) {
  A.splice(0,A.length)
}


export let getQueryParamByName=(name, url = window.location.href)=> {
  let urlSearchParams:any = new URLSearchParams(window.location.search);
  let params = Object.fromEntries(urlSearchParams.entries());
  return params[name]
}
export let documentQuerySelector = (selector)=>{
  return document.querySelector(selector) as HTMLElement
}
export let documentQuerySelectorAll =(selector)=> {
  return Array.from(document.querySelectorAll(selector)) as Array<HTMLElement>
}
export let   deepCopy=(obj)=>{
  return JSON.parse(JSON.stringify(obj));
}
export class LinkedList<T> {
  constructor(startVal?: T,arrayTarget?:Array<T>) {
    if(startVal){
      this._head.val = startVal;
      this.list = this._head;
    }
    else if(arrayTarget){
      this._head.val = arrayTarget[0];
      this.list = this._head;
      this.addArrayItemsToList(
        arrayTarget.slice(1)
      )

    }
    else{
      throw new Error("a startval or array is requried")
    }

  }

  moveToNextItemInList = ()=>{
    this.list = this.list.next
  }
  addArrayItemsToList = (target:Array<T>)=>{
    target
    .forEach((item)=>{
      this.addNode(item)
    })
  }

  addNode = (val) => {
    this.list.next = {
      val,
      next: null,
    };
    this.list = this.list.next;
  };

  getHead = () => {
    return this._head;
  };

  closeList = () => {
    this.list.next = this.getHead();
  };

  _head: {
    val: T;
    next: LinkedList<T>["_head"];
  } = {
    val: null as T,
    next: null as LinkedList<T>["_head"],
  };

  list:LinkedList<T>["_head"] = null;
}

export let readFileContent = (
  file: File,
  readPredicate:
    | 'readAsBinaryString'
    | 'readAsArrayBuffer'
    | 'readAsDataURL'
    | 'readAsText' = 'readAsBinaryString'
) => {
  let reader = new FileReader();
  reader[readPredicate](file);

  return fromEvent(reader as any, 'load').pipe(
    map(() => {
      let content
      if(readPredicate === "readAsBinaryString"){
        // @ts-ignore
        content = btoa(reader.result);
      }
      else{
        content = reader.result.toString();
      }

      return { content, file };
    })
  );
};

export function isPlainObject(value) {
  let toString = Object.prototype.toString
  function getTag(value) {
    if (value == null) {
      return value === undefined ? '[object Undefined]' : '[object Null]'
    }
    return toString.call(value)
  }
  function isObjectLike(value) {
    return typeof value === 'object' && value !== null
  }
  if (!isObjectLike(value) || getTag(value) != '[object Object]') {
    return false
  }
  if (Object.getPrototypeOf(value) === null) {
    return true
  }
  let proto = value
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(value) === proto
}
export let transformObjectKeys =(obj:Object,predicate)=>{
  if(["string","number","boolean","function","symbol","bigint","undefined"].includes(typeof obj)){
    return obj
  }
  let myArray = Object.entries(obj)
  .map(([key,val])=>{
    if(typeof val ==="string"){
      return [predicate(key),val]
    }
    else if( isPlainObject(val)){

      return [predicate(key),transformObjectKeys(val,predicate)]
    }
    else if(Array.isArray(val)){

      let newVal = val.map((valy,index0)=>{
        return transformObjectKeys(valy,predicate)
      })
      return [predicate(key),newVal]
    }

    return [predicate(key),val]
  })
  return Object.fromEntries(myArray)
}
export let transformFromCamelCaseToSnakeCase = (str) =>
  str[0].toLowerCase() +
  str
    .slice(1, str.length)
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export let transformFromSnakeCaseToCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('_', ''));
};

export let retriveValueFromPXUnit = (str: string) => {
  return str.match(/\d+/)[0];
};

export let setColorBasedOnHEXBackgroundColor = (color) => {
  const lum = [1, 3, 5]
    .map(
      (
        pos //get RGB colors array from the string at positions 1, 3 and 5 (0 = # character)
      ) => {
        return parseInt(color.substr(pos, 2), 16);
      }
    )
    .reduce((result, value, index) => {
      const y = [0.299 /*red*/, 0.587 /*green*/, 0.114 /*blue*/][index];
      return result + y * value; // return sum of previous results
    }, 0);

  const isDark = lum < 128;
  return isDark ? 'white' : 'black';
};

export let convertMilitaryToStandard = function (time) {
  let timeParts = time.split(':');
  let standardTime = '';

  if (parseInt(timeParts[0]) > 12) {
    timeParts[0] = timeParts[0] - 12;
    standardTime = timeParts.join(':') + ' PM';
  } else if (parseInt(timeParts[0]) === 12) {
    standardTime = timeParts.join(':') + ' PM';
  } else {
    standardTime = timeParts.join(':') + ' AM';
  }

  return standardTime;
};

export function transformPropertiesOnObject(data, predicate) {
  if (Array.isArray(data)) {
    return data.map(item => transformPropertiesOnObject(item, predicate));
  } else if (typeof data === 'object' && data !== null) {
    const transformed = {};

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const newKey = predicate(key);
        transformed[newKey] = transformPropertiesOnObject(data[key], predicate);
      }
    }

    return transformed;
  } else {
    return data;
  }
}


export enum InputTypes {
  firstName = 'given-name',
  lastName = 'family-name',
  streetNumber = 'address-line1',
  streetName = 'address-line2',
  unit = 'address-line3',
  city = 'address-level2',
  state = 'address-level1',
  postalCode = 'postal-code',
  country = 'country',
}

let root = document.querySelector(':root') as HTMLElement;
let rootStyle = () => getComputedStyle(root);
let appTransitionTime = rootStyle().getPropertyValue(
  '--wml-app-transition-time0'
);
export let CSSVARS = {
  wmlMobileFont: rootStyle().getPropertyValue('--wml-mobile-font'),
  wmlMobile: rootStyle().getPropertyValue('--wml-mobile'),
  wmlSmallMobile: rootStyle().getPropertyValue('--wml-small-mobile'),
  wmlMediumMobile: rootStyle().getPropertyValue('--wml-medium-mobile'),
  wmlTablet: rootStyle().getPropertyValue('--wml-tablet'),
  wmlTabletPortrait: rootStyle().getPropertyValue('--wml-tablet-portrait'),
  wmlTabletPortraitDown: rootStyle().getPropertyValue('--wml-tablet-portrait-down'),
  wmlTabletLandscape: rootStyle().getPropertyValue('--wml-tablet-landscape'),
  wmlSmallDesktop: rootStyle().getPropertyValue('--wml-small-desktop'),
  wmlTabletLandscapeDown: rootStyle().getPropertyValue('--wml-tablet-landscape-down'),
  wmlDesktop: rootStyle().getPropertyValue('--wml-desktop'),
  wmlNotMobile: rootStyle().getPropertyValue('--wml-not-mobile'),
  wmlLaptop: rootStyle().getPropertyValue('--wml-laptop'),
  wmlLaptopDown: rootStyle().getPropertyValue('--wml-laptop-down'),
  wmlLaptopTablet: rootStyle().getPropertyValue('--wml-laptop-tablet'),
  wmlLaptopTabletLandscape: rootStyle().getPropertyValue('--wml-laptop-tablet-landscape'),
  wmlLargeDesktop: rootStyle().getPropertyValue('--wml-large-desktop'),
  wmlLargeDesktopDown: rootStyle().getPropertyValue('--wml-large-desktop-down'),
  wmlXlDesktop: rootStyle().getPropertyValue('--wml-xl-desktop'),
  wmlXlDesktopDown: rootStyle().getPropertyValue('--wml-xl-desktop-down'),
  wmlXxlDesktop: rootStyle().getPropertyValue('--wml-xxl-desktop'),
  wmlXxxlDesktop: rootStyle().getPropertyValue('--wml-xxxl-desktop'),
  wmlDekstopDownForCampaigns: rootStyle().getPropertyValue('--wml-dekstop-down-for-campaigns'),
  wmlTabletForHeader: rootStyle().getPropertyValue('--wml-tablet-for-header'),
  wmlTabletLandscapeForHeader: rootStyle().getPropertyValue('--wml-tablet-landscape-for-header'),
  wmlTabletLandscapeDownForHeader: rootStyle().getPropertyValue('--wml-tablet-landscape-down-for-header'),
  wmlDesktopForHeader: rootStyle().getPropertyValue('--wml-desktop-for-header'),
  wmlLaptopForHeader: rootStyle().getPropertyValue('--wml-laptop-for-header'),
  wmlInputBackgroundColorLight0:'var(--wml-input-background-color-light-0)',
  wmlOriginalInputBackgroundColorLight0:'var(--wml-original-input-background-color-light-0)',
  wmlInputBackgroundColorDark0:'var(--wml-input-background-color-dark-0)',
  wmlOriginalInputBackgroundColorDark0:'var(--wml-original-input-background-color-dark-0)',
  wmlwhiteopacity0: 'var(--wml-white-opacity-0)',
  wmloriginalwhiteopacity0: rootStyle().getPropertyValue('--wml-original-white-opacity-0'),
  wmlblackopacity0:rootStyle().getPropertyValue('--wml-black-opacity-0'),
  wmloriginalblackopacity0:rootStyle().getPropertyValue('--wml-original-black-opacity-0'),
  wmlblackopacity1:rootStyle().getPropertyValue('--wml-black-opacity-1'),
  wmloriginalblackopacity1:rootStyle().getPropertyValue('--wml-original-black-opacity-1'),
  darkGreyColor: rootStyle().getPropertyValue('--dark-grey'),
  displayXXLarge: rootStyle().getPropertyValue('--display-xx-large'),
  displayXLarge: rootStyle().getPropertyValue('--display-x-large'),
  displayLarge: rootStyle().getPropertyValue('--display-large'),
  display: rootStyle().getPropertyValue('--display'),
  displaySmall: rootStyle().getPropertyValue('--display-small'),
  displayXSmall: rootStyle().getPropertyValue('--display-x-small'),
  displayXXSmall: rootStyle().getPropertyValue('--display-xx-small'),
  body: rootStyle().getPropertyValue('--body'),
  bodyBold: rootStyle().getPropertyValue('--body-bold'),
  bodySmall: rootStyle().getPropertyValue('--body-small'),
  bodySmallBold: rootStyle().getPropertyValue('--body-small-bold'),
  button: rootStyle().getPropertyValue('--button'),
  text: rootStyle().getPropertyValue('--text'),
  overline: rootStyle().getPropertyValue('--overline'),
  overlineBold: rootStyle().getPropertyValue('--overline-bold'),
  overlineSmall: rootStyle().getPropertyValue('--overline-small'),
  caption: rootStyle().getPropertyValue('--caption'),
  legal: rootStyle().getPropertyValue('--legal'),
  borderRadius0: rootStyle().getPropertyValue('--border-radius1'),
  wmlwhite: rootStyle().getPropertyValue('--wml-white') ,
  wmlblack: rootStyle().getPropertyValue('--wml-black') ,
  wmlprimary: rootStyle().getPropertyValue('--wml-primary') ,
  wmlsecondary: rootStyle().getPropertyValue('--wml-secondary') ,
  wmlTertiary:rootStyle().getPropertyValue('--wml-tertiary'),
  wmlOriginalTertiary:rootStyle().getPropertyValue('--wml-original-tertiary'),
  wmlQuaternary:rootStyle().getPropertyValue('--wml-quaternary'),
  wmlOriginalQuaternary:rootStyle().getPropertyValue('--wml-original-quaternary'),
  wmlWhiteGradient:rootStyle().getPropertyValue('--wml-white-gradient'),
  wmlOriginalWhiteGradient:rootStyle().getPropertyValue('--wml-original-white-gradient'),
  wmlBlackGradient:rootStyle().getPropertyValue('--wml-black-gradient'),
  wmlOriginalBlackGradient:rootStyle().getPropertyValue('--wml-original-black-gradient'),

  wmlprimaryfilter: rootStyle().getPropertyValue('--wml-primary-filter') ,
  wmloriginalprimaryfilter: rootStyle().getPropertyValue('--wml-original-primary-filter') ,
  wmlsecondaryfilter: rootStyle().getPropertyValue('--wml-secondary-filter') ,
  wmloriginalsecondaryfilter: rootStyle().getPropertyValue('--wml-original-secondary-filter'),
  wmlQuaternaryFilter:rootStyle().getPropertyValue('--wml-quaternary-filter'),
  wmlOriginalQuaternaryFilter:rootStyle().getPropertyValue('--wml-original-quaternary-filter'),


  wmlstarselected: rootStyle().getPropertyValue('--wml-star-selected'),
  wmlgradient0: rootStyle().getPropertyValue('--wml-secondary-gradient'),
  wmlgradient1: 'var(--wml-primary-gradient)',
  wmloriginalgradient0: rootStyle().getPropertyValue('--wml-original-secondary-gradient'),
  wmloriginalgradient1: rootStyle().getPropertyValue('--wml-original-primary-gradient'),
  wmlorginalwhite: rootStyle().getPropertyValue('--wml-original-white') ,
  wmlorginalblack: rootStyle().getPropertyValue('--wml-original-black') ,
  wmlorginalprimary: rootStyle().getPropertyValue('--wml-original-primary') ,
  wmlorginalsecondary: rootStyle().getPropertyValue('--wml-original-secondary') ,
  wmlorginalstarselected: rootStyle().getPropertyValue('--wml-original-star-selected'),

  wmlAlert:  rootStyle().getPropertyValue('--wml-original-alert'),
  wmlNavColor:rootStyle().getPropertyValue('--wml-nav-color'),
  wmloriginalNavColor:rootStyle().getPropertyValue('--wml-original-nav-color'),
  appTransitionTime,
  javascriptAppTransitionTime:
    parseFloat(appTransitionTime.split('s')[0]) * 1000,
  spacing1: rootStyle().getPropertyValue('--spacing1'),
  spacing2: rootStyle().getPropertyValue('--spacing2'),
  spacing3: rootStyle().getPropertyValue('--spacing3'),
  spacing4: rootStyle().getPropertyValue('--spacing4'),
  spacing5: rootStyle().getPropertyValue('--spacing5'),
  spacing6: rootStyle().getPropertyValue('--spacing6'),
  spacing7: rootStyle().getPropertyValue('--spacing7'),
  spacing8: rootStyle().getPropertyValue('--spacing8'),
  spacing9: rootStyle().getPropertyValue('--spacing9'),
  spacing10: rootStyle().getPropertyValue('--spacing10'),
};


export let updateWebStorage =(webStorage:Storage,storageTitle:string,predicate:Function)=>{
  let targetStorage:any =webStorage.getItem(storageTitle)
  targetStorage = JSON.parse(targetStorage)
  if(!targetStorage){
    targetStorage ={}
  }
  return predicate(targetStorage)
}

export let toggleDarkMode = (init=false,colorMode?:"light"|"dark") => {


  let webStorage =updateWebStorage(
    localStorage,
    ENV.classPrefix.app,
    (webStorage)=>{
      if(!init){
        if(!colorMode){
          webStorage.darkMode = !webStorage.darkMode
        }
        if(colorMode === "light"){
          webStorage.darkMode= false
        }
        else if(colorMode === "dark"){
          webStorage.darkMode= true
        }
      }
      if(init && webStorage.darkMode === undefined){
        if(colorMode === "light"){
          webStorage.darkMode= false
        }
        else if(colorMode === "dark"){
          webStorage.darkMode= true
        }
      }
      localStorage.setItem(ENV.classPrefix.app, JSON.stringify(webStorage))
      return webStorage
    }
  )



  if(webStorage.darkMode){
    root.classList.remove("WMLLightMode")
    root.classList.add("WMLDarkMode")
  }
  else if(!webStorage.darkMode){
    root.classList.add("WMLLightMode")
    root.classList.remove("WMLDarkMode")
  }
  root.style.setProperty(
    'color-scheme',
    !webStorage.darkMode
      ? 'light'
      : 'dark'
  );


  root.style.setProperty(
    '--wml-white-gradient',
    !webStorage.darkMode
      ? CSSVARS.wmlOriginalWhiteGradient
      : CSSVARS.wmlOriginalBlackGradient
  );

  root.style.setProperty(
    '--wml-black-gradient',
    !webStorage.darkMode
      ? CSSVARS.wmlOriginalBlackGradient
      : CSSVARS.wmlOriginalWhiteGradient
  );

  root.style.setProperty(
    '--wml-white',
    !webStorage.darkMode
      ? CSSVARS.wmlorginalwhite
      : CSSVARS.wmlorginalblack
  );

  root.style.setProperty(
    '--wml-black',
    !webStorage.darkMode
      ? CSSVARS.wmlorginalblack
      : CSSVARS.wmlorginalwhite
  );

  root.style.setProperty(
    '--wml-primary',
    !webStorage.darkMode
      ? CSSVARS.wmlorginalprimary
      : CSSVARS.wmlorginalsecondary
  );

  root.style.setProperty(
    '--wml-secondary',
    !webStorage.darkMode
      ? CSSVARS.wmlorginalsecondary
      : CSSVARS.wmlorginalprimary
  );

  root.style.setProperty(
    '--wml-quaternary',
    !webStorage.darkMode
      ? CSSVARS.wmlOriginalQuaternary
      : CSSVARS.wmlorginalprimary
  );

  root.style.setProperty(
    '--wml-alert',
    !webStorage.darkMode
      ? CSSVARS.wmlAlert
      : CSSVARS.wmlwhite
  );

  root.style.setProperty(
    '--wml-primary-filter',
    !webStorage.darkMode
    ? CSSVARS.wmloriginalprimaryfilter
    : CSSVARS.wmloriginalsecondaryfilter
  );

  root.style.setProperty(
    '--wml-secondary-filter',
    !webStorage.darkMode
    ? CSSVARS.wmloriginalsecondaryfilter
    : CSSVARS.wmloriginalprimaryfilter
  );

  root.style.setProperty(
    '--wml-quaternary-filter',
    !webStorage.darkMode
    ? CSSVARS.wmlOriginalQuaternaryFilter
    : CSSVARS.wmloriginalprimaryfilter
  );

  root.style.setProperty(
    '--wml-secondary-gradient',
    !webStorage.darkMode
      ? CSSVARS.wmloriginalgradient0
      : CSSVARS.wmloriginalgradient1
  );

  root.style.setProperty(
    '--wml-primary-gradient',
    !webStorage.darkMode
      ? CSSVARS.wmloriginalgradient1
      : CSSVARS.wmloriginalgradient0
  );

  root.style.setProperty(
    '--wml-gradient-2',
    !webStorage.darkMode
      ? CSSVARS.wmloriginalgradient0
      : "transparent"
  );

  root.style.setProperty(
    '--wml-nav-color',
    !webStorage.darkMode
      ? CSSVARS.wmloriginalNavColor
      : CSSVARS.wmlorginalprimary
  );

  root.style.setProperty(
    '--wml-white-opacity-0',
    !webStorage.darkMode
      ? CSSVARS.wmloriginalwhiteopacity0
      : CSSVARS.wmloriginalblackopacity0
  );


  root.style.setProperty(
    '--wml-black-opacity-1',
    !webStorage.darkMode
      ? CSSVARS.wmloriginalblackopacity1
      : CSSVARS.wmloriginalwhiteopacity0
  );

  root.style.setProperty(
    '--wml-input-background-color-light-0',
    !webStorage.darkMode
      ? CSSVARS.wmlOriginalInputBackgroundColorLight0
      : CSSVARS.wmlOriginalInputBackgroundColorDark0
  );

  root.style.setProperty(
    '--wml-input-background-color-dark-0',
    !webStorage.darkMode
      ? CSSVARS.wmlOriginalInputBackgroundColorDark0
      : CSSVARS.wmlOriginalInputBackgroundColorLight0
  );




  return webStorage.darkMode
};

export let arraysEqual =(a, b)=> {
  if (a.length !== b.length) {
    return false;
  }

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  for (let i = 0; i < sortedA.length; i++) {
    if (JSON.stringify(sortedA[i]) !== JSON.stringify(sortedB[i])) {
      return false;
    }
  }

  return true;
}
