/* PLAN

    whats the problem?
    I need to be able to translate from english into any desired language.
    Inorder to do that we need to use curl commands with the watson api.
    I need to be able to loop over every html innter text and send it one by one to watson's api for translation and replace the dom element with the new one.

    Possible solution ---
    Create a list of possible selectors

    loop over each possible selector
        for the current selector
            get the dom elements that have that selector
                for each element
                    add it's index & text content to an temp array
        for each item in the temp array
            pass it to the watson api function
            replace the current dom elements text with the response from the watson api

    Working Solution ---

*/

const selector = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const currentLanguage = "english"
const languageToTranslateTo = "english"
const textData = {}
const testingData = {"x":{0:{"english":"Hello World!", "spanish": "Hola mundo!"}}, "y":{0:{"english":"How are you doing today?", "spanish": "Cómo estás hoy?"}, 1:{"english":"one two three", "spanish":"uno dos tres"}}}

console.log(testingData)
console.log("textData Object:", textData)

// Loop over every selector in the list
for (let i = 0; i < selector.length; i++){
    // Set the current selector to a variable as well as the HTMLCollection
    currentSelector = selector[i]
    currentCollection = document.getElementsByTagName(currentSelector);

    // Console Log's to see the data im working with
    console.log("--- Current Loop Data for selector: ", currentSelector)
    console.log("       current collection ", currentCollection)

    // Set the current collection (HTMLCollection) to an array list
    const currentCollectionArray = Array.from(currentCollection);

    // Loop over the currentCollectionArray
    for (let i = 0; i < currentCollectionArray.length; i++){
        console.log(currentCollectionArray[i].innerHTML)

        // Pass the currentselector, index of the current collection & the text to be translated to the translator function
        translator(currentSelector, i, languageToTranslateTo, currentCollectionArray[i].innerHTML)
    }

    console.log(" ")
    console.log(" ")
}

function translator(selector, textIndex, language, textToBeTranslated){
    console.log("       Translating")

    // at selector add index
    testingData[selector] = [textIndex]

    // at selector[index] add the language and the text to be translated
    testingData[selector][textIndex] = {language, textToBeTranslated}
    
    console.log(testingData)
}
console.log(testingData)