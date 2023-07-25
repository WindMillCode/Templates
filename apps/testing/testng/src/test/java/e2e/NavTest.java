package e2e;

import org.testng.annotations.Test;

import baseclasses.UIBaseClass;
import pages.nav.NavPage;
import util.E2EUtils;

public class NavTest extends UIBaseClass {

  E2EUtils e2eutil = E2EUtils.getCommonUtils();

  @Test
  public void openLanguageLink() throws InterruptedException {

    e2eutil
      .click(UIBaseClass.driver, NavPage.languageLink())
      .waitForScreenToUpdate(10000000);
  }
}
