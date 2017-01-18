package bfui.test;

import static org.junit.Assert.*;

import java.awt.Robot;
import static java.awt.event.InputEvent.BUTTON1_DOWN_MASK;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.*;

import org.openqa.selenium.By;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class TestBrowseMap {
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
	
	
	
	private static double SriLankaLat = 7.5;
	private static double SriLankaLon = 80;
	private static double PosDateLineLat = 20;
	private static double PosDateLineLon = 180;
	private static double NegDateLineLat = 20;
	private static double NegDateLineLon = -180;
	private static double NorthPoleLat = 90;
	private static double NorthPoleLon = 5;
	private static double SouthPoleLat = -90;
	private static double SouthPoleLon = 5;

	private double lat;
	private double lon;
	private double OrigLat;
	private double OrigLon;
	
	// Elements used:
	private WebElement GX_userField;
	private WebElement GX_pwField;
	private WebElement GX_submitButton;
	
	private WebElement searchButton;
	private WebElement coordWindow;
	private WebElement coordEntry;
	private WebElement coordText;
	private WebElement invalidEntryText;
	private WebElement coordSubmitButton;
	private WebElement examplesText;
	private List<WebElement> examplesList;
	
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
	
	@Test
	public void enter_coords() throws Exception {
		searchButton = beachfront.getElement("searchButton");
		coordText = beachfront.getElement("coordText");
		
		searchButton.click();
		
		// Find Coordinate window elements for the first time:
		coordWindow = beachfront.getElement("coordWindow");
		coordEntry = beachfront.getElement("coordEntry");
		coordSubmitButton = beachfront.getElement("coordSubmitButton");
		
		// Check Normal Location
		coordEntry.sendKeys(Double.toString(SriLankaLat) + ", " + Double.toString(SriLankaLon));
		coordSubmitButton.click();
		
		// Move mouse to get coordinates to appear in coordText.
		robot.mouseMove(350, 350);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("Sri Lanka Jump", lat, SriLankaLat, 5);
		Utils.assertLonInRange("Sri Lanka Jump", lon, SriLankaLon, 5);

		// Check +Antimeridian
		searchButton.click();
		wait.until(ExpectedConditions.elementToBeClickable(coordSubmitButton));
		coordEntry.sendKeys(Double.toString(PosDateLineLat) + ", " + Double.toString(PosDateLineLon));
		coordSubmitButton.click();
		
		robot.mouseMove(351, 351);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("+180 Longitude Jump", lat, PosDateLineLat, 5);
		Utils.assertLonInRange("+180 Longitude Jump", lon, PosDateLineLon, 5);
		
		// Check -Antimeridian
		searchButton.click();
		wait.until(ExpectedConditions.elementToBeClickable(coordSubmitButton));
		coordEntry.sendKeys(Double.toString(NegDateLineLat) + ", " + Double.toString(NegDateLineLon));
		coordSubmitButton.click();
		
		robot.mouseMove(352, 352);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("-180 Longitude Jump", lat, NegDateLineLat, 5);
		Utils.assertLonInRange("-180 Longitude Jump", lon, NegDateLineLon, 5);
		
		// Check North Pole
		searchButton.click();
		wait.until(ExpectedConditions.elementToBeClickable(coordSubmitButton));
		coordEntry.sendKeys(Double.toString(NorthPoleLat) + ", " + Double.toString(NorthPoleLon));
		coordSubmitButton.click();
		
		robot.mouseMove(353, 353);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("North Pole Jump", lat, NorthPoleLat, 5);
		// No need to check longitude at poles.
		
		// Check South Pole
		searchButton.click();
		wait.until(ExpectedConditions.elementToBeClickable(coordSubmitButton));
		coordEntry.sendKeys(Double.toString(SouthPoleLat) + ", " + Double.toString(SouthPoleLon));
		coordSubmitButton.click();
		
		robot.mouseMove(354, 354);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("South Pole Jump", lat, SouthPoleLat, 5);
		// No need to check longitude at poles.
	}
	
	@Test
	public void invalid_coords_entered() throws Exception {
		searchButton = beachfront.getElement("searchButton");
		searchButton.click();
		
		// Find Coordinate window elements for the first time:
		coordWindow = beachfront.getElement("coordWindow");
		coordEntry = beachfront.getElement("coordEntry");
		coordSubmitButton = beachfront.getElement("coordSubmitButton");
		
		// Try garbage text:
		coordEntry.sendKeys("garbage");
		coordSubmitButton.click();
		
		// Get Invalid Entry text for the first time:
		invalidEntryText = beachfront.getElement("invalidEntryText");
		Utils.assertBecomesVisible("Error message should appear for the string 'garbage'", invalidEntryText, wait);
		
		coordEntry.clear();
		coordEntry.sendKeys("50");
		coordSubmitButton.click();
		Utils.assertBecomesVisible("Error message should appear for only one coordinate", invalidEntryText, wait);
		
		coordEntry.clear();
		coordEntry.sendKeys("95, 10");
		coordSubmitButton.click();
		Utils.assertBecomesVisible("Error message should appear for lat = 95", invalidEntryText, wait);

		coordEntry.clear();
		coordEntry.sendKeys("10, 185");
		coordSubmitButton.click();
		Utils.assertBecomesVisible("Error message should appear for lon = 185", invalidEntryText, wait);
		
	}
	
	@Test @Ignore
	public void panning() throws Exception {
		coordText = Utils.assertElementLoads("The mouse-over coordinates should load", driver, wait, By.className("ol-mouse-position"));
		
		// Move onto map, zoom (to give space to pan), move (to refresh coords)
		robot.mouseMove(350, 350);
		robot.mouseWheel(-5);
		robot.mouseMove(350, 351);
		
		// Get starting Coordinates.
		OrigLat = findCoord(coordText.getAttribute("innerHTML"), true);
		OrigLon = findCoord(coordText.getAttribute("innerHTML"), false);
		
		// Pan Left:
		robot.mouseMove(350, 350);
		robot.mousePress(BUTTON1_DOWN_MASK);
		Thread.sleep(1000);
		robot.mouseMove(550, 350);
		Thread.sleep(1000);
		robot.mouseRelease(BUTTON1_DOWN_MASK);
		
		// Verify original coordinates:
		robot.mouseMove(550, 351);
		assertEquals("Latitude should not change after left pan", OrigLat, findCoord(coordText.getAttribute("innerHTML"), true), 0.1);
		assertEquals("Longitude should not change after left pan", OrigLon, findCoord(coordText.getAttribute("innerHTML"), false), 0.1);
		// click down mouse
		// move mouse
		// release mouse
		// move 1 pixel
		// read coords (samish)
		// move to original space
		// read coords (different)
	}
	
	@Test
	public void validate_example_coords() throws InterruptedException {
		// Open the coordinate window
		searchButton = Utils.assertElementLoads("The search button should load", driver, wait, By.className("PrimaryMap-search"));
		searchButton.click();
		// Get coordinate window elements
		coordWindow = Utils.assertElementLoads("The coordinate window should load", driver, wait, By.className("coordinate-dialog"));
		coordEntry = Utils.assertElementLoads("The coordinate entry field should load", coordWindow, wait, By.cssSelector("input[placeholder='Enter Coordinates']"));
		examplesText = Utils.assertElementLoads("The coordinate window should display examples", coordWindow, wait, By.xpath("//*[contains(text(), 'Examples')]"));
		coordSubmitButton = Utils.assertElementLoads("The coordinate entry field should load", coordWindow, wait, By.cssSelector("button[type=submit]"));
		
		examplesList = examplesText.findElements(By.tagName("code"));
		for (WebElement example : examplesList) {
			// For each example, enter the provided text
			searchButton.click();
			coordEntry.clear();
			coordEntry.sendKeys(example.getText());
			coordSubmitButton.click();
			// Assert that the example worked by making sure the coordinate window disappeared.
			Utils.assertBecomesInvisible("The example coordinates (" + example.getText() + ") should work successfully", coordWindow, wait);
		}
	}
	
	@After 
	public void tearDown() throws Exception {
		driver.quit();
	}
	
	private double findCoord(String input, boolean isLat) {
		Pattern p;
		Matcher m;
		int sign;
		if (isLat) {
			p = Pattern.compile("(\\d+)(?=°[^EW]*[NS])");
			if (input.indexOf('N') >= 0) {
				sign = 1;
			} else {
				sign = -1;
			}
		} else {
			p = Pattern.compile("(\\d+)(?=°[^NS]*[EW])");
			if (input.indexOf('E') >= 0) {
				sign = 1;
			} else {
				sign = -1;
			}
		}
		m = p.matcher(input);
		assertTrue("Cursor coordinates should be visible on screen", m.find());
		return sign*Double.parseDouble(m.group());
	}
}