/*
 * BB Code Helper
 * Copyright 2017 Mark Vincent
 * https://github.com/WildcardSearch/BB-Code-Helper
 *
 * this file contains content scripts for clipboard manipulation
 */

/**
 * @var string
 */
var clipboardText = "";

/**
 * launch a fake copy event and hijack it with our own text
 *
 * @param  string
 * @param  boolean
 * @return void
 */
function copyTag(text, append) {
	/**
	 * event handler for synthetic copy event
	 *
	 * @param  event
	 * @return void
	 */
	function onCopy(e) {
		document.removeEventListener("copy", onCopy, true);
		e.stopImmediatePropagation();
		e.preventDefault();

		// multi-mode
		if (append &&
			clipboardText.length > 0) {
			text = clipboardText + "\n" + text;
		}

		e.clipboardData.setData("text/plain", text);
		e.clipboardData.setData("text/html", "");
	}
	document.addEventListener("copy", onCopy, true);
	document.execCommand("copy");
}

/**
 * launch a fake paste event and use it to fetch the clipboard data
 *
 * @return void
 */
function getClipboardData() {
	/**
	 * event handler for synthetic paste event
	 *
	 * @return void
	 */
	function onPaste(e) {
		document.removeEventListener("paste", onPaste, true);
		e.stopImmediatePropagation();

		// set global variables to be used when copying tags
		clipboardText = e.clipboardData.getData("text/plain");
	}
	document.addEventListener("paste", onPaste, true);
	document.execCommand("paste");
}