/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/util/user_settings.ts
const PROMPT_KEY = "summary_prompt";
const USER_SETTINGS_KEY = "user_settings";
const USER_ID = "user_id";
const DEFAULT_PROMPT = "Summarise the following article in bullet points:";
var LoginType;
(function (LoginType) {
    LoginType[LoginType["CHAT_GPT"] = 0] = "CHAT_GPT";
    LoginType[LoginType["API_KEY"] = 1] = "API_KEY";
})(LoginType || (LoginType = {}));
async function getPrompt() {
    return chrome.storage.local.get(PROMPT_KEY).then((valueByKey) => {
        if (valueByKey && !!valueByKey[PROMPT_KEY]) {
            return valueByKey[PROMPT_KEY];
        }
        return DEFAULT_PROMPT;
    });
}
async function setPrompt(prompt) {
    if (prompt) {
        await chrome.storage.local.set({ "summary_prompt": prompt });
    }
}
async function resetPrompt() {
    await chrome.storage.local.remove("summary_prompt");
}
async function getUserSettings() {
    return chrome.storage.local.get(USER_SETTINGS_KEY).then((valueByKey) => {
        if (valueByKey && !!valueByKey[USER_SETTINGS_KEY]) {
            return valueByKey[USER_SETTINGS_KEY];
        }
        return { apiKey: null, loginType: LoginType.CHAT_GPT };
    });
}
async function setUserSettings(userSettings) {
    await chrome.storage.local.set({ "user_settings": userSettings });
}
async function getApiKey() {
    let userSettings = await getUserSettings();
    return userSettings.apiKey;
}
async function setApiKey(value) {
    if (value) {
        let userSettings = await getUserSettings();
        userSettings.apiKey = value;
        await setUserSettings(userSettings);
    }
}
async function getLoginType() {
    let userSettings = await getUserSettings();
    return userSettings.loginType;
}
async function setLoginType(value) {
    let userSettings = await getUserSettings();
    userSettings.loginType = value;
    await setUserSettings(userSettings);
}
async function getUserId() {
    let userSettings = await getUserSettings();
    if (!userSettings.userId) {
        userSettings.userId = String(new Date().getTime());
        await setUserSettings(userSettings);
    }
    return userSettings.userId;
}

;// CONCATENATED MODULE: ./src/options/options.ts


addEventListener("load", () => onLoad());
function onLoad() {
    getPrompt().then(prompt => {
        if (prompt) {
            setPromptInInput(prompt);
        }
        listenToPromptElement();
    });
    getLoginType().then(loginType => {
        selectLoginType(loginType);
        listenToLoginTypeElement();
    });
    getApiKey().then(apiKey => {
        if (apiKey) {
            setApiKeyInput(apiKey);
        }
        listenToApiKeyElement();
    });
}
function setPromptInInput(prompt) {
    const promptInputEl = document.getElementById('promptInput');
    if (promptInputEl) {
        promptInputEl.value = prompt;
    }
}
function listenToPromptElement() {
    const promptInputEl = document.getElementById('promptInput');
    promptInputEl === null || promptInputEl === void 0 ? void 0 : promptInputEl.addEventListener('input', async () => {
        var _a;
        (_a = document.getElementById('promptForm')) === null || _a === void 0 ? void 0 : _a.classList.remove('was-validated');
    });
    const saveButton = document.getElementById('savePromptButton');
    saveButton === null || saveButton === void 0 ? void 0 : saveButton.addEventListener('click', async () => {
        var _a;
        let prompt = getPromptInInput();
        if (!!prompt) {
            (_a = document.getElementById('promptForm')) === null || _a === void 0 ? void 0 : _a.classList.add('was-validated');
            if (!prompt.endsWith(':')) {
                prompt = prompt + ":";
            }
            await setPrompt(prompt);
        }
    });
    const resetButton = document.getElementById('resetButton');
    resetButton === null || resetButton === void 0 ? void 0 : resetButton.addEventListener('click', async () => {
        await resetPrompt();
        onLoad();
    });
    function getPromptInInput() {
        return promptInputEl === null || promptInputEl === void 0 ? void 0 : promptInputEl.value;
    }
}
function selectLoginType(loginType) {
    var _a, _b, _c, _d;
    if (loginType == LoginType.API_KEY) {
        document.getElementById('openAiKeyRadio').checked = true;
        (_a = document.getElementById('apiKeyForm')) === null || _a === void 0 ? void 0 : _a.classList.remove('d-none');
        (_b = document.getElementById('apiKeyLoginFeatures')) === null || _b === void 0 ? void 0 : _b.classList.add('d-none');
    }
    else if (loginType == LoginType.CHAT_GPT) {
        document.getElementById('chatGptLoginRadio').checked = true;
        (_c = document.getElementById('apiKeyForm')) === null || _c === void 0 ? void 0 : _c.classList.add('d-none');
        (_d = document.getElementById('apiKeyLoginFeatures')) === null || _d === void 0 ? void 0 : _d.classList.remove('d-none');
    }
}
function listenToLoginTypeElement() {
    var radios = document.querySelectorAll('input[type=radio][name="loginRadio"]');
    function onLoginTypeChange(event) {
        var _a;
        if (((_a = event.target) === null || _a === void 0 ? void 0 : _a.value) === 'openAiKeyRadio') {
            setLoginType(LoginType.API_KEY);
            selectLoginType(LoginType.API_KEY);
        }
        else {
            setLoginType(LoginType.CHAT_GPT);
            selectLoginType(LoginType.CHAT_GPT);
        }
    }
    Array.prototype.forEach.call(radios, function (radio) {
        radio.addEventListener('change', onLoginTypeChange);
    });
}
function setApiKeyInput(value) {
    const apiKeyInputEl = document.getElementById('apiKeyInput');
    if (apiKeyInputEl) {
        apiKeyInputEl.value = value;
    }
}
function listenToApiKeyElement() {
    const apiKeyInputEl = document.getElementById('apiKeyInput');
    apiKeyInputEl === null || apiKeyInputEl === void 0 ? void 0 : apiKeyInputEl.addEventListener('input', async () => {
        var _a;
        (_a = document.getElementById('apiKeyForm')) === null || _a === void 0 ? void 0 : _a.classList.remove('was-validated');
    });
    function getapiKeyInput() {
        return apiKeyInputEl === null || apiKeyInputEl === void 0 ? void 0 : apiKeyInputEl.value;
    }
    const saveTokenButton = document.getElementById('saveTokenButton');
    saveTokenButton === null || saveTokenButton === void 0 ? void 0 : saveTokenButton.addEventListener('click', async () => {
        var _a;
        let inputValue = getapiKeyInput();
        if (!!inputValue) {
            (_a = document.getElementById('apiKeyForm')) === null || _a === void 0 ? void 0 : _a.classList.add('was-validated');
            await setLoginType(LoginType.API_KEY);
            await setApiKey(inputValue);
        }
    });
}

/******/ })()
;