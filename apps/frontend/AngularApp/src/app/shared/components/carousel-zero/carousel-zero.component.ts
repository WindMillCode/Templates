// angular
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  Input,
} from '@angular/core';

// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { Subject, interval, timer } from 'rxjs';
import { delay, takeUntil, tap } from 'rxjs/operators';

// wml-components
import {
  WMLImage,
  WMLUIProperty,
  generateClassPrefix,
  selectRandomOptionFromArray,
} from '@windmillcode/angular-wml-components-base';

// misc

import { ENV } from '@env/environment';

@Component({
  selector: 'carousel-zero',
  templateUrl: './carousel-zero.component.html',
  styleUrls: ['./carousel-zero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselZeroComponent {
  constructor(
    public cdref: ChangeDetectorRef,

    public utilService: UtilityService,
    public baseService: BaseService
  ) {}

  classPrefix = generateClassPrefix('CarouselZero');
  @Input('params') params: CarouselZeroParams = new CarouselZeroParams();
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub = new Subject<void>();
  get currentItem(){
    return this.params.items[0]
  }

  ngOnInit(): void {
    this.params.items.forEach((item,index0)=>{
      item.index = item.index ?? (index0+1).toString()
      item.img.updateClassString(this.classPrefix('Pod0Img0'))
      item.img.updateClassString(this.classPrefix('Pod0Img1'))
    })
    if(this.params.autoPlay){
      this.autoPlay().subscribe()
    }
  }

  autoPlay = ()=>{
    return interval(17000)
    .pipe(

      
      takeUntil(this.ngUnsub),
      tap(()=>{
        this.moveRight()
      })
    )

  }

  moveLeft() {
    if (this.params.direction !== 'still') {
      return;
    }
    let item = this.params.items.splice(
      this.params.items.length - 1,
      this.params.items.length
    )[0];
    item.img.updateClassString(this.classPrefix('Pod0Img1'),"remove")
    this.params.items.unshift(item);
    item.img.updateClassString(this.classPrefix('Pod0Img1'))
    this.cdref.detectChanges()
    this.params.items.forEach((item) => {
    });
    this.params.direction = 'left';

    // since there is no animation yet
    this.cleanupAnimation()
    this.cdref.detectChanges();
  }

  moveRight() {
    if (this.params.direction !== 'still') {
      return;
    }
    this.params.items.forEach((item) => {
    });
    this.params.direction = 'right';

    // since there is no animation yet
    this.cleanupAnimation()
    this.cdref.detectChanges();
  }

  cleanupAnimation() {
    this.params.items.forEach((item) => {
    });

    if (this.params.direction === 'right') {
      let item = this.params.items.shift();
      this.params.items.push(item);
      this.cdref.detectChanges()

      timer(100)
      .pipe(
        takeUntil(this.ngUnsub),
        tap(()=>{
          this.params.items[0].img.updateClassString(this.classPrefix('Pod0Img1'),"remove")
          this.cdref.detectChanges()
        }),
        delay(100),
        tap(()=>{
          this.params.items[0].img.updateClassString(this.classPrefix('Pod0Img1'))
          this.cdref.detectChanges()
        })
      )
      .subscribe()

    }
    this.params.direction = 'still';
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }
}

export class CarouselZeroItemParams {
  constructor(params: Partial<CarouselZeroItemParams> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  title = new WMLUIProperty({
    text: selectRandomOptionFromArray([
      "The Secret Garden",
      "Midnight Shadows",
      "Whispering Winds",
      "Enigma of the Lost City",
      "Echoes of Eternity",
      "Serenade of Stars",
      "Mystic Moonlight",
      "Forgotten Dreams",
      "The Emerald Quest",
      "Crimson Horizon"
    ]),
  });
  desc = new WMLUIProperty({
    text: `Lorem ipsum dolor sit amet,
     consectetur adipiscing elit. Maecenas eleifend lacinia lacus,
      a fermentum ante finibus vitae. Phasellus euismod sapien non ultricies aliquet.
       Nulla facilisi. Proin malesuada neque eu ante finibus vestibulum.
       Ut auctor sapien sit amet urna tincidunt, ut aliquam elit pellentesque.
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
         Praesent feugiat magna a ultricies luctus.
         Integer pharetra semper felis, a tristique tortor semper ut.
          Duis sed erat id nisi blandit rutrum nec non erat. Cras vitae enim risus.
          Curabitur gravida tortor sit amet consectetur cursus.
     Aliquam ac ultrices ipsum. Sed et viverra tortor, sit amet eleifend tortor.
     Lorem ipsum dolor sit amet,
     consectetur adipiscing elit. Maecenas eleifend lacinia lacus,
      a fermentum ante finibus vitae. Phasellus euismod sapien non ultricies aliquet.
       Nulla facilisi. Proin malesuada neque eu ante finibus vestibulum.
       Ut auctor sapien sit amet urna tincidunt, ut aliquam elit pellentesque.
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
         Praesent feugiat magna a ultricies luctus.
         Integer pharetra semper felis, a tristique tortor semper ut.
          Duis sed erat id nisi blandit rutrum nec non erat. Cras vitae enim risus.
          Curabitur gravida tortor sit amet consectetur cursus.
     Aliquam ac ultrices ipsum. Sed et viverra tortor, sit amet eleifend tortor.
     `,
  });
  img = new WMLImage({
    src: selectRandomOptionFromArray([
      "https://loremflickr.com/640/480/nature",
      "https://loremflickr.com/640/480/food",
      "https://loremflickr.com/640/480/business",
      "https://loremflickr.com/640/480/cats",
     ]),
    alt: 'global.logoImgAlt',
  });
  index
}

export class CarouselZeroParams {
  constructor(params: Partial<CarouselZeroParams> = {}) {
    Object.assign(this, {
      ...params,
    });
  }

  autoPlay = true

  items: CarouselZeroItemParams[] = Array(10)
    .fill(null)
    .map((nullVal, index0) => {
      return new CarouselZeroItemParams({
        index:(index0 +1).toString()
      });
    });
  direction: 'left' | 'right' | 'still' = 'still';
}
