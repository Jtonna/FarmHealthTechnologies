// async function logInOrder(url){
//     for(const i of url){
//         console.log("About to fetch", url)
//         const response = await fetch(url, requestSettings)
//         console.log("I finished fetching now, now ere waiting for responseTxt")
//         const responseTxt = await response.text()
//         console.log("Its hereeeee", responseTxt)
//         console.log("\n")
        
//     }
// }

const sampleData1 = {"text": ["This is just a simple test", "[ADULT SWIM]", "WHERES THE OTHER 2", "yeet"], "model_id":"en-es"}
const sampleData2 = {"text": ["I hope this works", "yes"], "model_id":"en-es"}

function addTranslationToState (x){
    console.log("1. requested to add data to state", x)
    if(x){
        console.log("2. ", x)
        console.log("3. added it")
    }
    console.log("4. finished it all")
}

async function watsonIze(dataToTranslate){

    const antiCORS = "https://cors-anywhere.herokuapp.com/"
    const translatorURL = antiCORS + "https://api.us-south.language-translator.watson.cloud.ibm.com/instances/cbdbacd8-8bbf-4f18-a326-a2e22332bb49/v3/translate?version=2018-05-01"

    // Create headers
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", "Basic YXBpa2V5OnF1eWJnT3JyNFQxLXdKNjlydFZKYnZHZmFyMWhfR3pzUlk3WkVVbGlhelU3")

    // raw data to send
    const rawData = JSON.stringify({
        "text": dataToTranslate,
        "model_id": "en-es"
    })

    // Request settings
    const requestSettings = {
        method: 'POST',
        headers: headers,
        body: rawData,
        redirect: 'follow'
    }
    
    await fetch(translatorURL, requestSettings)
        .then(response => response.text())
        .then(console.log("just set response => response.text"))
        .then(result => console.log(JSON.parse(result)))
}

async function passToWatson(){
    let arrayOfSampleData = [sampleData1, sampleData2]
    for(let i = 0; i< arrayOfSampleData.length; i++){
        console.log("Passing data to watsonIze")
        await watsonIze(arrayOfSampleData[i])
        console.log("Finished passing it")
    }
}