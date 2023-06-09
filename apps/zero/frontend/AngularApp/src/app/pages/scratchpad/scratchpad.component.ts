// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input   } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc

import { ENV } from '@env/environment';

import { SharedModule } from '@shared/shared.module';
import { ButtonOneParams, ButtonOneParamsTypeEnum } from '@shared/components/button-one/button-one.component';

import { WMLUIProperty } from '@windmillcode/wml-components-base';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone:true,
  imports:[
    SharedModule
  ],
  selector: 'scratchpad',
  templateUrl: './scratchpad.component.html',
  styleUrls: ['./scratchpad.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ScratchpadComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public http:HttpClient,
    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) { }

  classPrefix = this.utilService.generateClassPrefix('Scratchpad')


  seeIfPreviewIsReturingXml(){
    this.http.get("https://ui.dev.findmyrole.co",{observe:"response"})
    .pipe(
      takeUntil(this.ngUnsub),
      tap((res)=>{
        console.log(res)
      })
    )
    .subscribe()

  }


  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
    this.seeIfPreviewIsReturingXml()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}






