var commonFunctions = new CommonFunctionalities();
var chromeFunctions = new ChromeFunctionalities();

function init()
{
    rateUsLinkUpdate();
    loadContainer();
    document.getElementById("popupViewModalClose").onclick = closeModalFunction;
    document.getElementById("popupSettingsModalClose").onclick = closeSettingsModalFunction;
    document.getElementById("cancelConfigurationButton").onclick = cancelConfigurationButton;
    document.getElementById("popup-update-reset-script-from-local-button").onclick = resetScriptFromLocal;
    document.getElementById("add-new-script-button").onclick = addNewScriptButton;
    document.getElementById("setting-popup-button").onclick = openSettingsModalButton;
    document.getElementById("restore-deleted-script-button").onclick = restoreDeletedScriptsButton;
    document.getElementById("edit-configuration-button").onclick = editButtonClick;
    document.getElementById("disable-promotions-checkbox").onchange = changeDisablePromotions;
    document.onkeyup = detectEscapeKey;
    chromeInternationalization();
}

function chromeInternationalization()
{
    chrome.i18n.getAcceptLanguages(function(languageList) {
      var languages = languageList.join(",");
      console.log("Accepted languages: " + languages);
      console.log("UI language: " + chrome.i18n.getUILanguage());
    });

    updateLocalizationById("add-new-script-button", "addNewScript");
    updateLocalizationClassElements("setting-span-class", "settings");
    updateLocalizationClassElements("rate-us-span", "rateUs");
    updateLocalizationClassElements("appreciate-your-effort-span", "appreciateYourEffort");
    updateLocalizationById("contribute-to-development-anchor", "contributeToDevelopment");
    updateLocalizationById("push-your-script-public-anchor", "pushYourScriptPublic");
    updateLocalizationById("request-to-write-code-anchor", "requestToWriteCode");
    updateLocalizationClassElements("url-regex-header-block", "urlRegexHeader");
    updateLocalizationClassElements("editor-name-header-block", "nameHeader");
    updateLocalizationById("popup-update-reset-script-from-local-button", "reset");
    updateLocalizationById("edit-configuration-button", "edit");
    updateLocalizationClassElements("checkbox-label-active", "active");
    updateLocalizationById("cancelConfigurationButton", "close");
    updateLocalizationById("saveConfigurationButton", "save");
    updateLocalizationById("include-libraries-span", "includeLibraries");
    updateLocalizationById("restore-deleted-script-button", "restoreDeletedScripts");
    updateLocalizationById("disable-promotions-span", "disablePromotions");

}

function updateLocalizationById(id, localId)
{
    var text = chrome.i18n.getMessage(localId);
    if(text && text != "")
    {
        var elem = document.getElementById(id);
        if(elem)
        {
            elem.innerHTML = text;
        }
    }
}

function updateLocalizationClassElements(className, localId)
{
    var elements = document.getElementsByClassName(className);
    var text = chrome.i18n.getMessage(localId);
    if(text && text != "" && elements && elements.length > 0)
    {
        for(var i=0;i<elements.length;i++)
        {
            elements[i].innerHTML = text;
        }
    }
}

function getLocalizeText(id, text)
{
    var content = chrome.i18n.getMessage(id);
    var result = (content && content != "") ? content : text;
    return result;
}

function rateUsLinkUpdate()
{
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1 - 79
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    // Edge (based on chromium) detection
    var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    if(isFirefox)
    {
        var list = document.getElementById("rate-us-div").children;
        for(var i=0;i<list.length;i++)
        {
            list[i].style.display = "none";
        }
        document.getElementById("rate-us-div").getElementsByClassName("firefox")[0].style.display = "";
    }
    else if(isEdge || isEdgeChromium)
    {
        var list = document.getElementById("rate-us-div").children;
        for(var i=0;i<list.length;i++)
        {
            list[i].style.display = "none";
        }
        document.getElementById("rate-us-div").getElementsByClassName("edge")[0].style.display = "";
    }
    else
    {
        var list = document.getElementById("rate-us-div").children;
        for(var i=0;i<list.length;i++)
        {
            list[i].style.display = "none";
        }
        document.getElementById("rate-us-div").getElementsByClassName("chrome")[0].style.display = "";
    }
}

function detectEscapeKey(evt) {

    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }

    if (isEscape) {
        document.getElementById("popupViewModal").style.display = "none";
        document.getElementById("popupEditorModule").style.display = "none";
        document.getElementById("popupSettingsModal").style.display = "none";
    }
}

function restoreDeletedScriptsButton(){
    chromeFunctions.restoreDeletedScripts(function(message){
        if(message == "success")
        {
            chromeFunctions.updateDataOneTime(function(){
                loadContainer();
                commonFunctions.showToast(getLocalizeText("successfullyRestored", "Successfully restored"));
            });
        }
    });
}

function openSettingsModalButton(){
    document.getElementById("popupSettingsModal").style.display = "block";
}

function closeModalFunction(){
    document.getElementById("popupViewModal").style.display = "none";
}

function closeSettingsModalFunction(){
    document.getElementById("popupSettingsModal").style.display = "none";
}

function cancelConfigurationButton(){
    document.getElementById("popupEditorModule").style.display = "none";
}

function changeDisablePromotions()
{
    var ch = document.getElementById("disable-promotions-checkbox").checked;
    var store = (ch == true) ? "yes" : "no";
    var data = {"disable-promotions":store};
    chromeFunctions.saveInStorage(data, function(){
        if(store == "yes")
        {
            disablePromotions();
        }
        else
        {
            enablePromotions();
        }
    });
}

function disablePromotions()
{
    console.log("disable");
    var elements = document.getElementsByClassName("hide-to-disable-promotions");
    if(elements && elements.length > 0)
    {
        for(var i=0;i<elements.length;i++)
        {
            var elem = elements[i];
            elem.style.display = "none";
        }
    }
}

function enablePromotions()
{
    var elements = document.getElementsByClassName("hide-to-disable-promotions");
    if(elements && elements.length > 0)
    {
        for(var i=0;i<elements.length;i++)
        {
            var elem = elements[i];
            elem.style.display = "";
        }
    }
}

function loadContainer()
{
    document.getElementById("scripts-list-container").innerHTML = "";
    chromeFunctions.getStorageVariables("disable-promotions", function(data){
        if(data && data["disable-promotions"] == "yes")
        {
            document.getElementById("disable-promotions-checkbox").checked = true;
            disablePromotions();
        }
    });
    getSortedScript(function(configurationWebList){
        var container = document.getElementById("scripts-list-container");
        if(configurationWebList && configurationWebList.length > 0)
        {
            for(var i=0;i<configurationWebList.length;i++)
            {
                var thisConfiguration = configurationWebList[i];
                var nameTag = document.createElement("span");
                nameTag.innerHTML = thisConfiguration.name;
                nameTag.className = "nameTag";
                var checkBoxOption = document.createElement("input");
                checkBoxOption.type = "checkbox";
                checkBoxOption.className = "checkBoxOption";
                if(thisConfiguration.enabled == true)
                {
                    checkBoxOption.checked = true;
                }
                checkBoxOption.onclick = updateActiveStatusFromCheckBox;

                var innerContainer = document.createElement("div");
                innerContainer.append(checkBoxOption);
                innerContainer.append(nameTag);
                if(thisConfiguration.purpose)
                {
                    var purposeTag = document.createElement("span");
                    purposeTag.innerHTML = "(" + thisConfiguration.purpose + ")";
                    innerContainer.append(purposeTag);
                }
                innerContainer.setAttribute("configuration-id", thisConfiguration.id);
                innerContainer.className = "innerContainer";
                if(thisConfiguration.customizedByOwn == true)
                {
                    if(thisConfiguration.nature == true)
                    {
                        innerContainer.className = innerContainer.className + " natureCustomisedScriptBlock"
                    }
                    else
                    {
                        innerContainer.className = innerContainer.className + " ownCustomizationScriptBlock"
                    }
                }
                var deleteButton = document.createElement("button");
                deleteButton.innerText = getLocalizeText("delete", "Delete");
                deleteButton.onclick = deleteConfiguration;
                innerContainer.append(deleteButton);
                innerContainer.onclick = previewScriptClick;
                container.append(innerContainer);
            }
        }
        else
        {
            container.innerHTML = "<div>" + getLocalizeText("noScriptFoundInOptionPageError", "No script found") + "</div>";
        }
    });
}

function getSortedScript(callback){
    chromeFunctions.getConfigurationVariable(function(websiteConfiguration){
        if(websiteConfiguration && websiteConfiguration.webList && websiteConfiguration.webList.length > 0)
        {
            chromeFunctions.getDeletedConfiguration(function(deleteList){
                var configurationWebList = [];
                var webList = websiteConfiguration.webList;
                for(var i=webList.length - 1;i>=0;i--)
                {
                    if(webList[i].customizedByOwn == true && webList[i].nature != true)
                    {
                        configurationWebList.push(webList[i]);
                        webList.splice(i, 1);
                    }
                }
                for(var i=0;i<webList.length;i++)
                {
                    if(webList[i].customizedByOwn == true && webList[i].nature == true)
                    {
                        configurationWebList.push(webList[i]);
                        webList.splice(i, 1);
                        i--;
                    }
                }

                for(var i=0;i<webList.length;i++)
                {
                    configurationWebList.push(webList[i]);
                }
                var configList = removeDeleteListFromList(configurationWebList, deleteList);
                callback(configList);
            });
        }
        else
        {
            callback();
        }
    })
}

function removeDeleteListFromList(webList, deleteList)
{
    var configList = [];
    if(!deleteList)
    {
        deleteList = [];
    }
    for(var i=0;i<webList.length;i++)
    {
        if(deleteList.indexOf(webList[i].id) < 0)
        {
            configList.push(webList[i]);
        }
    }
    return configList;
}

function previewScriptClick()
{
    var configurationId = this.getAttribute("configuration-id");
    previewScript(configurationId);
}

function previewScript(configurationId)
{
    chromeFunctions.getSingleConfiguration(configurationId, function(thisConfiguration){
        if(!thisConfiguration)
        {
            thisConfiguration = {};
        }
        chromeFunctions.getScriptDataFromConfigurationId(thisConfiguration.id, function(scriptData){
            document.getElementById("popup-current-configuration-id").value = thisConfiguration.id;
            document.getElementById("popupViewModal").style.display = "block";
            document.getElementById("popupViewModalContent").value = scriptData;
            var modelName = thisConfiguration.name;
            if(thisConfiguration.purpose)
            {
                modelName = modelName + " (" + thisConfiguration.purpose + ")";
            }
            document.getElementById("popupViewModalName").innerHTML = modelName;
            document.getElementById("popupViewModalURL").innerHTML = thisConfiguration.urlRegEx;
            if(thisConfiguration.nature == true && thisConfiguration.customizedByOwn == true)
            {
                document.getElementById("popup-update-reset-script-from-local-button").style.display = "";
            }
            else
            {
                document.getElementById("popup-update-reset-script-from-local-button").style.display = "none";
            }
        });
    });
}

function resetScriptFromLocal()
{
    var _this = this;
    var configurationId = document.getElementById("popup-current-configuration-id").value;
    chromeFunctions.getSingleConfiguration(configurationId, function(thisConfiguration){
        if(thisConfiguration)
        {
            var r = confirm(getLocalizeText("confirmResetLocal", "Confirm to reset the script") + " '" + thisConfiguration.name +"'");
            if (r == true) {
                chromeFunctions.getScriptDataFromLocalFile(configurationId, function(existingScriptDataForScriptId){
                    if(existingScriptDataForScriptId)
                    {
                        chromeFunctions.getSingleConfigurationFromLocalFile(configurationId, function(thisLocalConfiguration){
                            var savingConfiguration = {};
                            savingConfiguration.scriptData = existingScriptDataForScriptId;
                            savingConfiguration.scriptDataID = configurationId;
                            savingConfiguration.configurationName = thisConfiguration.name;
                            savingConfiguration.configurationPurpose = thisConfiguration.purpose;
                            savingConfiguration.configurationUrlRegex = thisConfiguration.urlRegEx;
                            savingConfiguration.configurationEnabled = thisConfiguration.enabled;
                            savingConfiguration.jqueryEnabled = thisConfiguration.jqueryEnabled;
                            if(thisLocalConfiguration)
                            {
                                savingConfiguration.configurationPurpose = thisLocalConfiguration.purpose;
                                savingConfiguration.configurationName = thisLocalConfiguration.name;
                                savingConfiguration.configurationUrlRegex = thisLocalConfiguration.urlRegEx;
                                savingConfiguration.jqueryEnabled = thisLocalConfiguration.jqueryEnabled;
                            }
                            chromeFunctions.saveThisConfiguration(savingConfiguration, function(){
                                   commonFunctions.showToast(getLocalizeText("savedSuccessfully", "Saved successfully"));
                                   var configurationId = document.getElementById("popup-current-configuration-id").value;
                                   previewScript(configurationId);
                                   loadContainer();
                               });
                        })
                    }
                    else
                    {
                        commonFunctions.showToast(getLocalizeText("localDataNotFound", "Local data not found"));
                    }
                });
            }
        }
    });
}

function deleteConfiguration(event)
{
    event.stopPropagation();
    var _this = this;
    var configurationId = this.parentElement.getAttribute("configuration-id");
    var configurationName = _this.parentElement.getElementsByClassName("nameTag")[0].innerHTML;
    var r = confirm(getLocalizeText("confirmDeleteScript", "Confirm to delete the script") + " '" + configurationName +"'");
    if (r == true) {
        chromeFunctions.getConfigurationVariable(function(websiteConfiguration){
            if(websiteConfiguration)
            {
                var webList = websiteConfiguration.webList;
                for(var i=0;i<webList.length;i++)
                {
                    if(webList[i].id == configurationId)
                    {
                        webList.splice(i, 1);
                        var data = {};
                        data[chromeFunctions.websiteConfigurationString] = websiteConfiguration;
                        chromeFunctions.saveInStorage(data, function(){
                            _this.parentElement.remove();
                            chromeFunctions.addToDeletedConfiguration(configurationId);
                            commonFunctions.showToast(getLocalizeText("successfullyDeleted", "Successfully deleted"));
                        });
                        break;
                    }
                }
            }
        });
    } else {
      txt = "You pressed Cancel!";
    }
}

function updateActiveStatusFromCheckBox(event)
{
    event.stopPropagation();
    var _this = this;
    var checkBoxCheckedStatus = this.checked
    var configurationId = this.parentElement.getAttribute("configuration-id");
    var configurationName = _this.parentElement.getElementsByClassName("nameTag")[0].innerHTML;
    chromeFunctions.getConfigurationVariable(function(websiteConfiguration){
        if(websiteConfiguration)
        {
            updateFeatureState(websiteConfiguration, configurationId, checkBoxCheckedStatus);
            var data = {};
            data[chromeFunctions.websiteConfigurationString] = websiteConfiguration;
            chromeFunctions.saveInStorage(data, function(){
                var message = "";
                var scriptText = getLocalizeText("script", "script");
                var enabledText = getLocalizeText("enabled", "enabled");
                var disabledText = getLocalizeText("disabled", "disabled");
                message = "'" + configurationName + "' " + scriptText + " " + (checkBoxCheckedStatus ? enabledText : disabledText)
                commonFunctions.showToast(message);
            });
        }
    });
}

function updateFeatureState(websiteConfiguration, configId, booleanValue)
{
    for(var i=0;i<websiteConfiguration.webList.length;i++)
    {
        if(websiteConfiguration.webList[i].id == configId)
        {
            websiteConfiguration.webList[i].enabled = booleanValue;
        }
    }
}

function addNewScriptButton(){
    document.getElementById("popupEditorModule").style.display = "block";
    var editorFunctions = new EditorFunctionalities();
    editorFunctions.saveButtonCallback = function(){
        loadContainer();
    }
    editorFunctions.init();
    let title = "New script";
    let regexURL = "https://example.com";
    editorFunctions.loadNewConfiguration(title, regexURL, 0);
}

function editButtonClick(){
    var configurationId = document.getElementById("popup-current-configuration-id").value;
    document.getElementById("popupViewModal").style.display = "none";
    document.getElementById("popupEditorModule").style.display = "block";
    var editorFunctions = new EditorFunctionalities();
    editorFunctions.saveButtonCallback = function(){
        loadContainer();
    }
    editorFunctions.init();
    chromeFunctions.getSingleConfiguration(configurationId, function(thisConfiguration){
        if(thisConfiguration)
        {
            chromeFunctions.getScriptDataFromConfigurationId(thisConfiguration.id, function(scriptData){
                thisConfiguration.scriptData = scriptData;
                editorFunctions.loadContainer(thisConfiguration);
            });
        }
    });

}

init();
