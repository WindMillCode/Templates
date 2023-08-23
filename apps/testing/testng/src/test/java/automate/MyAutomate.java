package automate;

import java.util.ArrayList;

import org.testng.annotations.Test;

import baseclasses.UIBaseClass;
import pages.nav.NavPage;
import pages.productdetail.ProductdetailPage;
import pages.products.ProductsPage;
import util.CommonUtils;


public class MyAutomate extends UIBaseClass {


  @Test
  public void workWithCheckOutPage() throws InterruptedException {
    ArrayList<Integer> colorOptions = new ArrayList<>() {{ add(0); add(1); }};
    ArrayList<Integer> sizeOptions = new ArrayList<>() {{ add(0); add(1); add(2); add(3); add(4); }};

    e2eUtil
     .waitForScreenToUpdate()
      .moveMouseToElement(driver, NavPage.pricingOption())
      .moveMouseToElement(driver, NavPage.storeOption())
      .click(driver, NavPage.productsOption())
      .clickFromOptions(driver, ProductsPage.selectProductCard(), 0)
      .enterIntoInput(driver, ProductdetailPage.quantityField(), "5")
      .clickFromOptions(driver, ProductdetailPage.colorFields(), CommonUtils.chooseRandomOptionFromSequence(colorOptions))
      .clickFromOptions(driver, ProductdetailPage.sizeFields(), CommonUtils.chooseRandomOptionFromSequence(sizeOptions))
      .click(driver, ProductdetailPage.buyNowBtn())
      .waitForScreenToUpdate(1000000);

    e2eUtil
      .verifyPageTitle(driver, "Store");
  }
}
