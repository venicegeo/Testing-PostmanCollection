package bfui.test;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class Utils {
	  
	  // Check that an element is present on the page,
	  // without throwing an exception if it is not present.
	  static boolean isElementPresent(WebDriver driver, By by) {
		  try {
			  driver.findElement(by);
			  return true;
			  }
		  catch (NoSuchElementException e) {
			  return false;
			  }
		  }
	  
	  static void typeToFocus(WebDriver driver, CharSequence k) {
		  getFocusedField(driver).sendKeys(k);
	  }
	  
	  static WebElement getFocusedField(WebDriver driver) {
		  return driver.switchTo().activeElement();
	  }
}