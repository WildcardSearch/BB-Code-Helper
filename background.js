/*
 * BB Code Helper
 * Copyright 2017 Mark Vincent
 * https://github.com/WildcardSearch/BB-Code-Helper
 *
 * this file contains content scripts for clipboard manipulation
 */

browser.contextMenus.create({
	id: "mft-selection-quote",
	title: browser.i18n.getMessage("menuItemQuote"),
	contexts: ["selection"],
});

browser.contextMenus.create({
	id: "mft-selection-code",
	title: browser.i18n.getMessage("menuItemCode"),
	contexts: ["selection"],
});

browser.contextMenus.create({
	id: "mft-image-full",
	title: browser.i18n.getMessage("menuItemImageFull"),
	contexts: ["image"],
});

browser.contextMenus.create({
	id: "mft-image",
	title: browser.i18n.getMessage("menuItemImage"),
	contexts: ["image"],
});

browser.contextMenus.create({
	id: "mft-link",
	title: browser.i18n.getMessage("menuItemLink"),
	contexts: ["link"],
});

browser.contextMenus.create({
	id: "mft-clear-clipboard",
	title: browser.i18n.getMessage("menuClearClipboard"),
	contexts: ["all"],
});

var multiMode = false;
browser.contextMenus.create({
	id: "mft-multi-mode",
	title: browser.i18n.getMessage("menuItemMultiMode"),
	type: "checkbox",
	contexts: ["all"],
	checked: multiMode,
});

browser.contextMenus.onClicked.addListener(onClicked);

/**
 * event handler for context menu click
 *
 * @param  object
 * @param  object
 * @return void
 */
function onClicked(info, tab) {
	if (["mft-selection-quote", "mft-selection-code", "mft-image-full", "mft-image", "mft-link", "mft-multi-mode", "mft-clear-clipboard"].indexOf(info.menuItemId) === -1) {
		return;
	}

	var text = "",
		sep = "\n\n",
		promiseChain = loadContentScript(tab);

	switch (info.menuItemId) {
	case "mft-multi-mode":
		multiMode = !multiMode;
		return;
	case "mft-clear-clipboard":
		promiseChain.then(() => {
			sendToClipboard(tab);
		});
		return;
	case "mft-selection-quote":
		if (typeof info.selectionText == "undefined" ||
			!info.selectionText) {
			return;
		}

		text = `[quote]${info.selectionText}[/quote]`;
		break;
	case "mft-selection-code":
		if (typeof info.selectionText == "undefined" ||
			!info.selectionText) {
			return;
		}

		text = `[code]${info.selectionText}[/code]`;
		break;
	case "mft-image-full":
		if (typeof info.srcUrl === "undefined" ||
			!info.srcUrl) {
			return;
		}

		if (typeof info.linkUrl !== "undefined" &&
			info.linkUrl) {
			text = `[url=${info.linkUrl}][img]${info.srcUrl}[/img][/url]`;
		} else {
			text = `[img]${info.srcUrl}[/img]`;
		}
		break;
	case "mft-image":
		if (typeof info.srcUrl == "undefined" ||
			!info.srcUrl) {
			return;
		}

		text = `[img]${info.srcUrl}[/img]`;
		break;
	case "mft-link":
		if (typeof info.linkUrl == "undefined" ||
			!info.linkUrl) {
			return;
		}

		if (typeof info.linkText != "undefined" &&
			info.linkText &&
			info.linkText != info.linkUrl) {
			text = `[url=${info.linkUrl}]${info.linkText}[/url]`;
		} else {
			text = `[url]${info.linkUrl}[/url]`;
		}
		break;
	}

	text = text
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	promiseChain.then(() => {
		return browser.tabs.executeScript(tab.id, {
			code: "getClipboardData();",
		});
	}).then(() => {
		return browser.storage.local.get("lineBreaks");
	}).then((results) => {
		if (!results ||
			!results.lineBreaks ||
			results.lineBreaks == 0) {
			sep = "";
		} else if (results.lineBreaks == 1) {
			sep = "\n";
		}

		return sendToClipboard(tab, text, multiMode, sep);
	}).catch((error) => {
		console.error(browser.i18n.getMessage("errorGeneric") + error);
	});
}

/**
 * load the content script, if necessary
 *
 * @param  Object
 * @return Promise
 */
function loadContentScript(tab) {
	return browser.tabs.executeScript(tab.id, {
		code: "typeof copyTag === 'function';",
	}).then((results) => {
		if (!results ||
			results[0] !== true) {
			return browser.tabs.executeScript(tab.id, {
				file: "clipboard-helper.js",
			});
		}
	})
}

/**
 * glue all options together and call the content script
 *
 * @param  Object
 * @param  String
 * @param  Boolean
 * @param  String
 * @return Promise
 */
function sendToClipboard(tab, text, append, sep) {
	var copyCode = "";

	text = text ? JSON.stringify(text) : '""';
	append = append === true ? "true" : "false";
	sep = sep ? JSON.stringify(sep) : '""';

	copyCode = `copyTag(${text}, ${append}, ${sep});`;

	return browser.tabs.executeScript(tab.id, {
		code: copyCode,
	});
}
