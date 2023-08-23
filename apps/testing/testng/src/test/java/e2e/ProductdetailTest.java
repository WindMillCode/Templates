package e2e;

import org.testng.annotations.Test;

import baseclasses.UIBaseClass;
import pages.nav.NavPage;
import util.E2EUtils;

public class ProductdetailTest extends UIBaseClass {

  NavPage nav = NavPage.getNavPage();
  E2EUtils e2eutil = E2EUtils.getCommonUtils();


  @Test
  public void navToProducts() throws InterruptedException {
    e2eutil
      .moveMouseToElement(driver, NavPage.pricingOption())
      .moveMouseToElement(driver, NavPage.storeOption())
      .click(driver, NavPage.productsOption())
      .waitForScreenToUpdate();


    e2eUtil
      .verifyPageTitle(driver, "Store");
  }



}
