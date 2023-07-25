package automate;

import java.util.ArrayList;

import org.testng.annotations.Test;

import baseclasses.UIBaseClass;
import pages.nav.NavPage;

import util.CommonUtils;


public class MyAutomate extends UIBaseClass {


  @Test
  public void workWithCheckOutPage() throws InterruptedException {
    ArrayList<Integer> colorOptions = new ArrayList<>() {{ add(0); add(1); }};
    ArrayList<Integer> sizeOptions = new ArrayList<>() {{ add(0); add(1); add(2); add(3); add(4); }};

    e2eUtil
     .waitForScreenToUpdate()

      .waitForScreenToUpdate(1000000);

    e2eUtil
      .verifyPageTitle(driver, "Store");
  }
}
