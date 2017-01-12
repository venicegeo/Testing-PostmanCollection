package bfui.test;

import static org.junit.Assert.*;
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
	  
	  static void assertLatInRange(double actual, double target, double range) {
		  assertLatInRange("", actual, target, range);
	  }
	  
	  static void assertLatInRange(String msg, double actual, double target, double range) {
		  assertTrue("Latitude should be within [-90,90]", Math.abs(actual) <= 90);
		  if (msg.isEmpty()) {
			  msg = "Latitude should be within %f degrees of the target";
		  } else {
			  msg += ": Latitude should be within %f degrees of the target";
		  }
		  assertTrue(String.format(msg, range), Math.abs(actual - target) < range);
	  }
	  
	  static void assertLonInRange(double actual, double target, double range) {
		  assertLonInRange("", actual, target, range);
	  }
	  
	  static void assertLonInRange(String msg, double actual, double target, double range) {
		  assertTrue("Longitude should be within [-180,180]", Math.abs(actual) <= 180);
		  if (msg.isEmpty()) {
			  msg = "Longitude should be within %f degrees of the target";
		  } else {
			  msg += ": Longitude should be within %f degrees of the target";
		  }
		  assertTrue(String.format(msg, range), Math.abs(actual - target) < range || Math.abs(actual - target) - 180 < range);
	  }
}