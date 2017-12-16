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
	var text = "",
		sep = "\n\n",
		outputMarkdown = false,
		promiseChain;

	if (info.menuItemId == "mft-multi-mode") {
		multiMode = !multiMode;
		return;
	}

	if (["mft-selection-quote", "mft-selection-code", "mft-image-full", "mft-image", "mft-link", "mft-clear-clipboard"].indexOf(info.menuItemId) === -1) {
		return;
	}

	// load content script and settings
	promiseChain = loadContentScript(tab).then(() => {
		return browser.storage.local.get(["lineBreaks", "outputFormat"]);
	});

	if (info.menuItemId == "mft-clear-clipboard") {
		// clear clipboard
		promiseChain.then(() => {
			sendToClipboard(tab);
		});
		return;
	}

	promiseChain.then((result) => {
		if (typeof result === "undefined") {
			return;
		}

		if (!result.lineBreaks ||
			result.lineBreaks == 0) {
			sep = "";
		} else if (result.lineBreaks == 1) {
			sep = "\n";
		}

		text = processClick(info, result.outputFormat == 1);
		if (!text) {
			return;
		}

		return browser.tabs.executeScript(tab.id, {
			code: "getClipboardData();",
		});
	}).then(() => {
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
	});
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

/**
 * determine which tag has bee requested and return the appropriate string
 *
 * @param  object
 * @param  boolean
 * @return string
 */
function processClick(info, outputMarkdown) {
	var text = "";

	switch (info.menuItemId) {
	case "mft-selection-quote":
		if (typeof info.selectionText == "undefined" ||
			!info.selectionText) {
			return;
		}

		text = wrapQuote(info.selectionText, outputMarkdown);
		break;
	case "mft-selection-code":
		if (typeof info.selectionText == "undefined" ||
			!info.selectionText) {
			return;
		}

		text = wrapCode(info.selectionText, outputMarkdown);
		break;
	case "mft-image-full":
		if (typeof info.srcUrl === "undefined" ||
			!info.srcUrl) {
			return;
		}

		text = wrapImage(info.srcUrl, outputMarkdown);
		if (typeof info.linkUrl !== "undefined" &&
			info.linkUrl) {
			text = wrapLink(info.linkUrl, text, outputMarkdown);
		}
		break;
	case "mft-image":
		if (typeof info.srcUrl == "undefined" ||
			!info.srcUrl) {
			return;
		}

		text = wrapImage(info.srcUrl, outputMarkdown);
		break;
	case "mft-link":
		if (typeof info.linkUrl == "undefined" ||
			!info.linkUrl) {
			return;
		}

		text = wrapLink(info.linkUrl, info.linkText, outputMarkdown);
		break;
	}

	return text;
}

/**
 * return representation of quoted text
 *
 * @param  string
 * @param  boolean
 * @return string
 */
function wrapQuote(text, useMarkdown) {
	text = sanitizeText(text);

	if (useMarkdown !== true) {
		return `[quote]${text}[/quote]`;
	}

	return `> ${text}`;
}

/**
 * return representation of code block
 *
 * @param  string
 * @param  boolean
 * @return string
 */
function wrapCode(text, useMarkdown) {
	text = sanitizeText(text);

	if (useMarkdown !== true) {
		return `[code]${text}[/code]`;
	}

	return "```\n" + text + "\n```";
}

/**
 * return representation of link
 *
 * @param  string
 * @param  string
 * @param  boolean
 * @return string
 */
function wrapLink(url, caption, useMarkdown) {
	if (typeof url === "undefined" ||
		(typeof url === "string" && url.length == 0)) {
		return;
	}

	caption = sanitizeText(caption);

	if (useMarkdown !== true) {
		if (caption) {
			return `[url=${url}]${caption}[/url]`;
		}
		return `[url]${url}[/url]`;
	}

	return `[${caption}](${url})`;
}

/**
 * return representation of link
 *
 * @param  string
 * @param  boolean
 * @return string
 */
function wrapImage(url, useMarkdown) {
	if (typeof url === "undefined" ||
		(typeof url === "string" && url.length == 0)) {
		return;
	}

	if (useMarkdown !== true) {
		return `[img]${url}[/img]`;
	}

	return `![](${url})`;
}

/**
 * return sanitized string
 *
 * @param  string
 * @return string
 */
function sanitizeText(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}
