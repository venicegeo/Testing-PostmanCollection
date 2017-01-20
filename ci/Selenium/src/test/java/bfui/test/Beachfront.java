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
		
		ef.put("coordSubmitButton",		By.cssSelector("button[type=submit]"));
		ef.put("searchButton",			By.className("PrimaryMap-search"));
		ef.put("jobsButton",			By.className("Navigation-linkJobs"));
		ef.put("createJobButton",		By.className("Navigation-linkCreateJob"));
		ef.put("imageSearchButton",		By.cssSelector("button[type=submit]"));
		ef.put("zoomInButton",			By.className("ol-zoom-in"));
		ef.put("firstAlgButton",		By.className("Algorithm-startButton"));

		ef.put("coordText",				By.className("ol-mouse-position"));
		ef.put("invalidEntryText",		By.className("error-message"));
		ef.put("instructionText",		By.cssSelector("*"));

		ef.put("coordWindow",			By.className("coordinate-dialog"));
		ef.put("loginWindow",			By.className("Login-root"));
		ef.put("createJobWindow",		By.className("CreateJob-root"));
		ef.put("instructionWindow",		By.className("CreateJob-placeholder"));
		ef.put("searchOptionsWindow",	By.className("ImagerySearch-root"));
		
		ef.put("coordEntry",			By.cssSelector("input[placeholder='Enter Coordinates']"));
		ef.put("apiKeyEntry",			By.cssSelector("input"));
		ef.put("fromDateEntry",			By.cssSelector("input"));
		ef.put("toDateEntry",			By.cssSelector("input"));
		

		ef.put("sourceLabel",			By.className("CatalogSearchCriteria-source"));
		ef.put("apiKeyLabel",			By.className("CatalogSearchCriteria-apiKey"));
		ef.put("fromDateLabel",			By.className("CatalogSearchCriteria-captureDateFrom"));
		ef.put("toDateLabel",			By.className("CatalogSearchCriteria-captureDateTo"));

		ef.put("geoaxisLink",			By.tagName("a"));
		ef.put("algorithmList",			By.className("AlgorithmList-root"));
		ef.put("sourceDropdown",		By.tagName("select"));
		
		elementFinder = ef;
		
		
		// "Element Name" -> "Parent Element" map:
		Map<String, String> pf = new HashMap<String, String>();
		
		pf.put("coordEntry",			"coordWindow");
		pf.put("coordSubmitButton",		"coordWindow");
		pf.put("invalidEntryText",		"coordWindow");
		
		pf.put("geoaxisLink",			"loginWindow");
		
		pf.put("instructionWindow",		"createJobWindow");
		
		pf.put("instructionText",		"instructionWindow");

		pf.put("imageSearchButton",		"searchOptionsWindow");
		pf.put("apiKeyLabel",			"searchOptionsWindow");
		pf.put("fromDateLabel",			"searchOptionsWindow");
		pf.put("toDateLabel",			"searchOptionsWindow");
		pf.put("sourceLabel",			"searchOptionsWindow");

		pf.put("sourceDropdown",		"sourceLabel");
		pf.put("apiKeyEntry",			"apiKeyLabel");
		pf.put("fromDateEntry",			"fromDateLabel");
		pf.put("toDateEntry",			"toDateLabel");

		pf.put("firstAlgButton",		"algorithmList");
		
		
		
		parentFinder = pf;
		
	}
	
	@Override
	public WebElement getElement(String name) throws Exception {
		return getElement_INTERNAL(name, elementFinder, parentFinder, driver, wait);
	}

}
