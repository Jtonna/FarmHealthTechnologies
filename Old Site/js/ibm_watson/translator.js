const selector = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const originalLanguage = "english"
const languageToTranslateTo = ""
const textData = {}

function print(thingToPrint){
    console.log(thingToPrint)
}

// Loop over every selector
for (var selector_loop = 0; selector_loop < selector.length; selector_loop++){

    // variable's
    const theHTMLCollection = document.getElementsByTagName(selector[selector_loop])
    const selectorDataObj = {}

    print(`looking for ${selector[selector_loop]}`)

    // checks to see if the length of items in the htmlcollection is greater than 0, prints true or false
    print(`HTMLCollection > 0 ::: ${theHTMLCollection.length > 0}`)
    
    // If the html collection is > 0
    if (theHTMLCollection.length > 0){
        print(theHTMLCollection)
        // loop theHtmlCollection.length number of times collection https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
        const collectionItemCount = theHTMLCollection.length;
        for (var i = 0; collectionItemCount > i; i++){
            // temporary array for keeping data
            const tempArrayObj = {}
            // add the selector, key, language & information into the temp array in the following structure
            // {"x":{"0":{"english":"Hello World!"}}}
            tempArrayObj[selector[selector_loop]] =  {[i]:{[originalLanguage]:theHTMLCollection.item(i).innerText}}

            print(`---\ntempArrayObj below`)
            print(tempArrayObj)

        }
    print("selector data below")
    print(selectorDataObj)

    }
    
    print(`\n\n`)
}