// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input, ViewChild, ViewContainerRef, ElementRef   } from '@angular/core';

// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { Subject, concat, fromEvent, of } from 'rxjs';
import { concatMap, distinctUntilChanged, map, startWith, switchMap, takeUntil,tap } from 'rxjs/operators';

// wml-components
import { generateClassPrefix } from '@windmillcode/angular-wml-components-base';
// misc

import { ENV } from '@env/environment';
import { WMLThreeObj, WMLThreeParams } from '@core/utility/threejs-utils';
import {  Group, PlaneGeometry,  WebGLRenderer } from 'three';
import { CSSVARS } from '@core/utility/common-utils';

@Component({
  selector: 'threejs-background',
  templateUrl: './threejs.component.html',
  styleUrls: ['./threejs.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ThreejsComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public baseService:BaseService
  ) { }

  classPrefix = generateClassPrefix('Threejs')

  @Input('params') params: ThreejsParams = new ThreejsParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  @ViewChild("threejsContainer",{read:ElementRef,static:true}) threejsContainer:ElementRef
  ngUnsub= new Subject<void>()
  threejsHelper:WMLThreeParams<WebGLRenderer>
  waterObj = new WMLThreeObj({
    geometry:new PlaneGeometry(1000, 1000),
    isWorldSurface:true
  })
  surfboardObj = new WMLThreeObj({
    textureURL:"assets/media/threejs-background/surfboard_texture.jpg",
    geometryURL:"assets/media/threejs-background/surfboard.obj",
    guiName:"surfboardObj",
    isFloating:true
  })
  skateBoardObj = new WMLThreeObj({
    textureURL:"assets/media/threejs-background/skateboard_texture.webp",
    geometryURL:"assets/media/threejs-background/skateboard.obj",
    guiName:"skateBoardObj",
    isFloating:true
  })


  setupThreeJs= ()=>{
    this.threejsHelper = new WMLThreeParams({
      rendererParentElement:this.threejsContainer.nativeElement,
      orbitControlsViaMouseIsPresent:false,
      guiControlsIsPresent:false
    })
    this.threejsHelper.init()
    .pipe(
      takeUntil(this.ngUnsub),
      tap(()=>{
        this.setupWater()
      }),
      concatMap(()=>{
        return concat(
          this.setupSurfboard(),
          this.setupSkateboard(),
          this.adjustObjsBasedOnWindowSize()
        )
      }),
    )
    .subscribe()
  }

  setupWater = ()=>{
    this.waterObj.addWater(
      this.threejsHelper
    )
    this.waterObj.createPhysBodyFromMesh(
      this.threejsHelper
    )
    this.threejsHelper.renderer.setClearColor('rgba('+CSSVARS.wmlTertiary+')');
  }


  setupSurfboard = ()=>{
    return this.surfboardObj.addItemViaTextureAndAssetLoader(this.threejsHelper)
    .pipe(
      takeUntil(this.ngUnsub),
      tap((mesh)=>{
        mesh.scale.set(.7, .7, .5);
        mesh.rotation.x = -2.0
        mesh.rotation.y = -.1
        mesh.rotation.z = -.3
        mesh.position.x = -120
        mesh.position.z = -50
        mesh.position.y = 1
      }),
      tap(()=>this.surfboardObj.addToPhysicsWorld(this.threejsHelper))
    )
  }
  setupSkateboard = ()=>{
    return this.skateBoardObj.addItemViaTextureAndAssetLoader(this.threejsHelper)
    .pipe(
      takeUntil(this.ngUnsub),
      tap((mesh:Group)=>{
        mesh.rotation.x = -1.8
        mesh.rotation.y = -.1
        mesh.position.x = 120
        mesh.position.z = 50
        mesh.position.y = 5
      }),
      tap(()=>this.skateBoardObj.addToPhysicsWorld(this.threejsHelper))
    )
  }

  adjustObjsBasedOnWindowSize =()=>{
    let mobile = window.matchMedia(CSSVARS.wmlMobile)
    let tablet = window.matchMedia(CSSVARS.wmlTablet);
    let desktop = window.matchMedia(CSSVARS.wmlDesktop)
    return fromEvent(window,"resize")
    .pipe(
      startWith({}),
      takeUntil(this.ngUnsub),
      map(()=>tablet.matches || desktop.matches),
      distinctUntilChanged(),
      tap(()=>{
        if(mobile.matches){
          this.threejsHelper.setObjPosRelativeToCameraViewport(
            this.surfboardObj,this.waterObj,.5,.45
          );
          this.threejsHelper.setObjPosRelativeToCameraViewport(
            this.skateBoardObj,this.waterObj,.5,.55)

        }
        if(tablet.matches || desktop.matches){
          this.threejsHelper.setObjPosRelativeToCameraViewport(
            this.surfboardObj,this.waterObj,0.35,0.38
          )
          this.threejsHelper.setObjPosRelativeToCameraViewport(
            this.skateBoardObj,this.waterObj,.62,.61
          )
        }
      })
    )

  }

  ngOnInit(): void {
    this.setupThreeJs()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class ThreejsParams {
  constructor(params:Partial<ThreejsParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}


