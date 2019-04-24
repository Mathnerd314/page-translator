function showHide(elem, show) {
    if ( show ) {
        elem.style.display = "";
    } else {
        elem.style.display = "none";
    }
}

function updateLayout() {
    let service = document.querySelector("#translation-service").value;
    let b = (service === "microsoft");
    showHide( document.querySelector("#google_lang_from"), !b);
    showHide( document.querySelector("#google_lang_to"), !b);
    showHide( document.querySelector("#microsoft_lang_from"), b);
    showHide( document.querySelector("#microsoft_lang_to"), b);
}

function saveOptions() {
    let service = document.querySelector("#translation-service").value;
    browser.storage.local.set({
        alwaysShowPageAction: document.querySelector("#always-show-page-action").checked,
        automaticallyTranslate: document.querySelector("#automatically-translate").checked,
        translationService: service,
        fromLang: document.querySelector(service == "microsoft" ? "#microsoft_lang_from" : "#google_lang_from").value,
        toLang: document.querySelector(service == "microsoft" ? "#microsoft_lang_to" : "#google_lang_to").value
    });
    updateLayout();
}

async function restoreOptions() {
    // Firefox 53 will erroneously complain that "ReferenceError: browser is not defined"
    let options = await browser.storage.local.get([
        "alwaysShowPageAction",
        "automaticallyTranslate",
        "translationService",
        "fromLang",
        "toLang"
    ]);

    if (typeof options.alwaysShowPageAction !== "undefined") {
        document.querySelector("#always-show-page-action").checked = options.alwaysShowPageAction;
        updateLayout();
    }

    if (typeof options.automaticallyTranslate !== "undefined") {
        document.querySelector("#automatically-translate").checked = options.automaticallyTranslate;
    }

    if (typeof options.translationService !== "undefined") {
        document.querySelector("#translation-service").value = options.translationService;
    }
    
    let service = document.querySelector("#translation-service").value;
    if (typeof options.fromLang !== "undefined") {
        document.querySelector(service == "microsoft" ? "#microsoft_lang_from" : "#google_lang_from").value = options.fromLang;
    }
    if (typeof options.toLang !== "undefined") {
        document.querySelector(service == "microsoft" ? "#microsoft_lang_to" : "#google_lang_to").value = options.toLang;
    }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
let arr = ["always-show-page-action","automatically-translate","translation-service"
          ,"microsoft_lang_from","microsoft_lang_to","google_lang_from","google_lang_to"];
for(let i = 0; i < arr.length;i++)
 document.querySelector("#" + arr[i]).addEventListener("change", saveOptions);
updateLayout();
