package pages.nav;

import org.openqa.selenium.By;

import baseclasses.BasePage;

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

  public static By languageLink(){
    return By.id(generateCSSSelector(PARENTCLASS, "LanguageLink"));
  }
}
