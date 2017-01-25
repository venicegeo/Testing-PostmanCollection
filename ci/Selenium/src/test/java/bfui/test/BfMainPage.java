package bfui.test;

import static org.junit.Assert.assertTrue;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class BfMainPage {
	
	@FindBy(className = "Login-button")				public WebElement geoAxisLink;
	@FindBy(className = "Navigation-linkJobs")		public WebElement jobsButton;
	@FindBy(className = "PrimaryMap-search")		public WebElement searchButton;
	@FindBy(className = "ol-mouse-position")		public WebElement mouseoverCoordinates;
	@FindBy(className = "ol-unselectable")			public WebElement canvas;
	@FindBy(className = "coordinate-dialog")		public WebElement searchWindow;
	
	
	
	public BfMainPage(WebDriver driver) {
		PageFactory.initElements(driver, this);
	}
	
	public BfSearchWindowPage searchWindow() {
		return new BfSearchWindowPage(searchWindow);
	}
	
	public void tryToClickJobs() {
		try {
			jobsButton.click();
		} catch (NoSuchElementException e) {
			throw e;
		}
	}
	
	public double getLatitude() {
		String coordinates = mouseoverCoordinates.getText();
		Pattern p;
		Matcher m;
		int sign;
		p = Pattern.compile("(\\d+)(?=°[^EW]*[NS])");
		if (coordinates.indexOf('N') >= 0) {
			sign = 1;
		} else {
			sign = -1;
		}
		m = p.matcher(coordinates);
		assertTrue("Should be able to parse latitude from the mouseover coordinates", m.find());
		return sign*Double.parseDouble(m.group());
	}
	
	public double getLongitude() {
		String coordinates = mouseoverCoordinates.getText();
		Pattern p;
		Matcher m;
		int sign;
		p = Pattern.compile("(\\d+)(?=°[^NS]*[EW])");
		if (coordinates.indexOf('E') >= 0) {
			sign = 1;
		} else {
			sign = -1;
		}
		m = p.matcher(coordinates);
		assertTrue("Should be able to parse longitude from the mouseover coordinates", m.find());
		return sign*Double.parseDouble(m.group());
	}
}
