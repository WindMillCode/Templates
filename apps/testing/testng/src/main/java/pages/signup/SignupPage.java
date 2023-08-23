package pages.signup;

import org.openqa.selenium.By;

import baseclasses.BasePage;

public class SignupPage extends BasePage {

  public static final String PARENTCLASS = "Signup";
  private SignupActController act;
  private SignupVerifyController verify;

  public SignupActController act() {
    return act;
  }

  public SignupVerifyController verify() {
    return verify;
  }

  private SignupPage() {
    // hide it
  }

  private SignupPage(SignupActController act, SignupVerifyController verify) {
    this.act = act;
    this.verify = verify;
  }

  public static SignupPage getSignupPage() {
    return new SignupPage(
      new SignupActController(),
      new SignupVerifyController()
    );
  }

  public static By googleBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "googleBtn"));
  }

  public static By facebookBtn() {
    return By.id(generateCSSSelector(PARENTCLASS, "facebookBtn"));
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
