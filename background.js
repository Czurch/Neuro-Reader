let autoParse = true;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ autoParse });
    console.log('Default behaviour set to not AutoParse', `autoParse: ${autoParse}`)
});