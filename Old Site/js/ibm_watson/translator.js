const selector = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const originalLanguage = "english"
const languageToTranslateTo = ""
const toBeTranslated = {}

function print(thingToPrint){
    console.log(thingToPrint)
}

function something(x){
    
}

// Loop over every selector
for (var selector_loop = 0; selector_loop < selector.length; selector_loop++){

    // variable's
    const theHTMLCollection = document.getElementsByTagName(selector[selector_loop])

    print(`looking for ${selector[selector_loop]}`)

    // checks to see if the length of items in the htmlcollection is greater than 0, prints true or false
    print(`HTMLCollection > 0 ::: ${theHTMLCollection.length > 0}`)
    
    // If the html collection is > 0
    if (theHTMLCollection.length > 0){
        print(theHTMLCollection)
        // loop theHtmlCollection.length number of times collection https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
        const collectionItemCount = theHTMLCollection.length;
        for (var i = 0; collectionItemCount > i; i++){
            // add the selector, key, language & information into the temp array in the following structure
            // {"x":{"0":{"english":"Hello World!"}}}
            translatorState[selector[selector_loop]] =  {[i]:{[originalLanguage]:theHTMLCollection.item(i).innerText}}

            // Add the current peice of data to a temp array holding data for all of the dom elements with the same selector
            //Object.assign(selectorDataObj,tempArrayObj)

            //print(`---\ntempArrayObj below`)
            //print(tempArrayObj)

        }

    }
    
    print(`\n\n`)
}
print(toBeTranslated)