// const selector = ['p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const selector = ['p','h2']
var translatorState = {}
const translatorStateExample = {
    domTranslations:{
        p:{
            0:{jlang:"Lol", elang:"olo"},
            1:{jlang:"siudog"}
        },
        h1:{
            0:{english:"hell yeahhhhhhh"}
        }
    }
}

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
    console.log(`** ${selector} ${index}`)
    console.log(translatorState.hasOwnProperty("domTranslations") == true)
    if(translatorState.hasOwnProperty("domTranslations") == true && translatorState["domTranslations"].hasOwnProperty(selector)){
        console.log("looks like we can just add the data and not worry about a structure")

        // this data structure should only contain the index:{language:text}, where "index" referes to its position on the dom
        const tempDataStructure = {
            [index]:{[language]:text}
        }
        console.log("******", tempDataStructure)
        helper(translatorState["domTranslations"][selector], tempDataStructure)

    } else {
        // Check if theres a "domTranslations" object, if not create it
        console.log("translatorState[selector] is currently", translatorState[selector])
        if (!translatorState["domTranslations"]){
            console.log("shit dont exist fam, lets make it")
            const tempDataStructure = {domTranslations:{}}
            helper(translatorState, tempDataStructure)
        }
        
        // if there is not a current "selector" in the data sturcture we need to make one
        if(!translatorState["domTranslations"][selector]){
            console.log(`no data structure for ${selector} found, so were making one`)
            const tempDataStructure = {[selector]:{}}
            console.log(tempDataStructure)
            helper(translatorState["domTranslations"], tempDataStructure)
        }

        // since the selector:{index:{language:text}} just passed through, we created space for it to be added, but did not actually add it
        // we can just recursively pass the data back in to be added
        console.log(`Just created data structures, now were going to do some recursion for ${selector}/${index}`)
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
    // Accesses the last "key" in "domTranslations", which should be a "selector" like "h1", "p", "a"
    const lastSelectorInDomTranslations = Object.keys(translatorState["domTranslations"])[Object.keys(translatorState["domTranslations"]).length-1]
    //console.log(`Last selector ${lastSelectorInDomTranslations}`)

    // Gets the index of the last entry for the "selector", which should be the last dom element added to the object
    const lastIndexInLastSelector = Object.keys(lastSelectorInDomTranslations).length
    //console.log(`Last index in the selector ${lastIndexInLastSelector}`)

    // Uses the two above variables to access the last "domTranslations" index's object's keys, which should be a language
    const locationKeysToCheck = Object.keys(translatorState["domTranslations"][lastSelectorInDomTranslations][Object.keys(translatorState["domTranslations"]["h2"]).length-1])
    //console.log("languages avaliable", locationKeysToCheck)

    if(locationKeysToCheck.includes(languageUserWants)){
        console.log(`${languageUserWants} is there, we can translate from the translatorState object instead of sending it to watson`)
    } else {
        console.log("looks like we need to send it to watson")
        startTranslation(languageUserWants)
    }
    console.log("\n")
}

/*

TODO
create a startTranslation function that takes in a "to" language; our from will always be english
    loop over the translatorState Object
        for each "selector" in the object
            for each index
                grab the {language:phrase}, where the language is english
                pass the phrase & the from & to language to the beginWatsonTranslation function, so it gets translated
                when the translated phrase is returned pass it to the addTranslationToState Function to be stored
*/
function startTranslation(toLanguage){
    // Our base language for all translations will be english
    const fromLanguage = "english"
    const selectorsInTranslatorState = Object.keys(translatorState["domTranslations"])
    console.log("The selectors Avaliable", selectorsInTranslatorState)

    // For each "selector" tag in the translatorState Object
    for(let i = 0; i < selectorsInTranslatorState.length; i++){
        console.log("\n")

        currentSelector = selectorsInTranslatorState[i]
        console.log("Selector:", currentSelector)

        currentSelectorsIndexs = Object.keys(translatorState["domTranslations"][currentSelector])
        console.log("Selector's Index's", currentSelectorsIndexs)

        const locationToGetDataFrom = translatorState["domTranslations"][currentSelector]
        console.log(locationToGetDataFrom)

        // for each "index" we need to get the corrosponding language "key" & text "value"
        for (let i = 0; i< currentSelectorsIndexs.length; i++){
            const key = Object.keys(locationToGetDataFrom[i])
            const value = Object.values(locationToGetDataFrom[i])
            console.log(key, value)
            // TODO
            // pass beginWatsonTranslation, fromLanguage, toLanguage, and the text to be translated
            beginWatsonTranslation(key, toLanguage, value)
            // capture the return and pass the Selector, Index, toLanguage & translation into the addTranslationToState function

        }
        console.log("\n")
    }
}

/*

TODO
create a beginWatsonTranslation function that takes in 3 variables; the from & to language (say english -> spanish) & the test to translate
    if max_attempts is < 10
        pass the from_language, to_language & text to translate to the IBM Watson's Translation API
        if the response is a time-out error or something along those lines
            +1 max attempts
            sleep for 1.5 second's or something like that
            recursively call the beginWatsonTranslation & pass the data back into it with the current value of max_attempts
        else
            return the response
    else
        alert the user theres an error and we cant translate text right now & that they should come back later
*/
function beginWatsonTranslation(fromLanguage, toLanguage, textToTranslate){
    console.log(`requested a translation from ${fromLanguage}, to ${toLanguage}, ${textToTranslate}`)
}


/*

TODO
create a translateFromLocalStorage function that takes in one variable "to_language"
        for each "selector"
            and each selectors index in the translatorState object
            replace the current DOM elements innerText with the "to_languages" version
*/