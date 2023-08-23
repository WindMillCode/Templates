package util;

import baseclasses.BasePage;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

public class E2EUtils {

  public static final String PAGE_TITLE_PREFIX = "WindMillCode";
  public static final String EMAIL_ZERO = "dev@proofofvibes.xyz";
  public static final String PASSWORD_ZERO = "c@3+U-]K`X1%.-K";
  public static final String EMAILONE = "info@proofofvibes.xyz";
  public static final String PASSWORD_ONE = "c@3+U-]K`X1%.-K";

  // public static final String FIREBASE_ID_PREFIX_REGEX = "-N.+";

  private E2EUtils() {
    // hide it
  }

  public static E2EUtils getCommonUtils() {
    return new E2EUtils();
  }

  public E2EUtils verifyIsDisplayed(WebDriver driver, By element) {
    Assert.assertTrue(driver.findElement(element).isDisplayed());
    return this;
  }

  public E2EUtils verifyIsNotDisplayed(WebDriver driver, By element) {
    Assert.assertEquals(driver.findElements(element).size(), 0);
    return this;
  }

  public E2EUtils verifyIsHidden(WebDriver driver, By element) {
    Assert.assertFalse(driver.findElement(element).isDisplayed());
    return this;
  }


  public <T> E2EUtils verifyEquals ( T actual,T expected) {
    Assert.assertEquals(actual,expected);
    return this;
  }

  public E2EUtils verifyEquals(WebDriver driver, By actual,String expected) {
    Assert.assertEquals(getElement(driver, actual).getText() ,expected);
    return this;
  }

  public E2EUtils verifyEquals(WebDriver driver, By actual,By expected) {
    Assert.assertEquals(getElement(driver, actual).getText() ,getElement(driver, expected).getText());
    return this;
  }

  public E2EUtils verifyPageTitle(WebDriver driver, String suffix) {
    if (suffix.equals("")) {
      Assert.assertEquals(driver.getTitle(), PAGE_TITLE_PREFIX);
    } else {
      Assert.assertEquals(driver.getTitle(), PAGE_TITLE_PREFIX + " " + suffix);
    }
    return this;
  }

  public E2EUtils verifyUrl(WebDriver driver, String result) {
    Assert.assertEquals(driver.getCurrentUrl(), result);
    return this;
  }

  public E2EUtils enterIntoInput(WebDriver driver, By searchBy, String value,Boolean clearField) {
    if(clearField){
      clearField(driver,searchBy);
    }
    return enterIntoInput(driver, searchBy, value);
  }

  public E2EUtils enterIntoInput(WebDriver driver, By searchBy, String value) {
    WebElement search = driver.findElement(searchBy);
    search.sendKeys(value);
    return this;
  }

  public E2EUtils clearField(WebDriver driver, By searchBy){
    WebElement search = driver.findElement(searchBy);
    search.clear();
    return this;
  }

  public E2EUtils click(WebDriver driver, By selector) {
    return click(driver, selector, 0);
  }

  public E2EUtils click(WebDriver driver, By selector, Integer waitTime) {
    WebDriverWait wait = new WebDriverWait(driver, waitTime);
    wait.until(ExpectedConditions.elementToBeClickable(selector));
    driver.findElement(selector).click();

    return this;
  }


  public WebElement getElement(WebDriver driver, By selector){
    return getElement( driver, selector,  0);
  }

  public WebElement getElement(WebDriver driver, By selector, Integer waitTime){
    WebDriverWait wait = new WebDriverWait(driver, waitTime);
    wait.until(ExpectedConditions.elementToBeClickable(selector));
    return driver.findElement(selector);
  }


  public List<WebElement> getElements(WebDriver driver, By selector){
    return getElements( driver, selector,  0);
  }

  public List<WebElement> getElements(WebDriver driver, By selector, Integer waitTime){
    WebDriverWait wait = new WebDriverWait(driver, waitTime);
    wait.until(ExpectedConditions.elementToBeClickable(selector));
    return driver.findElements(selector);
  }



  public E2EUtils clickFromOptions(
    WebDriver driver,
    By selector
  ) {
    return clickFromOptions(driver, selector, null, 0);
  }

  public E2EUtils clickFromOptions(
    WebDriver driver,
    By selector,
    Integer optionIndex
  ) {
    return clickFromOptions(driver, selector, optionIndex, 0);
  }

  public E2EUtils clickFromOptions(
    WebDriver driver,
    By selector,
    Integer optionIndex,
    Integer waitTime
  ) {
    WebDriverWait wait = new WebDriverWait(driver, waitTime);
    wait.until(ExpectedConditions.elementToBeClickable(selector));
    List<WebElement> targets = driver.findElements(selector);
    WebElement target;
    if(optionIndex == null){
      target = CommonUtils.chooseRandomOptionFromSequence(targets);
    }
    else{

      target = targets.get(optionIndex);
    }
    target.click();
    return this;
  }



  public E2EUtils moveMouseToElement(WebDriver driver, By selector) {
    Actions actions = new Actions(driver);
    actions.moveToElement(driver.findElement(selector)).perform();
    return this;
  }

  public E2EUtils waitForScreenToUpdate(Integer amnt)
    throws InterruptedException {
    Thread.sleep((long) (amnt));
    return this;
  }

  public E2EUtils waitForScreenToUpdate() throws InterruptedException {
    Thread.sleep(2000);
    return this;
  }

  public By notifyBanner() {
    String selector = "";
    String parentId ="#"+ BasePage.generateCSSSelector("Notify", "Banner");
    String notifyBarItem =".notification-bar";
    selector = parentId + " " + notifyBarItem ;
    return By.cssSelector(selector);
  }

  public By notifyBannerMsg(Integer index0) {
    String selector = "";
    String parentId = "#"+ BasePage.generateCSSSelector("Notify", "Banner");
    String notifyBarClass = ".notification-bar-"+(index0*2);
    String textElement = "span";
    selector = parentId + " " + notifyBarClass + " " + textElement;
    return By.cssSelector(selector);
  }


  public E2EUtils switchToAnotherIFrame(
    WebDriver driver,
    By iframeElementSelector

  ){
    WebElement iFramElement = driver.findElement(iframeElementSelector);
    driver.switchTo().frame(iFramElement);
    return this;
  }



  public E2EUtils switchToAnotherWindow(
    WebDriver driver,
    Integer windowHandleIndex,
    Boolean closeCurrentWindow
  ) {
    Set<String> windowHandles = driver.getWindowHandles();
    Iterator<String> it = windowHandles.iterator();
    int start = 0;
    while (start < windowHandleIndex) {
      it.next();
      start++;
    }
    String targetWindowId = it.next();
    if (closeCurrentWindow == true) {
      driver.close();
    }
    driver.switchTo().window(targetWindowId);

    return this;
  }
}
