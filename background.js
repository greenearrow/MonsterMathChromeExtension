// window.bears = {}
// window.items = {}
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   window.bears[request.url] = request.count
// })

// chrome.browserAction.onClicked.addListener(function (tab) {
//     chrome.tabs.create({ url: 'popup.html' })
// })

chrome.runtime.onMessage.addListener(
    function (arg, sender, sendResponse) {
        if (arg.method == 'download') {
            chrome.downloads.download({
                url: arg.collection,
                filename: arg.filename,
                saveAs: false
            })
        }
        else if (arg.method == 'store monster') {
            // window.bears[arg.url] = arg.monsters
        }
        else if (arg.method == 'store item') {
            // window.items[arg.url] = arg.items
        };
    }
)

function sendResponse() {
}