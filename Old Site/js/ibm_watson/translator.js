const selector = ['p', 'a', 'b', 'i', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
var translatorState = {}

// By default the last language is english, if the user has translated before the last language recorded will be used onLoad
var lastLanguage = "en"

// If the user doesnt have a "translatorState" object in local storage, they must not have visited the site before
// We are going to need to loop over the DOM and populate the translatorState object by passong values to the addTranslationToState function
// If the user does have the object in storage we need to pull it & set it
if (localStorage.getItem("translatorState") === null) {

    // for each "selector" get all of the dom elements and add them to the temp array obj above
    for (selector_index = 0; selector_index < selector.length; selector_index++) {
        // Create an array from the collection
        theHtmlCollection = Array.from(document.getElementsByTagName(selector[selector_index]))

        // If the collection has anything in it
        if (theHtmlCollection.length > 0) {
            // Keep track of how many times the forEach calls back(run/loops), & for each run pass the selector, index, language & inner text to the addTranslationToState function; https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Examples
            numCallbackRuns = 0
            theHtmlCollection.forEach(current_element => {
                // If the elements contains an "</" we know that there is more nested html and we should avoid adding that element
                // We also check to make sure its not an empty html tag containing nothing, we do this by removind spaces from the innerHTML and checking the length
                if(current_element.innerHTML.includes("</") === false && current_element.innerHTML.replace(/\s+/g, '').length > 0){
                    addTranslationToState(selector[selector_index], numCallbackRuns, "en", current_element.innerText)
                    numCallbackRuns++
                } else {
                    console.warn("Skipping adding an element because it has nested html")
                }
            });
        }
    }

    // Now that we are finished adding the dom elements to the state we need to save it to localStorage
    setTranslatorState()
} else {
    console.warn("user has a translator state, so we are going to set it")
    translatorState = getTranslatorState()
}

// If the user has translated before, we are going to use that language
if(localStorage.getItem("lastLanguage") === null){
    localStorage.setItem("lastLanguage", lastLanguage)
} else {
    lastLanguage = localStorage.getItem("lastLanguage")
    console.warn("Loading Last Language from LocalStorage: ", lastLanguage)

    // If the last language is not english, we will do the user a favor and translate
    if(lastLanguage !== "en"){
        translationTime(lastLanguage)
    }
}

// This function just adds information to the translatorState Object, inside of the "domTranslations" object.
// Its important to note, that the "index" is the location on the dom, & that we are using bracket notation to support non-ascii, unlike dot notaiton
function addTranslationToState(selector, index, language, text) {
    console.log(`addTranslationToState selector:${selector} index:${index} language:${language} text:${text}`)

    if(translatorState.hasOwnProperty("domTranslations") == true && translatorState["domTranslations"].hasOwnProperty(selector) == true && translatorState["domTranslations"][selector].hasOwnProperty(index)){
        console.log("   looks like we can just add the data and not worry about a structure")

        // this data structure should only contain the index:{language:text}, where "index" referes to its position on the dom
        const tempDataStructure = {
            [language]:text
        }
        console.log("Adding Data To State", tempDataStructure)
        helper(translatorState["domTranslations"][selector][index], tempDataStructure)

        // Now that all the translations shold be done, we need to save the translation to state
        console.warn("attempting to save translator state")
        setTranslatorState()

    } else {
        // Check if theres a "domTranslations" object, if not create it
        console.log("translatorState[selector] is currently", translatorState[selector])
        if (!translatorState["domTranslations"]){
            console.log("   \"domTranslations\" doesn't exist, so were making it")
            const tempDataStructure = {domTranslations:{}}
            helper(translatorState, tempDataStructure)
        }
        
        // if there is not a current "selector" in the data sturcture we need to make one
        if(!translatorState["domTranslations"][selector]){
            console.log(`   no data structure for ${selector} found, so were making one`)
            const tempDataStructure = {[selector]:{}}
            console.log(tempDataStructure)
            helper(translatorState["domTranslations"], tempDataStructure)
        }

        // if the theres not an index attached to the selector we have to add one, or risk recursion forever
        if(!translatorState["domTranslations"][selector][index]){
            console.log(`   no data structure for index ${index} found for the selector, so were adding it`)
            const tempDataStructure = {[index]:{}}
            console.log(tempDataStructure)
            helper(translatorState["domTranslations"][selector], tempDataStructure)
        }

        // since the selector:{index:{language:text}} just passed through, we created space for it to be added, but did not actually add it
        // we can just recursively pass the data back in to be added
        console.log(`   Just created data structures, now were going to do some recursion for ${selector}/${index}`)
        addTranslationToState(selector, index, language, text)
        
    }

    function helper(objectLocation, objectToMerge){
        console.log("Assigning data to the translatorState", objectToMerge)
        Object.assign(objectLocation, objectToMerge)
    }
console.log("\n")
}

console.log("\nThe Translator State\n",translatorState,"\n\n")

// Sets the translatorState object to local storage
function setTranslatorState(){
    console.log("saving StranslatorState to localStorage")
    localStorage.setItem("translatorState", JSON.stringify(translatorState))
}

// Gets the translatorState object from local storage
function getTranslatorState(){
    console.log("attempting to get item from local storage")
    console.log("here it is", JSON.parse(localStorage.getItem("translatorState")))
    const translatorStateFromLocalStorage = JSON.parse(localStorage.getItem("translatorState"))
    return translatorStateFromLocalStorage
}

// Clears the translatorState object from local storage
function cls(){
    console.log("Clearing translatorState from local storage")
    localStorage.clear("translatorState")
}

// When the user makes a request to translate, we need to see if we should use the API or translate from local storage (if they have been here and translated before)
function shouldTranslateChecker(){
    const languageUserWants = document.getElementById("translatableLanguages").value
    console.log("Language Requested:", languageUserWants)

    // Gets an array of selectors in the domTranslations Object  ex..["h1", "h2", "h3"]
    const selectorsInState = Object.keys(translatorState["domTranslations"])

    // Gets the last selector in the domTranslations Object ex..."h6"
    const lastSelectorInState = selectorsInState[Object.keys(translatorState["domTranslations"]).length-1]
    console.log("   lastSelectorInState:", lastSelectorInState)

    // Gets the last selectors index's, meaning the last object nested under the selector ex... "0{...}, 1{...}, ..."
    const lastSelectorsIndexs = Object.keys(translatorState["domTranslations"][lastSelectorInState])
    console.log("   lastSelectorsIndexs:", lastSelectorsIndexs)

    // Gets the languages "keys", that are in the last selectors, last index's object. ex.. ["en"], or ["en", "es", "ru"]
    const languagesAvaliable = Object.keys(translatorState["domTranslations"][lastSelectorInState][lastSelectorsIndexs.length-1])
    console.log("   Languages Avaliable:", languagesAvaliable)

    // Check the last selector's last index to see if the language the user wants is avaliable, if its in local storage we can use that, else use watson
    if(languagesAvaliable.includes(languageUserWants)){
        console.log(`${languageUserWants} is there, we can translate from the translatorState object instead of sending it to watson`)
        translationTime(languageUserWants)
    } else {
        console.log("looks like we need to send it to watson")
        startTranslation(languageUserWants)
    }

    // Finally, change lastLanguage to the language the user wants
    console.log("Setting localStorage for lastLanguage", languageUserWants)
    localStorage.setItem("lastLanguage", languageUserWants)

    console.log("\n")
}

// takes in a language & checks the last selector's last index (object) and sees if any of those objects keys are the language the user wants
// if they arent we have to use api watson, if they are we translate from local storage
function startTranslation(toLanguage){
    // Our base language for all translations will be english
    const selectorsInTranslatorState = Object.keys(translatorState["domTranslations"])
    console.log("The selectors Avaliable", selectorsInTranslatorState)

    
    // For each "selector" tag in the translatorState Object
    for(let i = 0; i < selectorsInTranslatorState.length; i++){
        console.log("\n")
        
        // This Array will be filled with text that needs to get translated in ascending order. (only relevant to the current selector)
        let englishValuesToTranslate = []

        const currentSelector = selectorsInTranslatorState[i]
        console.log("Selector:", currentSelector)

        const currentSelectorsIndexs = Object.keys(translatorState["domTranslations"][currentSelector])
        console.log("Selector's Index's", currentSelectorsIndexs)

        const locationToGetDataFrom = translatorState["domTranslations"][currentSelector]
        console.log(locationToGetDataFrom)

        // For each index we get the value of the key, where the key is "en"
        for (let i = 0; i< currentSelectorsIndexs.length; i++){
            const textToSend = translatorState["domTranslations"][currentSelector][currentSelectorsIndexs[i]]["en"]
            // Add the key's value to the englishValuesToTranslate array
            englishValuesToTranslate.push(textToSend)
        }

        // Now that every value should be in the array, we can pass the information to the begin watson translation function
        console.log(englishValuesToTranslate)
        beginWatsonTranslation("en", toLanguage, englishValuesToTranslate, currentSelector)
        console.log("\n")
    }
}

// Takes in from-to languages, an array of data to translate and a selector
// Passes that data to the watson API and then parses the response and sends values 1 by 1 to addTranslationToState
// Finally initializes translationTime to translate the data that was just added.
function beginWatsonTranslation(fromLanguage, toLanguage, englishValuesToTranslate, selector){
    console.log("Begin Watson Translation")
    console.log("   ",fromLanguage+"-"+toLanguage, englishValuesToTranslate, selector)

    const antiCORS = "https://cors-anywhere.herokuapp.com/"
    const translatorURL = antiCORS + "https://api.us-south.language-translator.watson.cloud.ibm.com/instances/cbdbacd8-8bbf-4f18-a326-a2e22332bb49/v3/translate?version=2018-05-01"

    // Create headers
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", "Basic YXBpa2V5OnF1eWJnT3JyNFQxLXdKNjlydFZKYnZHZmFyMWhfR3pzUlk3WkVVbGlhelU3")

    // raw data to send
    const rawData = JSON.stringify({
        "text": englishValuesToTranslate,
        "model_id": fromLanguage+"-"+toLanguage
    })

    // Request settings
    const requestSettings = {
        method: 'POST',
        headers: headers,
        body: rawData,
        redirect: 'follow'
    }

    // Fetch
    fetch(translatorURL, requestSettings)
        .then(response => response.text())
        .then(result => passTranslationToState(JSON.parse(result)))
        .catch(error => console.log('error', error));

    // Now that we have a response that should contain a translator for every selector item, we have to pass each value to the addTranslationToState function
    function passTranslationToState(result){
        // For each object in "translations" from the response pass the data to addTranslationToState
        for(let i = 0; i < result["translations"].length; i++){
            addTranslationToState(selector, i, toLanguage, result["translations"][i]["translation"])
        }
        console.log("finished passing data to state")
    }
    // Since the data should have been added we can initiate translationTime
    translationTime(toLanguage)
}

// Takes in a target language & translates all text content to said language as long as its avaliable in the translatorState object
function translationTime(toLanguage){
    console.log("requested translation time", toLanguage)

    // Gets an array of selectors in the domTranslations Object  ex..["h1", "h2", "h3"]
    const selectorsInState = Object.keys(translatorState["domTranslations"])
    console.log("   Selectors in state", selectorsInState)

    // For each selector
    for(let i = 0; i<selectorsInState.length; i++){
        // The current selector we are looping for ex.."h1", or "span" or "p"
        const currentSelector = selectorsInState[i]
        // Create an HTMLCollection
        const theHtmlCollection = document.getElementsByTagName(currentSelector)
        console.log("The collection", theHtmlCollection)
        // Number of times we have replaced something
        let numOfReplacements = 0
        // For each "selector" on the DOM
        for(let j = 0; j< theHtmlCollection.length; j++){
            console.log(currentSelector, i, j)
            console.log(theHtmlCollection[j].innerText)
            
            // current_element.innerHTML.includes("</") === false && current_element.innerText.length > 0)
            if(document.getElementsByTagName(currentSelector)[j].innerHTML.includes("</") === false){
                // if the current dom's element's innerHTML length (without spaces) is bigger than 0
                if(document.getElementsByTagName(currentSelector)[j].innerHTML.replace(/\s+/g, '').length > 0){
                    console.log("   theres some data here boss, we can replace stuff here")
                    console.log("   replaced based on numOfReplacements", numOfReplacements)
                    // Replace the element with the translation from local storage
                    document.getElementsByTagName(currentSelector)[j].textContent = translatorState["domTranslations"][currentSelector][numOfReplacements][toLanguage]
                    numOfReplacements++
                }
            }
        }
        console.log("\n")
    }

}