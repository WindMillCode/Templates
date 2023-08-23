// testing
import { ComponentFixture } from '@angular/core/testing';
import {  configureTestingModuleForComponents, grabComponentInstance } from '@app/core/utility/test-utils';

// rxjs
import { Subject } from 'rxjs';

import { SectionZeroComponent } from './section-zero.component';


describe('SectionZeroComponent', () => {
  let cpnt: SectionZeroComponent;
  let fixture: ComponentFixture<SectionZeroComponent>;

  beforeEach(async () => {



    await configureTestingModuleForComponents(SectionZeroComponent);


    ({fixture, cpnt} =  grabComponentInstance(SectionZeroComponent));
    fixture.detectChanges()
  })

  describe("init", () => {

    it("should create", () => {
      expect(cpnt).toBeTruthy()
    })

    it("should have all values initalize properly", () => {
      expect(cpnt.myClass).toEqual('SectionZeroView')
    })

    it("should have all properties be the correct class instance", () => {
      expect(cpnt.ngUnsub).toBeInstanceOf(Subject<void>)
    })
  })

  describe("ngOnDestroy",()=>{

    beforeEach(()=>{
      spyOn(cpnt.ngUnsub,'next')
      spyOn(cpnt.ngUnsub,'complete')
    })

    it(` when called |
     as appropriate |
     does the required action `,()=>{
        // act
        cpnt.ngOnDestroy();

        // assert
        expect(cpnt.ngUnsub.next).toHaveBeenCalled();
        expect(cpnt.ngUnsub.complete).toHaveBeenCalled();
    })
  })
});
