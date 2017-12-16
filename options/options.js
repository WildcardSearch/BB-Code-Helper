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
		lineBreaks: document.querySelector("#lineBreaks").value,
		outputFormat: document.querySelector("#outputFormat").value
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
		document.querySelector("#outputFormat").value = result.outputFormat || 0;
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
	var getting = browser.storage.local.get(["lineBreaks", "outputFormat"]);
	getting.then(setCurrentChoice, onError);
}

/**
 * localization/internationalization for the options page HTML
 *
 * @return void
 */
function loadLanguage() {
	["labelTitleBar", "optionBbCode", "optionMarkdown", "labelOutputFormat", "labelLineBreaks", "optionNone", "optionOne", "optionTwo", "submitSave"].forEach(key => {
		document.querySelector(`#${key}`).innerHTML = browser.i18n.getMessage(key);
	});
}

document.addEventListener("DOMContentLoaded", init);
document.querySelector("form").addEventListener("submit", saveOptions);
