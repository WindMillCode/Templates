// testing
import { ComponentFixture } from '@angular/core/testing';
import {  configureTestingModuleForComponents, grabComponentInstance, mockTranslateService } from '@app/core/utility/test-utils';

// rxjs
import { Subject } from 'rxjs';

import { SignUpSignInMainComponent } from './sign-up-sign-in-main.component';


describe('SignUpSignInMainComponent', () => {
  let cpnt: SignUpSignInMainComponent;
  let fixture: ComponentFixture<SignUpSignInMainComponent>;

  beforeEach(async () => {
    

    
    await configureTestingModuleForComponents(SignUpSignInMainComponent);
    

    ({fixture, cpnt} =  grabComponentInstance(SignUpSignInMainComponent));
    fixture.detectChanges()
  })

  describe("init", () => {

    it("should create", () => {
      expect(cpnt).toBeTruthy()
    })

    it("should have all values initalize properly", () => {
      expect(cpnt.myClass).toEqual('SignUpSignInMainView')
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
