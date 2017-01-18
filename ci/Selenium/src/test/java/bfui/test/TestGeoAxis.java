package bfui.test;

import org.junit.*;
import static org.junit.Assert.*;

import java.util.Arrays;

import org.openqa.selenium.*;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.firefox.FirefoxDriver;

public class TestGeoAxis {
	private WebDriver driver;
	private WebDriverWait wait;
	private Beachfront beachfront;
	private GX gx;

	// Strings used:
	private String baseUrl = System.getenv("bf_url");
	private String username = System.getenv("bf_username");
	private String password = System.getenv("bf_password");
	private String driverPath = System.getenv("driver_path");
	private String browserPath = System.getenv("browser_path");

	// Elements used:
	private WebElement jobsButton;
	private WebElement geoaxisLink;
	private WebElement GX_disadvantagedLink;
	private WebElement GX_userField;
	private WebElement GX_pwField;
	private WebElement GX_submitButton;


	@Before
	public void setUp() throws Exception {
		// Setup Browser:
		System.setProperty("webdriver.gecko.driver", driverPath);
		DesiredCapabilities caps = DesiredCapabilities.firefox();
		caps.setBrowserName("firefox");
		caps.setCapability("binary", browserPath);
		caps.setPlatform(Platform.ANY);
		driver = new FirefoxDriver(caps);
		wait = new WebDriverWait(driver, 5);
		beachfront = new Beachfront(driver);
		gx = new GX(driver);

		// Navigate to BF:
		driver.get(baseUrl);
	}

	@Test
	public void standard_login() throws Exception {
		
		// Click on GeoAxis Link:
		geoaxisLink = beachfront.getElement("geoaxisLink");
		geoaxisLink.click();
		Utils.assertThatAfterWait("Should navigate away from BF", ExpectedConditions.not(ExpectedConditions.urlMatches(baseUrl)), wait);
		
		// Find GeoAxis Elements:
		GX_disadvantagedLink = gx.getElement("disadvantagedLink");
		GX_disadvantagedLink.click();
		GX_userField = gx.getElement("userField");
		GX_pwField = gx.getElement("pwField");
		GX_submitButton = gx.getElement("submitButton");
		Utils.assertThatAfterWait("User/Password entry fields should be visible", ExpectedConditions.visibilityOfAllElements(Arrays.asList(GX_userField, GX_pwField, GX_submitButton)), wait);
		
		// Log In:
		GX_userField.sendKeys(username);
		GX_pwField.sendKeys(password);
		GX_submitButton.click();
		
		// Verify Returned to BF:
		Utils.assertThatAfterWait("Should navigate back to BF", ExpectedConditions.urlMatches(baseUrl), wait);
	}
	
	@Test
	public void attempt_bypass() throws Exception {
		driver.get(baseUrl + "?logged_in=true");
		jobsButton = beachfront.getElement("jobsButton");
		Thread.sleep(5000);
		try {
			wait.until(ExpectedConditions.elementToBeClickable(jobsButton));
			jobsButton.click();
		} catch (TimeoutException e) {
			// pass
		}
		assertFalse("Should not navigate to jobs", driver.getCurrentUrl().matches("job"));
	}

	@Test
	public void click_behind_login() throws Exception {
		jobsButton = beachfront.getElement("jobsButton");
		Thread.sleep(5000);
		try {
			wait.until(ExpectedConditions.elementToBeClickable(jobsButton));
			jobsButton.click();
		} catch (TimeoutException e) {
			// pass
		}
		assertFalse("Should not navigate to jobs", driver.getCurrentUrl().matches("job"));
	}

	@After 
	public void tearDown() throws Exception {
		driver.quit();
	}

}
