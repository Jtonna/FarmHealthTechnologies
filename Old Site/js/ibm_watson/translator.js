/* PLAN

    whats the problem?
    I need to be able to translate from english into any desired language.
    Inorder to do that we need to use curl commands with the watson api.
    I need to be able to loop over every html innter text and send it one by one to watson's api for translation and replace the dom element with the new one.

    Possible solution ---
    Create a list of possible selectors

    for each possible selector
        get all html elements
            for each element, store its content in an temporary array


*/