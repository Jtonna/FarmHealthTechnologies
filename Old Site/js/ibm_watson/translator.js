const selector = ['p',]// 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const translatorState = {
    domTranslations:{
        p:{
            0:{jlang:"Lol", elang:"olo"},
            1:{jlang:"siudog"}
        }
    }
}
console.log("Translator state levels")
console.log(translatorState)
console.log(translatorState.domTranslations)
console.log(translatorState.domTranslations.p)
console.log(translatorState.domTranslations.p[0])
console.log(translatorState.domTranslations.p[0].jlang,"\n\n")

console.log("attempting mutation")
const randomArray = {schweg:"lit"}
Object.assign(translatorState.domTranslations.p[0], randomArray)
console.log(translatorState.domTranslations.p[0],"\n\n")

console.log("\n\n\n\n\n")

// If the user doesnt have a "translatorState" object in local storage, they must not have visited the site before
// We are going to need to loop over the DOM and populate the translatorState object by passong values to the addTranslationToState function


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
                addTranslationToState(selector[selector_index], numCallbackRuns, "english", current_element.innerText)
                numCallbackRuns++
            });
        }
    }
}

/*

TODO
create a addTranslationToState function that takes in 4 variables; selector, index, language & translated text
    if the data we are going to add does NOT already exist in the translatorState Object
        add the data to the translatorState Object in the form of the following data structure
        translatorState = {
            h:{
                0:{english:"example text", spanish:"ejemplo de texto"}
            }
        }
*/
function addTranslationToState(selector, index, language, text) {
    console.log("passed some data to addTranslationToState")
    console.log("****", selector, index, language, text)
    const dataToAdd = {[language]:text}
    Object.assign(translatorState.domTranslations.p[index], dataToAdd)
    console.log("\n")
    
}
console.log(translatorState)

/*

TODO
create a saveTranslatorState function
        pretty simple, just save the translatorState in the local storage
*/



/*

TODO
create a shouldTranslateChecker function that takes in one variable "to_language"
        if to_language is in the translatorState object's list of fully translated languages
            trigger the translateFromLocalStorage function
        else
            trigger and pass the to_language to the startTranslationFunction
*/



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



/*

TODO
create a translateFromLocalStorage function that takes in one variable "to_language"
        for each "selector"
            and each selectors index in the translatorState object
            replace the current DOM elements innerText with the "to_languages" version
*/