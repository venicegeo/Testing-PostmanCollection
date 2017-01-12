package bfui.test;

import static org.junit.Assert.*;

import java.awt.Robot;

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
	
	private static String SriLankaCoords = "7.5, 80";
	
	
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
		
		coordField.sendKeys(SriLankaCoords);
		submitButton.click();
		
		robot.mouseMove(350, 350);
		System.out.println("Current Coord: " + coordText.getAttribute("innerHTML"));
		
	}
	
	@After 
	public void tearDown() throws Exception {
		driver.quit();
	}
}