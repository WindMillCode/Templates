import { selectRandomOptionFromArray } from "@windmillcode/angular-wml-components-base";

export function   getRandomImage (){

  return selectRandomOptionFromArray([
   "https://loremflickr.com/640/480/nature",
   "https://loremflickr.com/640/480/food",
   "https://loremflickr.com/640/480/business",
   "https://loremflickr.com/640/480/cats",

  ])
}

