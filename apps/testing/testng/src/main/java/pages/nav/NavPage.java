package pages.nav;

import baseclasses.BasePage;
import org.openqa.selenium.By;

public class NavPage extends BasePage {

  public static final String PARENTCLASS = "Nav";
  private NavActController act;
  private NavVerifyController verify;

  public NavActController act() {
    return act;
  }

  public NavVerifyController verify() {
    return verify;
  }

  private NavPage() {
    // hide it
  }

  private NavPage(NavActController act, NavVerifyController verify) {
    this.act = act;
    this.verify = verify;
  }

  public static NavPage getNavPage() {
    return new NavPage(new NavActController(), new NavVerifyController());
  }

  public static By homeOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "homeOption"));
  }

  public static By aboutOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "aboutOption"));
  }

  public static By mediaOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "mediaOption"));
  }

  public static By pricingOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "pricingOption"));
  }

  public static By storeOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "storeOption"));
  }

  public static By coursesOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "coursesOption"));
  }

  public static By contactOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "contactOption"));
  }

  public static By blogOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "blogOption"));
  }

  public static By eventsOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "eventsOption"));
  }

  public static By labsOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "labsOption"));
  }

  public static By onlineOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "onlineOption"));
  }

  public static By inPersonOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "inPersonOption"));
  }

  public static By plansOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "plansOption"));
  }

  public static By donateOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "donateOption"));
  }

  public static By productsOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "productsOption"));
  }

  public static By cartOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "cartOption"));
  }

  public static By checkoutOption() {
    return By.id(generateCSSSelector(PARENTCLASS, "checkoutOption"));
  }

  public static By loginBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "loginBtn"));
  }
}
