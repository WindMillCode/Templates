package util;

import org.openqa.selenium.By;

public class ByWMLField {

  public ByWMLField(String paramLabel,String paramField,String paramError){
      field = By.cssSelector(paramField);
      label = paramLabel;
      error = paramError;
  }

  public By field;
  private String label;
  private String error;
  public By getLabel(Integer labelGroupIndex, Integer labelTextIndex){
    String addtl ="*:nth-child("+labelTextIndex+")";
    return getLabel(labelGroupIndex, addtl);
  }
  public By getLabel( ){
    return getLabel(1,1);
  }
  public By getLabel(Integer labelGroupIndex, String addtl){
    addtl =  ":nth-child("+labelGroupIndex+") "+ addtl;
    return getLabel( addtl);
  }
  public By getLabel(Integer labelTextIndex ){
    return getLabel(1,labelTextIndex);
  }
  public By getLabel( String addtl){
    String selector = label +  addtl;
    return By.cssSelector(selector);
  }


  public By getError(Integer labelGroupIndex, Integer labelTextIndex){
    String addtl ="*:nth-child("+labelTextIndex+")";
    return getError(labelGroupIndex, addtl);
  }
  public By getError( ){
    return getError(1,1);
  }
  public By getError(Integer labelGroupIndex, String addtl){
    addtl =  ":nth-child("+labelGroupIndex+") "+ addtl;
    return getError( addtl);
  }
  public By getError(Integer labelTextIndex ){
    return getError(1,labelTextIndex);
  }
  public By getError( String addtl){
    String selector = error +  addtl;
    return By.cssSelector(selector);
  }



}
