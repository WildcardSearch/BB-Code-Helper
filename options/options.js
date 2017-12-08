/*
 * BB Code Helper
 * Copyright 2017 Mark Vincent
 * https://github.com/WildcardSearch/BB-Code-Helper
 *
 * this file contains options page functionality
 */

/**
 * initialize
 *
 * @return void
 */
function init() {
	restoreOptions();
	loadLanguage();
}

/**
 * options save handler
 *
 * @return void
 */
function saveOptions(e) {
	e.preventDefault();
	browser.storage.local.set({
		lineBreaks: document.querySelector("#lineBreaks").value
	});
}

/**
 * load the options from storage
 *
 * @return void
 */
function restoreOptions() {
	/**
	 * set value or use default
	 *
	 * @return void
	 */
	function setCurrentChoice(result) {
		document.querySelector("#lineBreaks").value = result.lineBreaks || 2;
	}

	/**
	 * log error
	 *
	 * @return void
	 */
	function onError(error) {
		console.log(`Error: ${error}`);
	}

	// retrieve setting value
	var getting = browser.storage.local.get("lineBreaks");
	getting.then(setCurrentChoice, onError);
}

/**
 * localization/internationalization for the options page HTML
 *
 * @return void
 */
function loadLanguage() {
	document.querySelector("#labelLineBreaks").innerHTML = browser.i18n.getMessage("labelLineBreaks");
	document.querySelector("#optionNone").innerHTML = browser.i18n.getMessage("optionNone");
	document.querySelector("#optionOne").innerHTML = browser.i18n.getMessage("optionOne");
	document.querySelector("#optionTwo").innerHTML = browser.i18n.getMessage("optionTwo");
	document.querySelector("#submitSave").innerHTML = browser.i18n.getMessage("submitSave");
}

document.addEventListener("DOMContentLoaded", init);
document.querySelector("form").addEventListener("submit", saveOptions);
