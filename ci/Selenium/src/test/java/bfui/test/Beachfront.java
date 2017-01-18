package bfui.test;

import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Beachfront extends PageObject {
	
	private WebDriver driver;
	private WebDriverWait wait;
	private Map<String, By> elementFinder;
	private Map<String, String> parentFinder;
	
	public Beachfront(WebDriver driver) {
		super(driver);
		this.driver = driver;
		wait = new WebDriverWait(driver, 5);
		
		// "Element Name" -> "By" map:
		Map<String, By> ef = new HashMap<String, By>();
		
		ef.put("coordSubmitButton",	By.cssSelector("button[type=submit]"));
		ef.put("searchButton",		By.className("PrimaryMap-search"));
		ef.put("jobsButton",		By.className("Navigation-linkJobs"));

		ef.put("coordText",			By.className("ol-mouse-position"));
		ef.put("invalidEntryText",	By.className("error-message"));

		ef.put("coordWindow",		By.className("coordinate-dialog"));
		ef.put("loginWindow",		By.className("Login-root"));
		
		ef.put("coordEntry",		By.cssSelector("input[placeholder='Enter Coordinates']"));
		
		ef.put("geoaxisLink",		By.tagName("a"));
		
		elementFinder = ef;
		
		
		// "Element Name" -> "Parent Element" map:
		Map<String, String> pf = new HashMap<String, String>();
		
		pf.put("coordEntry",		"coordWindow");
		pf.put("coordSubmitButton",	"coordWindow");
		pf.put("invalidEntryText",	"coordWindow");
		
		pf.put("geoaxisLink",		"loginWindow");
		
		parentFinder = pf;
		
	}
	
	@Override
	public WebElement getElement(String name) throws Exception {
		return getElement_INTERNAL(name, elementFinder, parentFinder, driver, wait);
	}

}
