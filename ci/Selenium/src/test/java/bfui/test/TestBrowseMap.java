package bfui.test;

import static org.junit.Assert.*;

import java.awt.Robot;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.*;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.DesiredCapabilities;

public class TestBrowseMap {
	private WebDriver driver;
	private Robot robot;
	
	
	
	// Strings used:
	private String baseUrl = System.getenv("bf_url");
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
	
	// Elements used:
	private WebElement searchButton;
	private WebElement coordWindow;
	private WebElement coordField;
	private WebElement coordText;
	private WebElement submitButton;
	
	@Before
	public void setUp() throws Exception {
		// Setup Browser:
		System.setProperty("webdriver.gecko.driver", driverPath);
		DesiredCapabilities caps = DesiredCapabilities.firefox();
		caps.setBrowserName("firefox");
		caps.setCapability("binary", browserPath);
		caps.setPlatform(Platform.ANY);
		driver = new FirefoxDriver(caps);
		robot = new Robot();

		// Navigate to BF:
		driver.get(baseUrl);

		// Check that navigation to BF was successful.
		assertEquals("Should be at correct Url", driver.getCurrentUrl(), baseUrl);
		assertTrue("Login field should be present", Utils.isElementPresent(driver, By.className("Login-root")));

		// Login to BF:
		Utils.typeToFocus(driver, username);
		Utils.typeToFocus(driver, Keys.TAB);
		Utils.typeToFocus(driver, password);
		Utils.typeToFocus(driver, Keys.ENTER);
		Thread.sleep(5000);
		assertFalse("Startup login attampt should be successful", Utils.isElementPresent(driver, By.className("Login-root")));
		
		// Find the elements used in tests:
		searchButton = driver.findElement(By.className("PrimaryMap-search"));
		coordText = driver.findElement(By.className("ol-mouse-position"));
	}
	
	@Test
	public void enter_coords() throws Exception {
		searchButton.click();
		Thread.sleep(1000);
		assertTrue("Coordinate window should open", Utils.isElementPresent(driver, By.className("coordinate-dialog")));
		
		coordWindow = driver.findElement(By.className("coordinate-dialog"));
		coordField = coordWindow.findElement(By.cssSelector("input[placeholder='Enter Coordinates']"));
		submitButton = coordWindow.findElement(By.cssSelector("button[type=submit]"));
		
		// Check Normal Location
		coordField.sendKeys(Double.toString(SriLankaLat) + ", " + Double.toString(SriLankaLon));
		Thread.sleep(1000);
		submitButton.click();
		
		robot.mouseMove(350, 350);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("Sri Lanka Jump", lat, SriLankaLat, 5);
		Utils.assertLonInRange("Sri Lanka Jump", lon, SriLankaLon, 5);

		// Check +Antimeridian
		searchButton.click();
		Thread.sleep(1000);
		coordField.sendKeys(Double.toString(PosDateLineLat) + ", " + Double.toString(PosDateLineLon));
		Thread.sleep(1000);
		submitButton.click();
		
		robot.mouseMove(351, 351);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("+180 Longitude Jump", lat, PosDateLineLat, 5);
		Utils.assertLonInRange("+180 Longitude Jump", lon, PosDateLineLon, 5);
		
		// Check -Antimeridian
		searchButton.click();
		Thread.sleep(1000);
		coordField.sendKeys(Double.toString(NegDateLineLat) + ", " + Double.toString(NegDateLineLon));
		Thread.sleep(5000);
		submitButton.click();
		
		robot.mouseMove(352, 352);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("-180 Longitude Jump", lat, NegDateLineLat, 5);
		Utils.assertLonInRange("-180 Longitude Jump", lon, NegDateLineLon, 5);
		
		// Check North Pole
		searchButton.click();
		Thread.sleep(1000);
		coordField.sendKeys(Double.toString(NorthPoleLat) + ", " + Double.toString(NorthPoleLon));
		Thread.sleep(1000);
		submitButton.click();
		
		robot.mouseMove(353, 353);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("North Pole Jump", lat, NorthPoleLat, 5);
		// No need to check longitude at poles.
		
		// Check South Pole
		searchButton.click();
		Thread.sleep(1000);
		coordField.sendKeys(Double.toString(SouthPoleLat) + ", " + Double.toString(SouthPoleLon));
		Thread.sleep(1000);
		submitButton.click();
		
		robot.mouseMove(354, 354);
		lat = findCoord(coordText.getAttribute("innerHTML"), true);
		lon = findCoord(coordText.getAttribute("innerHTML"), false);
		Utils.assertLatInRange("South Pole Jump", lat, SouthPoleLat, 5);
		// No need to check longitude at poles.
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