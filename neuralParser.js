function ParsePageText() {
    function boldLettersUpTo(word, end) {
        return '<span style="font-weight: bold">'+word.slice(0, end)+'</span>'+ word.slice(end);
    }

    function removePunctuation(str) {
        return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    }

    function isVowel(letter) {
        letter = letter.toUpperCase()
        return letter == "A" || letter == "E" || letter == "I" || letter == "O" || letter == "U";
    }

    function calculateLongString(word) {
        const letters = word.split('');
        let i;
        let count = 0;
        let wasVowel = false;
        for(i=word.length-1; i >= 0; i--)
        {
            if(isVowel(letters[i]) && !wasVowel)
            {
                wasVowel = true;
                count++;
                if((word.length-1)/16 <= count) break;
            }
            else{
                wasVowel = false
            }
        }
        return boldLettersUpTo(word, (i));
    }

    const neuralParse = (str) => {
        let wordList = str.split(" ");
        return wordList.map(word => {
            let nopunc = removePunctuation(word)
            if(!isNaN(nopunc)) return word;
            switch(nopunc.length){
                case 1:
                    return word;
                case 2:
                case 3:
                case 4:
                    return boldLettersUpTo(word, nopunc.length-1);
                default:
                    return calculateLongString(word);

            }
        }).join(' ');
    }

    let list = document.getElementsByTagName("p");  
    Array.from(list).forEach((element, ix) => {
        list[ix].innerHTML = neuralParse(element.innerText);
    });
}

let parseToggle = document.getElementById("parseToggle");
let parseButton = document.getElementById("parseButton");

runInitialization();

console.log(parseToggle)

parseToggle.addEventListener("change", async () => {

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true});

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: toggleParseOption,
        args: [parseToggle],
    });
})

parseButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true});

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: ParsePageText,
    });
});


async function runInitialization() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true});

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: setToggleState,
        args: [parseToggle],
    });

}

async function setToggleState() {
    console.log(parseToggle)
    chrome.storage.sync.get("autoParse", ({ autoParse }) => {
        parseToggle.checked = autoParse;
        console.log("toggle checked state: " + parseToggle.checked);
    });
}

function toggleParseOption() {
    chrome.storage.sync.get("autoParse", ({ autoParse }) => {   
        if (parseToggle.checked) {
            console.log("Checkbox is checked")
        } else {
            console.log("Checkbox NOT checked")
            autoParse = !autoParse;
            chrome.storage.sync.set({autoParse})
        }
    });
}

    // chrome.storage.sync.get("color", ({ color }) => {
//     parseButton.style.backgroundColor = color;
// })