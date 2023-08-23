package e2e;

import java.util.ArrayList;



import baseclasses.UIBaseClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import pages.account.AccountPage;
import pages.accountbillingzero.AccountbillingzeroPage;
import pages.accountbillingzero.Card;
import pages.firebaseauthpopupzero.FirebaseauthpopupzeroPage;
import pages.nav.NavPage;
import pages.signin.SigninPage;
import util.CommonUtils;
import util.E2EUtils;



public class AccountbillingzeroTest extends UIBaseClass {

  E2EUtils e2eutil = E2EUtils.getCommonUtils();

  @BeforeMethod
  public void navToAccountBilling() throws InterruptedException {
    e2eutil
      .click(UIBaseClass.driver, NavPage.loginBtn())
      .waitForScreenToUpdate()
      .click(UIBaseClass.driver, SigninPage.microsoftBtn())
      .waitForScreenToUpdate()
      .switchToAnotherWindow(UIBaseClass.driver,1,false)
      .clickFromOptions(UIBaseClass.driver, FirebaseauthpopupzeroPage.accounts(), 0)
      .switchToAnotherWindow(UIBaseClass.driver, 0,true)
      .click(UIBaseClass.driver, AccountPage.billingLink());
  }

  @Test
  public void deleteCard() throws InterruptedException {

    Integer originalAmt = e2eutil
     .waitForScreenToUpdate(10000)
    .getElements(driver, AccountbillingzeroPage.carouselCards()).size();

    e2eutil
      .click(UIBaseClass.driver, AccountbillingzeroPage.deleteCardBtn())
      .waitForScreenToUpdate()
      .click(driver, AccountbillingzeroPage.confirmDeleteCardBtn())
      .waitForScreenToUpdate()
      .verifyPageTitle(driver, "Account");

    Integer updatedAmnt = e2eutil
      .getElements(driver, AccountbillingzeroPage.carouselCards()).size();

    e2eutil
      .verifyEquals(originalAmt-1, updatedAmnt);
  }
  @Test
  public void addCardToUserAcct() throws InterruptedException {

    ArrayList<Card> cards = new ArrayList<Card>();
    cards.add(new Card("4111 1111 1111 1111", "111"));
    cards.add(new Card("5105 1051 0510 5100", "111"));
    cards.add(new Card("6011 0000 0000 0004", "111"));
    cards.add(new Card("3000 000000 0004", "111"));
    cards.add(new Card("3569 9900 1009 5841", "111"));
    cards.add(new Card("3400 000000 00009", "1111"));
    cards.add(new Card("6222 9888 1234 0000", "123"));


    Integer repeatAmnt = 3;
    for (int i = 0; i < repeatAmnt; i++) {

        Card target = CommonUtils.chooseRandomOptionFromSequence(cards);
        // Card target = cards.get(i);
        e2eutil
          .waitForScreenToUpdate(5000)
          .click(UIBaseClass.driver, AccountbillingzeroPage.addCardFormBtn())
          .switchToAnotherIFrame(UIBaseClass.driver,AccountbillingzeroPage.addCardForm())
          .clearField(driver, AccountbillingzeroPage.cardNumberFormField())
          .clearField(driver, AccountbillingzeroPage.expirationDateFormField())
          .clearField(driver, AccountbillingzeroPage.cvvFormField())
          .enterIntoInput(driver, AccountbillingzeroPage.cardNumberFormField(), target.getCardNumber())
          .enterIntoInput(driver, AccountbillingzeroPage.expirationDateFormField(), target.getExpiration())
          .enterIntoInput(driver, AccountbillingzeroPage.cvvFormField(), target.getCvv())
          .waitForScreenToUpdate(3000);
      try{
         e2eutil
          .enterIntoInput(driver, AccountbillingzeroPage.postalCodeFormField(), target.getZipcode());
      }
      catch(Exception e) {}
         e2eutil
          .switchToAnotherWindow(UIBaseClass.driver, 0, false)
          .click(UIBaseClass.driver, AccountbillingzeroPage.addCardBtn())
          .waitForScreenToUpdate(5000);

    }
    // e2eutil
    //   .waitForScreenToUpdate(100000);
  }

  @Test
  public void updateUserAddress() throws InterruptedException {
    e2eutil
      .waitForScreenToUpdate()
      .enterIntoInput(
        driver,
        AccountbillingzeroPage.streetAdrFormField().field,
        CommonUtils.faker.address().streetAddress(),
        true
      )
      .enterIntoInput(
        driver,
        AccountbillingzeroPage.secondaryAdrFormField().field,
        CommonUtils.faker.address().secondaryAddress(),
        true
      )
      .enterIntoInput(
        driver,
        AccountbillingzeroPage.cityFormField().field,
        CommonUtils.faker.address().city(),
        true
      )
      .click(driver, AccountbillingzeroPage.stateFormField().field)
      .waitForScreenToUpdate()
      .clickFromOptions(driver, AccountbillingzeroPage.stateOptions())
      .enterIntoInput(
        driver,
        AccountbillingzeroPage.zipcodeFormField().field,
        CommonUtils.faker.address().zipCode(),
        true
      )
      .click(driver, AccountbillingzeroPage.submitBtn())
      .waitForScreenToUpdate(10000);


  }
}
