// angular
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

// services

import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { Subject } from 'rxjs';

// misc

import { WMLImage, WMLUIProperty } from '@windmillcode/angular-wml-components-base';

@Component({
  selector: 'section-one',
  templateUrl: './section-one.component.html',
  styleUrls: ['./section-one.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionOneComponent {
  constructor(
    public cdref: ChangeDetectorRef,

    public utilService: UtilityService,

    public baseService: BaseService
  ) {}

  classPrefix = this.utilService.generateClassPrefix('SectionOne');
  @Input('params') params: SectionOneParams = new SectionOneParams();
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub = new Subject<void>();
  SectionOneParamsType = SectionOneParamsType;
  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }
}

export enum SectionOneParamsType {
  PRIMARY,
  SECONDARY,
}

export class SectionOneParams {
  constructor(params: Partial<SectionOneParams> = {}) {
    Object.assign(this, {
      ...params,
    });
    this.title =
      this.title instanceof WMLUIProperty
        ? this.title
        : new WMLUIProperty({ text: this.title });
    this.text =
      this.text instanceof WMLUIProperty
        ? this.text
        : new WMLUIProperty({ text: this.text });
  }
  type = SectionOneParamsType.PRIMARY;

  title: any = new WMLUIProperty({ text: 'Enter A Title' });
  text: any = new WMLUIProperty({ text: 'Enter some summary text' });
  textImage = new WMLImage({});
  tsParticlesId = "tsparticlesSectionOne"
}
