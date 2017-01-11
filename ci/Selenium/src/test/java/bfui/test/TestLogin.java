package bfui.test;

import org.junit.*;
import static org.junit.Assert.*;
import org.openqa.selenium.*;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.firefox.FirefoxDriver;

public class TestLogin {
	private WebDriver driver;

	// Strings used:
	private String baseUrl = System.getenv("bf_url");
	private String username = System.getenv("bf_username");
	private String password = System.getenv("bf_password");
	private String driverPath = System.getenv("driver_path");
	private String browserPath = System.getenv("browser_path");

	// Elements used:
	private WebElement pwField;
	private WebElement userField;
	private WebElement submitButton;
	private WebElement jobsButton;


	@Before
	public void setUp() throws Exception {
		// Setup Browser:
		System.setProperty("webdriver.gecko.driver", driverPath);
		DesiredCapabilities caps = DesiredCapabilities.firefox();
		caps.setBrowserName("firefox");
		caps.setCapability("binary", browserPath);
		caps.setPlatform(Platform.ANY);
		driver = new FirefoxDriver(caps);

		// Navigate to BF:
		driver.get(baseUrl);

		// Check that navigation to BF was successful.
		assertEquals("Should be at correct Url", driver.getCurrentUrl(), baseUrl);
		assertTrue("Login field should be present", Utils.isElementPresent(driver, By.className("Login-root")));

		// Find the elements used in tests:
		pwField = driver.findElement(By.cssSelector("input[placeholder=password]"));
		userField = driver.findElement(By.cssSelector("input[placeholder=username]"));
		submitButton = driver.findElement(By.cssSelector("button[type=submit]"));
		jobsButton = driver.findElement(By.className("Navigation-linkJobs"));
	}

	@Test
	public void standard_login() throws Exception {
		userField.sendKeys(username);
		assertEquals("Username should be correctly entered", username, userField.getAttribute("value"));
		pwField.clear();
		pwField.sendKeys(password);
		assertEquals("Password field should be configured as a password", "password", pwField.getAttribute("type"));
		assertEquals("Password should be correctly entered", password, pwField.getAttribute("value"));
		submitButton.click();
		Thread.sleep(5000);
		assertFalse("Login field should not be present after login attempt", Utils.isElementPresent(driver, By.className("Login-root")));
	}

	@Test
	public void login_just_keyboard() throws Exception {
		assertEquals("The username field should have focus", userField, Utils.getFocusedField(driver));
		Utils.typeToFocus(driver, username);
		assertEquals("Username should be correctly entered", username, userField.getAttribute("value"));
		Utils.typeToFocus(driver, Keys.TAB);
		assertEquals("The password field should have focus after TAB", pwField, Utils.getFocusedField(driver));
		Utils.typeToFocus(driver, password);
		assertEquals("Password field should be configured as a password", "password", pwField.getAttribute("type"));
		assertEquals("Password should be correctly entered", password, pwField.getAttribute("value"));
		Utils.typeToFocus(driver, Keys.ENTER);
		Thread.sleep(5000);
		assertFalse("Login field should not be present after login attempt", Utils.isElementPresent(driver, By.className("Login-root")));
	}

	@Test
	public void login_without_credentials() throws Exception {
		submitButton.click();
		Thread.sleep(5000);
		assertTrue("Login field should still be present", Utils.isElementPresent(driver, By.className("Login-root")));
		assertTrue("Login error message should appear", Utils.isElementPresent(driver, By.className("Login-errorMessage")));
	}

	@Test
	public void login_with_bad_credentials() throws Exception {
		userField.clear();
		userField.sendKeys("foo");
		pwField.clear();
		pwField.sendKeys("bar");
		submitButton.click();
		Thread.sleep(5000);
		assertTrue("Login field should still be present", Utils.isElementPresent(driver, By.className("Login-root")));
		assertTrue("Login error message should appear", Utils.isElementPresent(driver, By.className("Login-errorMessage")));
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

}
