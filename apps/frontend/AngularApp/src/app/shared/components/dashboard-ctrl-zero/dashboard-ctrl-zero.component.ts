// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';


// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';




// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// wml-components
import { WMLUIProperty, generateClassPrefix } from '@windmillcode/angular-wml-components-base';


// misc

import { ENV } from '@env/environment';
import { WmlButtonOneParams } from '@windmillcode/angular-wml-button-zero';



@Component({
  selector: 'dashboard-ctrl-zero',
  templateUrl: './dashboard-ctrl-zero.component.html',
  styleUrls: ['./dashboard-ctrl-zero.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class DashboardCtrlZeroComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public baseService:BaseService

  ) { }

  classPrefix = generateClassPrefix('DashboardCtrlZero')
  idPrefix = generateClassPrefix(ENV.idPrefix.DashboardCtrlZero)

  @Input('params') params: DashboardCtrlZeroParams = new DashboardCtrlZeroParams()


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  @HostBinding('id') myId!:string;
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}

export class DashboardCtrlZeroParams {
  constructor(params:Partial<DashboardCtrlZeroParams &
    {paramTitle:string,paramDesc:string,paramActionBtnText:string,paramActionBtnClick:WMLUIProperty["click"]}
  >={}){
    Object.assign(
      this,
      {
        ...params
      }
    )


    this.title.text = params.paramTitle ?? this.title.text
    this.desc.text = params.paramDesc ?? this.desc.text
    this.actionBtn.text = params.paramActionBtnText ?? this.actionBtn.text
    this.actionBtn.click = params.paramActionBtnClick ?? this.actionBtn.click

  }

  title  =new WMLUIProperty({
    text:"My Default Action"
  })
  desc = new WMLUIProperty({
    text:`Control panel is not just a tool, but a virtual cockpit that places you at the helm of your data-driven voyage, offering unparalleled command over your information ecosystem.`
  })
  actionBtn = new WmlButtonOneParams({
    text:"DashboardCtrl.actionBtn",
    click:()=>{
      alert("Provide a function to the click method")
    }
  })
}


