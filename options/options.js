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
        contextMenu: document.querySelector("#context-menu").checked,
        translationService: service,
        fromLang: document.querySelector(service == "microsoft" ? "#microsoft_lang_from" : "#google_lang_from").value,
        toLang: document.querySelector(service == "microsoft" ? "#microsoft_lang_to" : "#google_lang_to").value
    });
    updateLayout();
}

async function restoreOptions() {
    let options = await browser.storage.local.get();

    if (typeof options.alwaysShowPageAction === "boolean") {
        document.querySelector("#always-show-page-action").checked = options.alwaysShowPageAction;
        updateLayout();
    }

    if (typeof options.automaticallyTranslate === "boolean") {
        document.querySelector("#automatically-translate").checked = options.automaticallyTranslate;
    }

    if (typeof options.contextMenu === "boolean") {
        document.querySelector("#context-menu").checked = options.contextMenu;
    }

    if (typeof options.translationService === "string") {
        document.querySelector("#translation-service").value = options.translationService;
    }
    
    let service = document.querySelector("#translation-service").value;
    if (typeof options.fromLang === "string") {
        document.querySelector(service == "microsoft" ? "#microsoft_lang_from" : "#google_lang_from").value = options.fromLang;
    }
    if (typeof options.toLang === "string") {
        document.querySelector(service == "microsoft" ? "#microsoft_lang_to" : "#google_lang_to").value = options.toLang;
    }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
let arr = ["always-show-page-action","automatically-translate","translation-service","context-menu"
          ,"microsoft_lang_from","microsoft_lang_to","google_lang_from","google_lang_to"];
for(let i = 0; i < arr.length;i++)
 document.querySelector("#" + arr[i]).addEventListener("change", saveOptions);
updateLayout();
