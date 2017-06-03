# Original embed code

<div id='MicrosoftTranslatorWidget' class='Dark' style='color:white;background-color:#555555'></div><script type='text/javascript'>setTimeout(function(){{var s=document.createElement('script');s.type='text/javascript';s.charset='UTF-8';s.src=((location && location.href && location.href.indexOf('https') == 0)?'https://ssl.microsofttranslator.com':'http://www.microsofttranslator.com')+'/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=False&ui=true&settings=Auto&from=';var p=document.getElementsByTagName('head')[0]||document.documentElement;p.insertBefore(s,p.firstChild); }},0);</script>


<div id="google_translate_element"></div><script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT}, 'google_translate_element');
}
</script><script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>


# Modifications

<div id='MicrosoftTranslatorWidget' class='Dark' style='color:white;background-color:#555555'></div>

<script>setTimeout(function(){{var s=document.createElement('script');s.charset='UTF-8';s.src=((location && location.href && location.href.indexOf('https') == 0)?'https://ssl.microsofttranslator.com':'http://www.microsofttranslator.com')+'/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=False&ui=true&settings=Auto&from=';var p=document.getElementsByTagName('head')[0]||document.documentElement;p.insertBefore(s,p.firstChild); }},0);</script>


<div id="google_translate_element"></div>
<script>
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT}, 'google_translate_element');
}
</script>

<script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>


# Determining whether to show the icon or not

As of HTML5, the proper way to declare the language for a page is the `lang` property on the `html` element. Example: `<html lang="en">`

There were many inconsistent methods prior to HTML5, like a `meta` tag for `Content-Language`. Because determining the page language from these methods is error prone, we assume it's foreign if it's not using HTML5 or later. Also, while `Content-Language` often is sent as a HTTP header for the page, but headers for the page are not accessible to JavaScript running on the page.

`navigator.languages` returns an array of languages the user has told the browser to request from servers. 

Display the translate icon:

1. If the user has set the option to always display it
2. If the page does not properly specify a language in markup
3. If the page does specify a language and it does not match any of `navigator.languages` explicitly or partially with BCP 47 / IANA Language Subtag Registry primary language subtag

http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry



# Re-do pageIsInForeignLanguage()

Firefox for Android doesn't have the browser.tabs.detectLanguage()

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Content_scripts
https://stackoverflow.com/questions/21314897/access-dom-elements-through-chrome-extension

function pageIsInForeignLanguage() {
    let pageLanguage = document.documentElement.lang;

    // If we can't determine the page's language, assume it's foreign.
    if (!pageLanguage) {
        return true;
    }

    // Normalize page language and browser languages
    pageLanguage = pageLanguage.toLowerCase();

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

Add tests for language matching logic
- page's language: missing, sv, sv-SV, en-SV, SV-SV, EN-SV
- browser: en, en-US, sp, sp-US


# ADO submission

Summary:
Translate any page inline using Google Translate or Microsoft Translator. A translate icon will appear in the address bar when a page is detected to be in a foreign language. Keeps your UI minimal.

Support website: https://github.com/jeremiahlee/page-translator/issues

Notes to Reviewer: 
The translate page action will only appear on pages detected to be in a language not in your browser's preferred language list (about:preferences#content Languages), unless you override the detection in the add-on's options. On Android, it will always be displayed because browser.tabs.detectLanguage is not available in Firefox for Android.