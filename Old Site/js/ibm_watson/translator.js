/*

* Plan

If the user doesnt have a translatorState object with a length bigger than 1 in their local storage
    Loop over each dom element looking for a "selector", this should generate an HTMLCollection
        for each item in the HTMLCollection
            pass that value into the HTMLCollectionTempArray

        for each item in the HTMLCollectionTempArray
            add the data from HTMLCollectionTempArray in this style " selector{index{language:phrase}} " to the translatorState Object using the addTranslationToState function
    
    Once everything is done trigger the saveTranslatorState function


create a addTranslationToState function that takes in 4 variables; selector, index, language & translated text
    if the data we are going to add does NOT already exist in the translatorState Object
        add the data to the translatorState Object in the form of the following data structure
        translatorState = {
            h:{
                0:{english:"example text", spanish:"ejemplo de texto"}
            }
        }


create a saveTranslatorState function
        pretty simple, just save the translatorState in the local storage


// everything above this is good

create a startTranslation function that takes in a target language
    loop over the translatorStateObject
        for each selector in the object
            for each index
                grab the {language:phrase}, where the language is english
                pass the language & phrase & the from & to language to the startTranslation function, so it gets translated

                if we are at the last index & at the last entry & the target language is NOT english
                    trigger the saveTranslationState function to save everything to the local storage


create a beginTranslating function that takes in 3 variables; the from & to language (say english -> spanish) & the test to translate
    if max_attempts is < 10
        pass the from_language, to_language & text to translate to the IBM Watson's Translation API
        if the response is an error
            +1 max attempts
            sleep for 1.5 second's or something like that
            recursively call the translator function & pass the data back into it
        else
            return the response
    else
        alert the user theres an error and we cant translate text right now & that they should come back later
    
*/

const selector = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
