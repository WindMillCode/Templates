// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input  , } from '@angular/core';


// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { generateClassPrefix } from '@windmillcode/angular-wml-components-base';

// misc
import { ENV } from '@env/environment';
import { SpecificService } from '@core/specific/specific.service';
import { NavService } from '@shared/services/nav/nav.service';
import { toggleDarkMode } from '@core/utility/common-utils';



@Component({

  selector: 'nav-zero',
  templateUrl: './nav-zero.component.html',
  styleUrls: ['./nav-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,

})
export class NavZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public specificService:SpecificService,
    public utilService:UtilityService,
    public baseService:BaseService,
    public navService:NavService

  ) { }

  classPrefix = generateClassPrefix('NavZero')
  @Input('params') params: NavZeroParams = new NavZeroParams()
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()
  darkMode = "NavZero.darkMode"

  // @ts-ignore
  toggleDarkMode(init=false,colorMode?):typeof toggleDarkMode{
    this.darkMode =  toggleDarkMode(init,colorMode) ?   "NavZero.darkMode":"NavZero.lightMode"
  }

  listenForLoginStatusAndUpdateDesktopNav = ()=>{
    return this.navService.updatePageBasedOnLoginStatus()
    .pipe(
      takeUntil(this.ngUnsub),
      tap(()=>{
        this.cdref.detectChanges()
      })
    )
  }

  ngOnInit(): void {
    this.toggleDarkMode(true,"dark")
    this.listenForLoginStatusAndUpdateDesktopNav().subscribe()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}



export class NavZeroParams {
  constructor(params:Partial<NavZeroParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
}


