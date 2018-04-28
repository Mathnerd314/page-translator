# [Install Page Translator](https://github.com/jeremiahlee/page-translator/releases/download/v1.0.3/page_translator-1.0.3-an.fx.xpi)

One-click in-line page translation for Firefox

Translates any page using [Google Translate](https://translate.google.com/manager/website/) or [Microsoft Translator](https://msdn.microsoft.com/en-us/library/mt146808.aspx).

It's minimalistic. The translate icon will only appear if the page is in a foreign language.


## How to use

A translate icon will appear in the address bar when a page is detected to be in a foreign language. Tap it to translate the page.

Page Translator determines if the page is in a foreign language by comparing the list of languages you have specified in Firefox as your preferred languages (<a href="about:preferences#content">Preferences</a> > Content > Languages) against the page language as determined by <a href="https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/detectLanguage">Firefox</a>. Firefox for Android does not yet support language detection, so the translate icon will always be visible.


## Options

Access Page Translator's options by going to <a href="about:addons">Add-ons</a> > Extensions > Page Translator.

If you'd prefer to always have the translate icon displayed, check "Always show translate icon in the URL bar".

To change the translation service, select the service you'd like to use in the "Translate using" dropdown menu.


© 2017–2018 Jeremiah Lee. Page Translator is released under the ISC License.