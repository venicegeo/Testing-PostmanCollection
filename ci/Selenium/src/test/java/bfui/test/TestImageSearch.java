package bfui.test;

import static java.awt.event.InputEvent.BUTTON1_DOWN_MASK;
import static org.junit.Assert.*;

import java.awt.Robot;
import java.io.File;
import java.util.Arrays;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxBinary;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class TestImageSearch {
	private WebDriver driver;
	private Robot robot;
	private WebDriverWait wait;
	private Beachfront beachfront;
	private GX gx;
	
	// Strings used:
	private String baseUrl = System.getenv("bf_url");
	private String gxUrl = System.getenv("GX_url");
	private String username = System.getenv("bf_username");
	private String password = System.getenv("bf_password");
	private String driverPath = System.getenv("driver_path");
	private String browserPath = System.getenv("browser_path");
	private String apiKeyPlanet = System.getenv("API_Key_Planet");
	
	private String startDate = "2016-11-01";
	private String endDate = "2016-11-05";
	
	// Elements Used:
	private WebElement GX_userField;
	private WebElement GX_pwField;
	private WebElement GX_submitButton;
	
	private WebElement algorithmList;
	private WebElement createJobButton;
	private WebElement searchOptionsWindow;
	private WebElement instructionText;
	private WebElement searchButton;
	private WebElement imageSearchButton;
	private WebElement apiKeyEntry;
	private WebElement fromDateEntry;
	private WebElement toDateEntry;
	private WebElement coordWindow;
	private WebElement coordEntry;
	private WebElement coordSubmitButton;
	private WebElement zoomInButton;
	private WebElement firstAlgButton;
	private Select sourceDropdown;

	@Before
	public void setUp() throws Exception {
		// Setup Browser:
		System.setProperty("webdriver.gecko.driver", driverPath);
		FirefoxBinary binary =new FirefoxBinary(new File(browserPath));
		FirefoxProfile profile = new FirefoxProfile();
		driver = new FirefoxDriver(binary, profile);
		wait = new WebDriverWait(driver, 5);
		robot = new Robot();
		beachfront = new Beachfront(driver);
		gx = new GX(driver);

		// Log in to GX:
		driver.get(gxUrl);
		// Find GeoAxis Elements:
		gx.getElement("disadvantagedLink").click();
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

	@After
	public void tearDown() {
		driver.quit();
	}

	@Test
	public void image_search() throws Exception {
		driver.manage().window().maximize(); // Maximize so image search isn't covered.
		// Open Create Job Window:
		createJobButton = beachfront.getElement("createJobButton");
		createJobButton.click();
		
		// Verify Create Job Window Opens and has expected contents:
		instructionText = beachfront.getElement("instructionText");
		Utils.assertThatAfterWait("Instructions should become visible", ExpectedConditions.visibilityOf(instructionText), wait);
		assertTrue("Instructions should prompt user to draw a bounding box", instructionText.getText().matches(".*[Dd]raw.*[Bb]ound.*"));
		
		// Navigate to South America:
		searchButton = beachfront.getElement("searchButton");
		searchButton.click();
		
		coordWindow = beachfront.getElement("coordWindow");
		coordEntry = beachfront.getElement("coordEntry");
		coordSubmitButton = beachfront.getElement("coordSubmitButton");
		
		// Check Normal Location
		coordEntry.sendKeys("-29,-49.5");
		coordSubmitButton.click();
		
		// Draw Bounding Box:
		robot.mouseMove(600, 300);
		robot.mousePress(BUTTON1_DOWN_MASK);
		robot.mouseRelease(BUTTON1_DOWN_MASK);
		robot.mouseMove(1000, 900);
		robot.mousePress(BUTTON1_DOWN_MASK);
		robot.mouseRelease(BUTTON1_DOWN_MASK);
		
		// Verify Options appeared:
		imageSearchButton = beachfront.getElement("imageSearchButton");
		apiKeyEntry = beachfront.getElement("apiKeyEntry");
		fromDateEntry = beachfront.getElement("fromDateEntry");
		toDateEntry = beachfront.getElement("toDateEntry");
		sourceDropdown = new Select(beachfront.getElement("sourceDropdown"));
		
		// Enter Options:
		apiKeyEntry.clear();
//		apiKeyEntry.sendKeys(apiKeyPlanet);
		apiKeyEntry.sendKeys("garbage");
		fromDateEntry.clear();
		fromDateEntry.sendKeys(startDate);
		toDateEntry.clear();
		toDateEntry.sendKeys(endDate);
		sourceDropdown.selectByValue("landsat");
		Utils.assertThatAfterWait("Search button should be clickable", ExpectedConditions.elementToBeClickable(imageSearchButton), wait);
		
		// Search for images:
		imageSearchButton.click();
		Thread.sleep(5000);
		
		Thread.sleep(1000);
		
		// Zoom so a result fill screen & click:
		zoomInButton = beachfront.getElement("zoomInButton");
		for (int i = 0; i<10; i++) {
			zoomInButton.click();
		}

		robot.mouseMove(1000, 600);
		Thread.sleep(1000);
		robot.mousePress(BUTTON1_DOWN_MASK);
		robot.mouseRelease(BUTTON1_DOWN_MASK);
		
		// Run Algorithm:
		firstAlgButton = beachfront.getElement("firstAlgButton");
		firstAlgButton.click();
		Utils.assertThatAfterWait("Navigated to jobs page", ExpectedConditions.urlMatches(baseUrl + "jobs\\?jobId=.*"), wait);
		
	}

}
