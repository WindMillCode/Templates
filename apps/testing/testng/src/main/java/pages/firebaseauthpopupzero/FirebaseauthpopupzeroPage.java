package pages.firebaseauthpopupzero;

import org.openqa.selenium.By;

import baseclasses.BasePage;

public class FirebaseauthpopupzeroPage extends BasePage {

  public static final String PARENTCLASS = "Firebaseauthpopupzero";
  private FirebaseauthpopupzeroActController act;
  private FirebaseauthpopupzeroVerifyController verify;

  public FirebaseauthpopupzeroActController act() {
    return act;
  }

  public FirebaseauthpopupzeroVerifyController verify() {
    return verify;
  }

  private FirebaseauthpopupzeroPage() {
    // hide it
  }

  private FirebaseauthpopupzeroPage(
    FirebaseauthpopupzeroActController act,
    FirebaseauthpopupzeroVerifyController verify
  ) {
    this.act = act;
    this.verify = verify;
  }

  public static FirebaseauthpopupzeroPage getFirebaseauthpopupzeroPage() {
    return new FirebaseauthpopupzeroPage(
      new FirebaseauthpopupzeroActController(),
      new FirebaseauthpopupzeroVerifyController()
    );
  }

  public static By accounts(){
    return By.cssSelector(".mdc-list li");
  }
}
