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

const selector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']
const originalText = []
const translatedText = []

// Loop over every selector in the list
for (let i = 0; i < selector.length; i++){
    // Set the current selector to a variable as well as the HTMLCollection
    currentSelector = selector[i]
    currentCollection = document.getElementsByTagName(currentSelector);

    // Console Log's to see the data im working with
    console.log(" ")
    console.log("current selector ", currentSelector)
    console.log("current collection ", currentCollection)

    // Set the current collection (HTMLCollection) to an array list
    const currentCollectionArray = Array.from(currentCollection);

    // Loop over the currentCollectionArray
    for (let i = 0; i < currentCollectionArray.length; i++){
        console.log(currentCollectionArray[i].innerHTML)

        // Pass the text to be translated to the translator function
        translator(currentCollectionArray[i].innerHTML)
    }
}

function translator(textToBeTranslated){
    console.log("**Translating ", textToBeTranslated)
    console.log("   **Putting the original text in the originaltext array")
}