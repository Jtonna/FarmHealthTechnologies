const selector = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const currentLanguage = "english"
const languageToTranslateTo = ""
const textData = {}
//const testingData = {"x":{0:{"english":"Hello World!", "spanish": "Hola mundo!"}}, "y":{0:{"english":"How are you doing today?", "spanish": "Cómo estás hoy?"}, 1:{"english":"one two three", "spanish":"uno dos tres"}}}

function print(thingToPrint){
    console.log(thingToPrint)
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
        print(`${theHTMLCollection}`)

        // loop theHtmlCollection.length number of times collection https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
        const collectionItemCount = theHTMLCollection.length;
        for (var i = 0; collectionItemCount > i; i++){
            print(theHTMLCollection.item(i).innerText)
        }


    }

    print(`\n`)
}