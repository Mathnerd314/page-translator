// "people got mad when i put it all in one file" —Julia Evans

/*
===============================
WebExtension specific functions
===============================
*/

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
*/
function protocolIsApplicable(tabUrl) {
    const APPLICABLE_PROTOCOLS = ['http:', 'https:'];
    let url = new URL(tabUrl);
    return APPLICABLE_PROTOCOLS.includes(url.protocol);
}

/*
Returns true if user set option to always display the page action
*/
async function userAlwaysWantsIcon() {
    let option = await browser.storage.local.get("alwaysShowPageAction");

    if (typeof option.alwaysShowPageAction !== "boolean") {
        return false;
    } else {
        return option.alwaysShowPageAction;
    }
}

/*
Returns true if user set option to automatically translate pages in foreign language
*/
async function userWantsImmediateTranslation() {
    let option = await browser.storage.local.get("automaticallyTranslate");

    if (typeof option.automaticallyTranslate !== "boolean") {
        return false;
    } else {
        return option.automaticallyTranslate;
    }
}

async function getPageLanguage(tabId) {
    try {
        return await browser.tabs.detectLanguage(tabId);
    } catch (err) {
        return "und";
    }
}

function pageHasKnownLanguage(pageLanguage) {
    if (pageLanguage === "und") {
        return false;
    } else {
        return true;
    }
}

function pageIsInForeignLanguage(pageLanguage) {
    // Normalize page language and browser languages
    pageLanguage = pageLanguage.toLowerCase();

    // If language is unknown, assume page is in native language
    if (pageLanguage === "und") {
        return false;
    }

    let navigatorLanguages = navigator.languages.map(navigatorLanguage => {
        return navigatorLanguage.toLowerCase();
    });

    // Check if the page's language explicitly matches any of browser's preferred languages
    if (navigatorLanguages.includes(pageLanguage)) {
        return false;
    }

    // If you're still here, then check for match of primary language subtags
    // If so, assume close enough to native language.

    // Get array of the primary languages from the browser, i.e. those without a hyphen
    // Ex: `en` but not `en-SV`
    let primaryLanguageSubtags = navigatorLanguages.filter(language => {
        return language.indexOf('-') === -1;
    });

    // If no primary language subtag specified in browser, the user has explicitly removed it,
    // so assume they want explicit language match instead of partial match.
    if (primaryLanguageSubtags.length === 0) {
        return true;
    }

    // Get page's language subtag 
    let pageLanguageSubtag = pageLanguage.split('-', 1)[0];

    // Look for primary language subtag match
    if (primaryLanguageSubtags.includes(pageLanguageSubtag)) {
        return false;
    }

    // No match, so page is in foreign language.
    return true;
}

/*
Show the Page Translator page action in the browser address bar, if applicable.
If user always wants the icon, show it.
If page is in foreign language, show it.
    If user wants auto translation, invoke it.
*/
async function initializePageAction(tab) {
    if (!protocolIsApplicable(tab.url)) {
        browser.pageAction.hide(tab.id);
        return;
    }

    let pageLanguage = await getPageLanguage(tab.id);
    let pageLanguageKnown = pageHasKnownLanguage(pageLanguage);
    let pageNeedsTranslating = pageIsInForeignLanguage(pageLanguage);

    if (await userAlwaysWantsIcon() === true || 
        pageLanguageKnown === false ||  // Better to show UI and not be needed
        pageNeedsTranslating === true
    ) {
        browser.pageAction.show(tab.id);

        if (pageNeedsTranslating && (await userWantsImmediateTranslation() === true)) {
            injectTranslatorCode();
        }
    } else {
        browser.pageAction.hide(tab.id);
    }
}



/*
=============================
Page Translator functionality
=============================
*/

function injectTranslatorCode() {
    let googleCode = `
        var docBody = document.body;

        if (docBody !== null) {
            let googleTranslateCallback = document.createElement('script');
            googleTranslateCallback.innerHTML = "function googleTranslateElementInit(){ new google.translate.TranslateElement(); }";
            docBody.insertBefore(googleTranslateCallback, docBody.firstChild);

            let googleTranslateScript = document.createElement('script');
            googleTranslateScript.charset="UTF-8";
            googleTranslateScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&tl=&sl=&hl=";
            docBody.insertBefore(googleTranslateScript, docBody.firstChild);
        }

        // Firefox 53 will (erroneously?) complain if non-structured-clonable data isn't returned.
        // https://github.com/mdn/webextensions-examples/issues/193
        true;
    `;

    let microsoftCode = `
        var docBody = document.body;

        if (docBody !== null) {
            let div = '<div id="MicrosoftTranslatorWidget" class="Dark" style="color:white;background-color:#555555"></div>';
            docBody.insertAdjacentHTML("afterbegin", div);

            let microsoftTranslatorScript = document.createElement("script");
            microsoftTranslatorScript.charset="UTF-8";
            microsoftTranslatorScript.src = "https://ssl.microsofttranslator.com/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=False&ui=true&settings=Auto&from=";
            docBody.insertBefore(microsoftTranslatorScript, docBody.firstChild);
        }

        // Firefox 53 will (erroneously?) complain if non-structured-clonable data isn't returned.
        // https://github.com/mdn/webextensions-examples/issues/193
        true;
    `;

    let executeScript = function(option) {
        let injectDetails = {};

        if ((typeof option.translationService !== "undefined") &&
            (option.translationService === "microsoft")) {
            injectDetails.code = microsoftCode;
        } else {
            injectDetails.code = googleCode;
        }

        browser.tabs.executeScript(injectDetails);
    };

    browser.storage.local.get("translationService").then(executeScript);
}



/*
==========
INITIALIZE
==========
*/

/*
When initialized, add the page action for all tabs.
*/
browser.tabs.query({}).then((tabs) => {
    for (tab of tabs) {
        initializePageAction(tab);
    }
});

/*
When a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    if ((typeof changeInfo.status === "string") && (changeInfo.status === "complete")) {
        initializePageAction(tab);
    }
});

/*
Bind clicks on the page action icon to the WebExtension
*/
browser.pageAction.onClicked.addListener(injectTranslatorCode);


/*
When Page Translator is installed or updated, show the release notes on the options page.
*/
browser.runtime.onInstalled.addListener(function() {
    browser.runtime.openOptionsPage();
});
