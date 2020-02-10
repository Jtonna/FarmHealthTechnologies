const selector = ['p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
// const selector = ['h1', 'h2', 'p',]
var translatorState = {}

// If the user doesnt have a "translatorState" object in local storage, they must not have visited the site before
//     We are going to need to loop over the DOM and populate the translatorState object by passong values to the addTranslationToState function
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
                addTranslationToState(selector[selector_index], numCallbackRuns, "en", current_element.innerText)
                numCallbackRuns++
            });
        }
    }

    // Now that we are finished adding the dom elements to the state we need to save it to localStorage
    setTranslatorState()
} else {
    console.warn("user has a translator state, so we are going to set it")
    translatorState = getTranslatorState()
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
        console.warn("Attempting to save translator state")
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

// addTranslationToState("h2", "0", "es", "Hola")

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
        // TODO -- Invoke the beginTranslationFromState function and pass in the languageUserWants
    } else {
        console.log("looks like we need to send it to watson")
        startTranslation(languageUserWants)
    }


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

        const currentSelector = selectorsInTranslatorState[i]
        console.log("Selector:", currentSelector)

        const currentSelectorsIndexs = Object.keys(translatorState["domTranslations"][currentSelector])
        console.log("Selector's Index's", currentSelectorsIndexs)

        const locationToGetDataFrom = translatorState["domTranslations"][currentSelector]
        console.log(locationToGetDataFrom)

        // for each "index" we need to get the corrosponding language "key" & text "value"
        for (let i = 0; i< currentSelectorsIndexs.length; i++){
            const key = Object.keys(locationToGetDataFrom[i])
            const value = Object.values(locationToGetDataFrom[i])
            console.log(key, value)
            // pass beginWatsonTranslation, fromLanguage, toLanguage, current selector, selector index & 0 (for max attempts)
            beginWatsonTranslation(key, toLanguage, value, currentSelector, currentSelectorsIndexs[i], 0)
        }
        console.log("\n")
    }


    // TODO invoke translateFromLocalStorage & pass it the "toLanguage"
}

// Takes in from-to languages and formats them to look like "en-es", text to translate, selectors and selectorIndex's (which are dom positions)
// It passes the data to corsanwehere, with an apikey (sadly unsecured), and corsanywhere forwards the request and returns the translated version
// When it returns the data we pass that to addTranslationToState to be added, if theres an error, we dont get the translation sadly
function beginWatsonTranslation(fromLanguage, toLanguage, textToTranslate, selector, selectorIndex){
    console.log(`requested a translation from ${fromLanguage}, to ${toLanguage}, ${textToTranslate} @ ${selector} ${selectorIndex}`)

    // Using CORS anywhere because actual cors issues are really really annoying.
    const watsonApiUrl = "https://cors-anywhere.herokuapp.com/https://api.us-south.language-translator.watson.cloud.ibm.com/instances/cbdbacd8-8bbf-4f18-a326-a2e22332bb49/v3/translate?version=2018-05-01"
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic YXBpa2V5OnF1eWJnT3JyNFQxLXdKNjlydFZKYnZHZmFyMWhfR3pzUlk3WkVVbGlhelU3");

    const raw = JSON.stringify({"text":[String(textToTranslate)],"model_id":fromLanguage+"-"+toLanguage});
    console.log("data to send", raw)

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(watsonApiUrl, requestOptions)
      .then(response => response.text())
      .then(result => addTranslationToState(selector, selectorIndex, toLanguage, String(Object.values(JSON.parse(result)["translations"][0]))))
      .catch(error => console.log('error', error));
}
/*

TODO
create a translateFromLocalStorage function that takes in one variable "to_language"
        for each "selector"
            and each selectors index in the translatorState object
            replace the current DOM elements innerText with the "to_languages" version
*/