/* PLAN

    whats the problem?
    I need to be able to translate from english into any desired language.
    Inorder to do that we need to use curl commands with the watson api.
    I need to be able to loop over every html innter text and send it one by one to watson's api for translation and replace the dom element with the new one.

    Possible solution ---
    Create a list of possible selectors

    loop over each possible selector
        for each item in the HTMLCollection
            add it's index & text content to an temp array
        for each item in the temp array
            pass it to the watson api function
            replace the current dom elements text with the response from the watson api

*/