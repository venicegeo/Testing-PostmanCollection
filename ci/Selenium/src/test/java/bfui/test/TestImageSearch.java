package bfui.test;

import static java.awt.event.InputEvent.BUTTON1_DOWN_MASK;
import static org.junit.Assert.*;

import java.awt.Robot;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class TestImageSearch {
	private WebDriver driver;
	private WebDriverWait wait;
	private DesiredCapabilities caps;
	private Robot robot;
	
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
	private WebElement algorithmList;
	private WebElement createJobButton;
	private WebElement createJobWindow;
	private WebElement searchOptionsWindow;
	private WebElement placeholderText;
	private WebElement placeholderArea;
	private WebElement searchButton;
	private WebElement imageSearchButton;
	private WebElement apiKeyEntry;
	private WebElement fromDateEntry;
	private WebElement toDateEntry;
	private WebElement coordWindow;
	private WebElement coordField;
	private WebElement submitButton;
	private WebElement zoomInButton;
	private WebElement firstAlgButton;
	private Select sourceSelection;

	@Before
	public void setUp() throws Exception {
		// Setup Browser:
		System.setProperty("webdriver.gecko.driver", driverPath);
		caps = DesiredCapabilities.firefox();
		caps.setBrowserName("firefox");
		caps.setCapability("binary", browserPath);
		caps.setPlatform(Platform.ANY);
		driver = new FirefoxDriver(caps);
		driver.manage().window().maximize();
		wait = new WebDriverWait(driver, 5);
		robot = new Robot();

		// Log in to GX:
		driver.get(gxUrl);
		driver.findElement(By.id("authmechlinks")).findElement(By.linkText("Disadvantaged Users")).click();
		driver.findElement(By.id("username")).sendKeys(username);
		driver.findElement(By.id("password")).sendKeys(password);
		driver.findElement(By.cssSelector("input[type=submit]")).click();
		wait.until(ExpectedConditions.urlContains(baseUrl));
		
		
	}

	@After
	public void tearDown() {
		driver.quit();
	}

	@Test
	public void image_search() throws InterruptedException {
		// Open Create Job Window:
		createJobButton = Utils.assertElementLoads("The 'Create Job' button should load", driver, wait, By.className("Navigation-linkCreateJob"));
		createJobButton.click();
		
		// Verify Create Job Window Opens and has expected contents:
		createJobWindow = Utils.assertElementLoads("The 'Create Job' window should load", driver, wait, By.className("CreateJob-root"));
		placeholderArea = Utils.assertElementLoads("The placeholder area should load before creating a job", createJobWindow, wait, By.className("CreateJob-placeholder"));
		placeholderText = Utils.assertElementLoads("The placeholder text should load before creating a job", placeholderArea, wait, By.cssSelector("*"));
		Utils.assertBecomesVisible("Placeholder text is visible", placeholderText, wait);
		Assert.assertTrue("Placeholder dialog prompts user to draw a bounding box", placeholderText.getText().matches(".*[Dd]raw.*[Bb]ound.*"));
		
		// Navigate to South America:
		searchButton = Utils.assertElementLoads("The search button should load", driver, wait, By.className("PrimaryMap-search"));
		searchButton.click();
		
		coordWindow = Utils.assertElementLoads("The coordinate window should load", driver, wait, By.className("coordinate-dialog"));
		coordField = Utils.assertElementLoads("The coordinate entry field should load", coordWindow, wait, By.cssSelector("input[placeholder='Enter Coordinates']"));
		submitButton = Utils.assertElementLoads("The coordinate entry field should load", coordWindow, wait, By.cssSelector("button[type=submit]"));
		
		// Check Normal Location
		coordField.sendKeys("-29,-49.5");
		submitButton.click();
		
		// Draw Bounding Box:
		robot.mouseMove(600, 300);
		robot.mousePress(BUTTON1_DOWN_MASK);
		robot.mouseRelease(BUTTON1_DOWN_MASK);
		robot.mouseMove(1000, 900);
		robot.mousePress(BUTTON1_DOWN_MASK);
		robot.mouseRelease(BUTTON1_DOWN_MASK);
		
		// Verify Options appeared:
		searchOptionsWindow = Utils.assertElementLoads("The Search options should load", driver, wait, By.className("ImagerySearch-root"));
		imageSearchButton = Utils.assertElementLoads("The image search button should load", searchOptionsWindow, wait, By.cssSelector("button[type=submit]"));
		apiKeyEntry = Utils.assertElementLoads("The API Key entry field should load", searchOptionsWindow, wait, By.className("CatalogSearchCriteria-apiKey")).findElement(By.tagName("input"));
		fromDateEntry = Utils.assertElementLoads("The 'From' date entry field should load", searchOptionsWindow, wait, By.className("CatalogSearchCriteria-captureDateFrom")).findElement(By.tagName("input"));
		toDateEntry = Utils.assertElementLoads("The 'To' date entry field should load", searchOptionsWindow, wait, By.className("CatalogSearchCriteria-captureDateTo")).findElement(By.tagName("input"));
		sourceSelection = new Select(Utils.assertElementLoads("The 'Source' drop-down should load", searchOptionsWindow, wait, By.className("CatalogSearchCriteria-source")).findElement(By.tagName("select")));
		
		// Enter Options:
		apiKeyEntry.clear();
//		apiKeyEntry.sendKeys(apiKeyPlanet);
		apiKeyEntry.sendKeys("garbage");
		fromDateEntry.clear();
		fromDateEntry.sendKeys(startDate);
		toDateEntry.clear();
		toDateEntry.sendKeys(endDate);
		sourceSelection.selectByValue("landsat");
		Utils.assertThatAfterWait("Search button should be clickable", ExpectedConditions.elementToBeClickable(imageSearchButton), wait);
		
		// Search for images:
		imageSearchButton.click();
		
		Thread.sleep(1000);
		
		// Zoom so a result fill screen & click:
		zoomInButton = Utils.assertElementLoads("The Zoom-in button should load", driver, wait, By.className("ol-zoom-in"));
		for (int i = 0; i<10; i++) {
			zoomInButton.click();
		}

		Thread.sleep(1000);
		robot.mousePress(BUTTON1_DOWN_MASK);
		robot.mouseRelease(BUTTON1_DOWN_MASK);
		
		// Run Algorithm:
		algorithmList = Utils.assertElementLoads("The available algorithm list should load", driver, wait, By.className("AlgorithmList-root"));
		firstAlgButton = Utils.assertElementLoads("The available algorithm list should load", algorithmList, wait, By.className("Algorithm-startButton"));
		firstAlgButton.click();
		Utils.assertThatAfterWait("Navigated to jobs page", ExpectedConditions.urlMatches(baseUrl + "jobs\\?jobId=.*"), wait);
		
	}

}
