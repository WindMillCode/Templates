// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding,  } from '@angular/core';

// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';

// misc

@Component({

  selector: 'contact-main',
  templateUrl: './contact-main.component.html',
  styleUrls: ['./contact-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class ContactMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,
    public utilService:UtilityService,
    public baseService:BaseService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('ContactMain')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




