package bfui.test;

import static org.junit.Assert.*;

import java.io.File;
import java.util.Arrays;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxBinary;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class TestImageSearch {
	private WebDriver driver;
	private Actions actions;
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
	{
		if (apiKeyPlanet == null) {
			apiKeyPlanet = "garbage";
		}
	}
	
	private String startDate = "2016-11-01";
	private String endDate = "2016-11-05";
	
	// Elements Used:
	private WebElement GX_userField;
	private WebElement GX_pwField;
	private WebElement GX_submitButton;
	
	private WebElement createJobButton;
	private WebElement instructionText;
	private WebElement searchButton;
	private WebElement imageSearchButton;
	private WebElement apiKeyEntry;
	private WebElement fromDateEntry;
	private WebElement toDateEntry;
	private WebElement coordEntry;
	private WebElement coordSubmitButton;
	private WebElement zoomInButton;
	private WebElement firstAlgButton;
	private WebElement mapCanvas;
	private WebElement cloudSlider;
	private WebElement cloudText;
	private WebElement searchLoadingMask;
	private WebElement clearButton;
	private Select sourceDropdown;

	@Before
	public void setUp() throws Exception {
		// Setup Browser:
		driver = Utils.createWebDriver(browserPath, driverPath);

		wait = new WebDriverWait(driver, 5);
		actions = new Actions(driver);
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
		
		// Maximize so image search isn't covered.
		driver.manage().window().maximize();
		
		// Open Create Job Window:
		createJobButton = beachfront.getElement("createJobButton");
		createJobButton.click();
		instructionText = beachfront.getElement("instructionText");
		Utils.assertThatAfterWait("Instructions should become visible", ExpectedConditions.visibilityOf(instructionText), wait);
		
		
	}

	@After
	public void tearDown() {
		driver.quit();
	}

	@Test
	public void image_search() throws Exception {
		// Verify Create Job Window Opens and has expected contents:
		assertTrue("Instructions should prompt user to draw a bounding box", instructionText.getText().matches(".*[Dd]raw.*[Bb]ound.*"));
		
		// Navigate to South America:
		mapCanvas	= beachfront.getElement("mapCanvas");
		searchButton = beachfront.getElement("searchButton");
		searchButton.click();
		
		coordEntry = beachfront.getElement("coordEntry");
		coordSubmitButton = beachfront.getElement("coordSubmitButton");
		
		coordEntry.sendKeys("-29,-49.5");
		coordSubmitButton.click();
		
		// Draw Bounding Box:
		actions.moveToElement(mapCanvas, 500, 100).build().perform();
		Thread.sleep(1000);
		actions.click().build().perform();
		Thread.sleep(1000);
		actions.moveByOffset(600, 500).build().perform();
		actions.click().build().perform();
		Thread.sleep(1000);
		
		// Verify Options appeared:
		imageSearchButton = beachfront.getElement("imageSearchButton");
		apiKeyEntry = beachfront.getElement("apiKeyEntry");
		fromDateEntry = beachfront.getElement("fromDateEntry");
		toDateEntry = beachfront.getElement("toDateEntry");
		sourceDropdown = new Select(beachfront.getElement("sourceDropdown"));
		
		// Enter Options:
		apiKeyEntry.clear();
		apiKeyEntry.sendKeys(apiKeyPlanet);
		fromDateEntry.clear();
		fromDateEntry.sendKeys(startDate);
		toDateEntry.clear();
		toDateEntry.sendKeys(endDate);
		sourceDropdown.selectByValue("rapideye");
		Utils.assertThatAfterWait("Search button should be clickable", ExpectedConditions.elementToBeClickable(imageSearchButton), wait);
		
		// Search for images:
		imageSearchButton.click();
		Thread.sleep(1000);
		
		// Zoom so a result fill screen & click:
		zoomInButton = beachfront.getElement("zoomInButton");
		for (int i = 0; i<10; i++) {
			zoomInButton.click();
		}
		actions.moveToElement(mapCanvas).build().perform();
		actions.click().build().perform();
		
		// Run Algorithm:
		firstAlgButton = beachfront.getElement("firstAlgButton");
		firstAlgButton.click();
		Utils.assertThatAfterWait("Navigated to jobs page", ExpectedConditions.urlMatches(baseUrl + "jobs\\?jobId=.*"), wait);
	}
	
	@Test
	public void exercise_cloud_slider() throws Exception {
		
		// Draw Bounding Box:
		actions.moveToElement(mapCanvas, 500, 0).click().moveByOffset(200, 200).click().build().perform();
		
		// Find Search Options:
		apiKeyEntry = beachfront.getElement("apiKeyEntry");
		cloudSlider = beachfront.getElement("cloudSlider");
		cloudText = beachfront.getElement("cloudText");
		
		// Exercise Cloud Cover slider:
		assertEquals("Cloud cover slider should start at 10", 10, Integer.parseInt(cloudSlider.getAttribute("value")));
		actions.moveToElement(cloudSlider).click().build().perform();
		assertEquals("Cloud cover slider should move to center", 50, Integer.parseInt(cloudSlider.getAttribute("value")));
		actions.clickAndHold(cloudSlider).moveByOffset(5, 0).build().perform();
		assertTrue("Cloud cover slider value should increase", Integer.parseInt(cloudSlider.getAttribute("value")) > 50);
		actions.clickAndHold(cloudSlider).moveByOffset(-15, 0).build().perform();
		assertTrue("Cloud cover slider value should decrease", Integer.parseInt(cloudSlider.getAttribute("value")) < 50);
		assertTrue("Cloud cover display should match value", cloudText.getText().contains(cloudSlider.getAttribute("value")));
		
	}
	
	@Test
	public void exercise_dates() throws Exception {
		// Draw Bounding Box:
		actions.moveToElement(mapCanvas, 500, 0).click().moveByOffset(200, 200).click().build().perform();
		
		// Find Search Options:
		apiKeyEntry = beachfront.getElement("apiKeyEntry");
		fromDateEntry = beachfront.getElement("fromDateEntry");
		toDateEntry = beachfront.getElement("toDateEntry");
		imageSearchButton = beachfront.getElement("imageSearchButton");
		
		// Enter API Key:
		apiKeyEntry.clear();
		apiKeyEntry.sendKeys(apiKeyPlanet);
		
		// Verify values entered correctly:
		fromDateEntry.clear();
		fromDateEntry.sendKeys(startDate);
		assertEquals("`From Date` should match entered value", startDate, fromDateEntry.getAttribute("value"));
		toDateEntry.clear();
		toDateEntry.sendKeys(endDate);
		assertEquals("`To Date` should match entered value", endDate, toDateEntry.getAttribute("value"));

		// Try good dates search:
		Utils.assertThatAfterWait("Search button should be clickable", ExpectedConditions.elementToBeClickable(imageSearchButton), wait);
		imageSearchButton.click();
		searchLoadingMask = beachfront.getElement("searchLoadingMask");
		Utils.assertThatAfterWait("Loading mask should appear", ExpectedConditions.visibilityOf(searchLoadingMask), wait);
		Utils.assertThatAfterWait("Search button should be clickable after normal search", ExpectedConditions.elementToBeClickable(imageSearchButton), wait);
		
		// Try garbage fromDate search:
		fromDateEntry.clear();
		fromDateEntry.sendKeys("garbage");
		toDateEntry.clear();
		toDateEntry.sendKeys(endDate);
		imageSearchButton.click();
		searchLoadingMask = beachfront.getElement("searchLoadingMask");
		Utils.assertThatAfterWait("Loading mask should appear", ExpectedConditions.visibilityOf(searchLoadingMask), wait);
		Utils.assertThatAfterWait("Search button should be clickable after bad search", ExpectedConditions.elementToBeClickable(imageSearchButton), wait);	
		
		// Try garbage toDate search:
		fromDateEntry.clear();
		fromDateEntry.sendKeys(startDate);
		toDateEntry.clear();
		toDateEntry.sendKeys("garbage");
		imageSearchButton.click();
		searchLoadingMask = beachfront.getElement("searchLoadingMask");
		Utils.assertThatAfterWait("Loading mask should appear", ExpectedConditions.visibilityOf(searchLoadingMask), wait);
		Utils.assertThatAfterWait("Search button should be clickable after bad search", ExpectedConditions.elementToBeClickable(imageSearchButton), wait);	
	}
	
	@Test
	public void clear_bounding_box() throws Exception {
		// Draw Bounding Box:
		actions.moveToElement(mapCanvas, 500, 0).click().moveByOffset(200, 200).click().build().perform();
		
		// Press clear button:
		clearButton = beachfront.getElement("clearButton");
		clearButton.click();
		
		// Make sure prompt returns:
		instructionText = beachfront.getElement("instructionText");
		Utils.assertThatAfterWait("Instructions should become visible", ExpectedConditions.visibilityOf(instructionText), wait);
		Utils.assertThatAfterWait("The clear button should become stale", ExpectedConditions.stalenessOf(clearButton), wait);
		
		// Make sure a bounding box can be redrawn:
		actions.moveToElement(mapCanvas, 500, 0).click().moveByOffset(200, 200).click().build().perform();
		
		// Verify that a bounding box was redrawn by checking that the clear button returns:
		clearButton = beachfront.getElement("clearButton");
		Utils.assertThatAfterWait("Clear button should return after the bounding box is redrawn", ExpectedConditions.visibilityOf(clearButton), wait);
		
		
	}
}
