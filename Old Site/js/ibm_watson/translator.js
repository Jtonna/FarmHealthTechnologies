const selector = ['p', 'h1', ]//'h2', 'h3', 'h4', 'h5', 'h6']
const originalLanguage = "english"
const languageToTranslateTo = ""
const textData = {}
const testingData = {"x":{0:{"english":"Hello World!", "spanish": "Hola mundo!"}}}

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
            const tempArrayObj = {}
            const innerText = theHTMLCollection.item(i).innerText
            // i represents the key, theHTMLCollection.item(i).innerText represents the value of the key (without the html)
            print(theHTMLCollection.item(i).innerText)
            print(i)

            // add the selector, key, language & information into the temp array
            // print(`${selector[selector_loop]} ${i} ${originalLanguage} ${theHTMLCollection.item(i).innerText}`) // proof everything can be accessed
            // tempArrayObj[selector[selector_loop]] = [i]
            // tempArrayObj[selector[selector_loop]][i] =  {[originalLanguage]:[theHTMLCollection.item(i).innerText]}

            tempArrayObj[selector[selector_loop]] 
            //tempArrayObj[selector[selector_loop]]


            print(`---\ntempArrayObj below`)
            print(tempArrayObj)
            print(testingData)

        }
    print("selector data below")
    print(selectorDataObj)

    }
    
    print(`\n\n`)
}