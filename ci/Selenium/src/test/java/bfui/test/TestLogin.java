package bfui.test;

import java.net.URL;
import org.junit.*;
import static org.junit.Assert.*;
import org.openqa.selenium.*;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.springframework.beans.factory.annotation.Value;

public class TestLogin {
  private WebDriver driver;
  
  // Strings used:
  private String baseUrl = System.getenv("bf_url");
  private String username = System.getenv("bf_username");
  private String password = System.getenv("bf_password");
  
  // Elements used:
  public WebElement pwField;
  private WebElement userField;
  private WebElement submitButton;
  private WebElement jobsButton;

  @Before
  public void setUp() throws Exception {
	  System.out.println("URL: " + baseUrl);
	  driver = new ChromeDriver();
	  driver.get(baseUrl);
	  pwField = driver.findElement(By.cssSelector("input[placeholder=password]"));
	  userField = driver.findElement(By.cssSelector("input[placeholder=username]"));
	  submitButton = driver.findElement(By.cssSelector("button[type=submit]"));
	  jobsButton = driver.findElement(By.className("Navigation-linkJobs"));
	  assertTrue("Login field should be present", isElementPresent(By.className("Login-root")));
	  assertEquals("Should be at correct Url", driver.getCurrentUrl(), baseUrl);
}

  @Test
  public void standard_login() throws Exception {
	  userField.clear();
	  userField.sendKeys(username);
	  assertEquals("Username should be correctly entered", username, userField.getAttribute("value"));
	  pwField.clear();
	  pwField.sendKeys(password);
	  assertEquals("Password field should be configured as a password", "password", pwField.getAttribute("type"));
	  assertEquals("Password should be correctly entered", password, pwField.getAttribute("value"));
	  submitButton.click();
	  Thread.sleep(5000);
	  assertFalse("Login field should not be present", isElementPresent(By.className("Login-root")));
  }
  
  @Test
  public void login_without_credentials() throws Exception {
	  submitButton.click();
	  Thread.sleep(5000);
	  assertTrue("Login field should still be present", isElementPresent(By.className("Login-root")));
	  assertTrue("Login error message should appear", isElementPresent(By.className("Login-errorMessage")));
  }
  
  @Test
  public void login_with_bad_credentials() throws Exception {
	  userField.clear();
	  userField.sendKeys("foo");
	  pwField.clear();
	  pwField.sendKeys("bar");
	  submitButton.click();
	  Thread.sleep(5000);
	  assertTrue("Login field should still be present", isElementPresent(By.className("Login-root")));
	  assertTrue("Login error message should appear", isElementPresent(By.className("Login-errorMessage")));
  }
  
  @Test
  public void click_behind_login() throws Exception {
	  jobsButton.click();
	  Thread.sleep(5000);
	  assertEquals("Should not navigate away", driver.getCurrentUrl(), baseUrl);
  }

  @After 
  public void tearDown() throws Exception {
    driver.quit();
  }

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }
}
