package pages.signin;

import baseclasses.BasePage;
import org.openqa.selenium.By;

public class SigninPage extends BasePage {

  public static final String PARENTCLASS = "Signin";
  private SigninActController act;
  private SigninVerifyController verify;

  public SigninActController act() {
    return act;
  }

  public SigninVerifyController verify() {
    return verify;
  }

  private SigninPage() {
    // hide it
  }

  private SigninPage(SigninActController act, SigninVerifyController verify) {
    this.act = act;
    this.verify = verify;
  }

  public static SigninPage getSigninPage() {
    return new SigninPage(
      new SigninActController(),
      new SigninVerifyController()
    );
  }

  public static By googleBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "googleBtn"));
  }

  public static By facebookBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "facebookBtn"));
  }

    public static By yahooBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "yahooBtn"));
  }

  public static By twitterBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "twitterBtn"));
  }

  public static By linkedinBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "linkedinBtn"));
  }

  public static By githubBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "githubBtn"));
  }

  public static By microsoftBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "microsoftBtn"));
  }

  public static By appleBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "appleBtn"));
  }

  public static By instagramBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "instagramBtn"));
  }

  public static By pinterestBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "pinterestBtn"));
  }

  public static By snapchatBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "snapchatBtn"));
  }
}
