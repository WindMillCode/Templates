package pages.account;

import org.openqa.selenium.By;

import baseclasses.BasePage;

public class AccountPage extends BasePage {

  public static final String PARENTCLASS = "Account";
  private AccountActController act;
  private AccountVerifyController verify;

  public AccountActController act() {
    return act;
  }

  public AccountVerifyController verify() {
    return verify;
  }

  private AccountPage() {
    // hide it
  }

  private AccountPage(
    AccountActController act,
    AccountVerifyController verify
  ) {
    this.act = act;
    this.verify = verify;
  }

  public static AccountPage getAccountPage() {
    return new AccountPage(
      new AccountActController(),
      new AccountVerifyController()
    );
  }

  public static By billingLink(){
    return By.id(generateCSSSelector(PARENTCLASS, "billingLink"));
  }
}
