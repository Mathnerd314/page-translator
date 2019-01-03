# Page Translator Revised

One-click page translation for Firefox, without remote code execution

Translates any page using [Google Translate](https://translate.google.com/manager/website/) or [Microsoft Translator](https://msdn.microsoft.com/en-us/library/mt146808.aspx).

The translate icon will only appear if the page is in a foreign language. Page Translator determines if the page is in a foreign language by comparing the list of languages you have specified in Firefox as your preferred languages (<a href="about:preferences#content">Preferences</a> > Content > Languages) against the page language as determined by <a href="https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/detectLanguage">Firefox</a>. Firefox for Android does not yet support language detection, so the translate icon will always be visible.

## How to use

A translate icon will appear in the address bar when a page is detected to be in a foreign language. Tap it to translate the page.

You can also select "Translate" from the "..." dropdown menu in the address bar.

## Options

Access Page Translator Revised's options by going to <a href="about:addons">Add-ons</a> > Extensions > Page Translator Revised.

If you'd prefer to always have the translate icon displayed, check "Always show translate icon in the URL bar".

To change the translation service, select the service you'd like to use in the "Translate using" dropdown menu.

## Alternatives

If you want to only translate some of the text on the page, or the page is not public, use a different extension, such as [To Google Translate](https://github.com/itsecurityco/to-google-translate)

## History and development

Original code from Page Translator © 2017–2018 Jeremiah Lee. 

Updated and maintained by Mathnerd314.

Page Translator Revised is released under the ISC License.
