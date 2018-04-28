function saveOptions() {
    browser.storage.local.set({
        alwaysShowPageAction: document.querySelector("#always-show-page-action").checked,
        automaticallyTranslate: document.querySelector("#automatically-translate").checked,
        translationService: document.querySelector("#translation-service").value
    });
}

async function restoreOptions() {
    // Firefox 53 will erroneously complain that "ReferenceError: browser is not defined"
    let options = await browser.storage.local.get([
        "alwaysShowPageAction",
        "automaticallyTranslate",
        "translationService"
    ]);

    if (typeof options.alwaysShowPageAction !== "undefined") {
        document.querySelector("#always-show-page-action").checked = options.alwaysShowPageAction;
    }

    if (typeof options.automaticallyTranslate !== "undefined") {
        document.querySelector("#automatically-translate").checked = options.automaticallyTranslate;
    }

    if (typeof options.translationService !== "undefined") {
        document.querySelector("#translation-service").value = options.translationService;
    }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#always-show-page-action").addEventListener("change", saveOptions);
document.querySelector("#automatically-translate").addEventListener("change", saveOptions);
document.querySelector("#translation-service").addEventListener("change", saveOptions);
