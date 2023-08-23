import { ENV } from "@env/environment"

export let silenceAllConsoleLogs = ()=>{
  Object.entries(console)
  .forEach((x, i) => {
    let [key, val] = x
    if (typeof val === "function") {
      ((console as any)[key] ) = () => { }
    }
  })
}

export let restoreOriginalConsoleObject = ( )=>{
  ENV.app.originalConsoleObj
  .forEach((x, i) => {
    let [key, val] = x
    ;((console as any)[key] ) = val

  })
}

export let traverseClassAndRemoveAutomationForProduction = (obj,stack=[])=>{
  Object.entries(obj).forEach(entry=>{
    let [key,value] = entry
    if(value instanceof Object){
      stack.push(obj[key])
      traverseClassAndRemoveAutomationForProduction(value,stack)
      stack = []
    }
    else{
      if(key ==="automate"){
        stack[stack.length-1].automate = false
      }
    }
  })
}
