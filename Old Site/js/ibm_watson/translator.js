/*
Plan

Loop over a list of possible selectors
    for each selector find the inner text (inner html)
        pass that inner html to the Translate Function
            when it returns the data
                replace the inner html (texr) on the dom with what watson returned to us.

Create Translate Function
    takes in 3 things ( current language, new language, content text )
        pass that to the watson api
        return the response (which should be the new text)


*/

const possileSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']

console.log("List of possible selectors", possileSelectors);

var i;
for (i = 0; i < possileSelectors.length; i++) {
  console.log("Current Selector", possileSelectors[i])
}

//
// Testing getting dom elements
function getSelectorInnerText(selector){
    console.log("Looking for ", selector)
    return document.getElementsByTagName(String(selector))
}

console.log(getSelectorInnerText("h1"))

// function myFunction() {
//     const x = document.getElementById("myDIV").getElementsByTagName("P");
//     document.getElementById("demo").innerHTML = x.length;
//   }