const selector = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const currentLanguage = "english"
const languageToTranslateTo = "english"
const textData = {}
const testingData = {"x":{0:{"english":"Hello World!", "spanish": "Hola mundo!"}}, "y":{0:{"english":"How are you doing today?", "spanish": "Cómo estás hoy?"}, 1:{"english":"one two three", "spanish":"uno dos tres"}}}

function print(thingToPrint){
    console.log(thingToPrint)
}

// Loop over every selector
for (var i = 0; i < selector.length; i++){
    // Set the current loop number (which is the index) to a variable as well as the value of the current selector
    const selectorIndex = i
    const selectorValue = selector[i]
    // get all of the dom elements with the same selectorValue
    const currentCollection = document.getElementsByTagName(selectorValue)
    // set the currentCollection to an array so we can extract the data we want
    const currentCollectionArray = Array.from(currentCollection);
    print(currentCollectionArray)
    
}