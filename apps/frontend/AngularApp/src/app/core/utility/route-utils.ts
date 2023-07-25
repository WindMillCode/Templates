import { Route } from "@angular/router";

export let addPageTitlesToRoute = (routes:Route["children"])=>{

  routes.forEach((route)=>{

    if(!route.title || !route.data.title){
      let path = route.path === "" ? "default": route.path
      route.title = "nav.pageTitle."+path
    }
    if(Array.isArray(route.children)){
      addPageTitlesToRoute(route.children)
    }
  })
  return routes
}


