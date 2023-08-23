package baseclasses;

import org.openqa.selenium.By;

import util.ByWMLField;

public class BasePage {

  public  static String generateCSSSelector(String prefix,String suffix){
    return prefix+"_"+suffix;
  }

  public static ByWMLField wmlField(String container,String cssPathToField){
    return new ByWMLField(
      container +" .WmlFieldPod0 .WmlLabelMainPodLabel0",
      container +" .WmlFieldPod1 "+cssPathToField ,
      container +" .WmlFieldPod2 .WmlLabelMainPodLabel0"
    );
  }

  public static By getByWMLButton(String id){
    return By.cssSelector("#"+id+ " button");
  }
}
