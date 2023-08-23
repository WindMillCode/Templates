// angular
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  Input,
  Renderer2,
} from '@angular/core';

// services
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { BehaviorSubject, Subject, fromEvent, interval, of, timer } from 'rxjs';
import { delay, startWith, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs/operators';

// wml-components
import {
  WMLUIProperty,
  generateClassPrefix,
  generateRandomColor,
  generateRandomNumber,
} from '@windmillcode/angular-wml-components-base';

// misc

import { ENV } from '@env/environment';
import { LinkedList, retriveValueFromPXUnit } from '@core/utility/common-utils';
import { CardTwoParams } from '../card-two/card-two.component';

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
    public baseService: BaseService,
    public renderer2: Renderer2
  ) {}

  classPrefix = generateClassPrefix('CarouselZero');

  @Input('params') params: CarouselZeroParams = new CarouselZeroParams();

  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub = new Subject<void>();

  ngOnInit(): void {
    this.params.initCarousel();
    this.params.cdref = this.cdref;
  }

  ngAfterViewInit() {
    this.updateZAxisBasedOnCardWidth().subscribe();
    this.animateCarousel().subscribe()
  }

  animateCarousel = ()=>{
    if(this.params.allowAnimationIfCaourselIsEmpty){
      let cardsLinkedList = new LinkedList(null,this.params.cards)
      cardsLinkedList.closeList()
      cardsLinkedList.moveToNextItemInList()
      return interval(3000)
      .pipe(
        takeWhile(()=>this.params.allowAnimationIfCaourselIsEmpty),
        takeUntil(this.ngUnsub),
        tap(()=>{
          cardsLinkedList.moveToNextItemInList()
          cardsLinkedList.list.val.option.click()
          this.cdref.detectChanges()
        })
      )

    }
    else{
      return of()
    }
  }

  updateCardWidth = (currentWidth) => (card: CarouselZeroCardParams) => {
    card.card.style.height = 0.44375 * currentWidth + 'px';
  };

  updateZAxisBasedOnCardWidth = () => {

    return this.params.readyToInitCarouselSubj
    .pipe(
      takeUntil(this.ngUnsub),
      // take(1),
      delay(1000),

      switchMap(() => {
        return fromEvent(window, 'resize').pipe(
          startWith({}),

          takeUntil(this.ngUnsub),
          tap(() => {
            let cardWidth;
            try {
              cardWidth = parseInt(
                retriveValueFromPXUnit(
                  getComputedStyle(
                    document.querySelector('.CarouselZeroPod1Item1')
                  ).width
                )
              );
            } catch (error) {
              cardWidth = this.params.initalCardWidth;
            }

            if (cardWidth >= this.params.initalCardWidth) {
              this.params._zAxisValue = this.params.initalZAxisValue;
            } else {
              this.params._zAxisValue =
                (cardWidth / this.params.initalCardWidth) *
                this.params.initalZAxisValue;
              this.params._zAxisValue *= 1.01;
            }

            let currentCard = this.params.cards.find((x) => x.option.isPresent);
            this.params.updateCarousel(currentCard)(
              this.updateCardWidth(cardWidth)
            );
            this.cdref.detectChanges();
          })
        );
      })
    );
  };

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }
}

export class CarouselZeroParams {
  constructor(
    params: Partial<CarouselZeroParams> = {},
    addtl: Partial<{
      showOptionsContainer: 'true' | 'false';
    }> = {}
  ) {
    Object.assign(this, {
      ...params,
    });
    if (addtl.showOptionsContainer) {
      this.optionsContainer.isPresent = addtl.showOptionsContainer === 'true';
    }

    this.initCards();
  }
  allowAnimationIfCaourselIsEmpty = true
  nonChosenScaleFactor = 0.8;
  degree = 0;
  _zAxisValue = 540;
  initalZAxisValue = 540;
  initalCardWidth = 483.875;
  minCardWidth = 210;
  carousel = new WMLUIProperty({});
  readonly readyToInitCarouselSubj = new BehaviorSubject(null);
  cdref: ChangeDetectorRef;
  cards:CarouselZeroCardParams[] = []
  optionsContainer = new WMLUIProperty();
  get chosenCard(){
    return this.cards.find((card)=> card.option.isPresent)
  }
  reInit = () => {
    this.initCards();
    this.initCarousel();
    this.readyToInitCarouselSubj.next(null)
  };
  initCarousel = () => {
    this.degree = 360 / this.cards.length;
    this.carousel.style.transform = `translateZ(-${this._zAxisValue}px)`;
    this.updateCarouselItems();
  };

  initCards() {
    if(this.allowAnimationIfCaourselIsEmpty && this.cards.length === 0){
      this.cards= Array(8)
      .fill(null)
      .map(() => {
        return new CarouselZeroCardParams({});
      });
    }
    else{
      this.allowAnimationIfCaourselIsEmpty=false
    }
    this.cards.map((targetCard: CarouselZeroCardParams, index0: number) => {
      // @ts-ignore
      targetCard.card.click = targetCard.option.click =
        this.updateCarousel(targetCard);
      targetCard.option.isPresent = index0 === 0;
      // @ts-ignore
      targetCard.id =index0
    });
  }

  private updateCarouselItems() {
    this.cards.forEach((carouselItem, index0) => {
      carouselItem.card.style.transform = `
      rotateY(${index0 * this.degree}deg) translateZ(${
        this._zAxisValue
      }px) scale(${this.nonChosenScaleFactor})
      `;
      if (carouselItem.option.isPresent) {
        carouselItem.card.style.opacity = '1';
        carouselItem.card.style.transform = `rotateY(${
          index0 * this.degree
        }deg) translateZ(${this._zAxisValue}px)`;
      }
    });
  }

  updateCarousel(targetCard: CarouselZeroCardParams) {
    return (extrasPredicate = (card: CarouselZeroCardParams) => {}) => {

      this.cards.forEach((card, index0) => {
        card.card.style.transform = card.card.style.transform
          .split(`scale(${this.nonChosenScaleFactor})`)
          .join('');
          // @ts-ignore
        if (targetCard.id === card.id) {
          card.option.isPresent = true;
          card.card.style.opacity = '1';
          this.carousel.style.transform = `translateZ(-${
            this._zAxisValue
          }px) rotateY(-${index0 * this.degree}deg)`;
        } else {
          card.option.isPresent = false;
          card.card.style.opacity = '.5';
          card.card.style.transform += ` scale(${this.nonChosenScaleFactor})`;
        }
        extrasPredicate(card);

        this.updateCarouselItems();
      });
    };
  }


}

export class CarouselZeroCardParams {
  constructor(params: Partial<CarouselZeroCardParams> = {}) {
    Object.assign(this, {
      ...params,
    });
  }
  // this is the identifier for interalns
  private id:number
  option = new WMLUIProperty({
    style: {
      background: `linear-gradient(${generateRandomNumber(
        360
      )}deg,${generateRandomColor()},${generateRandomColor()},${generateRandomColor()})`,
    },
  });
  card = new WMLUIProperty();
  paymentCard = new CardTwoParams();
}
