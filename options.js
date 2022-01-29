function save_options() {
    var num_chars = document.getElementById('num_chars').value
    var avg_level = document.getElementById('avg_level').value
    var difficulty = document.getElementById('difficulty').value
    chrome.storage.local.set({num_chars: num_chars});
    chrome.storage.local.set({avg_level: avg_level});
    chrome.storage.local.set({difficulty: difficulty});
}

function load_options() {
    chrome.storage.local.get(['difficulty'], function (difficulty) {
        chrome.storage.local.get(['num_chars'], function (num_chars) {
            chrome.storage.local.get(['avg_level'], function (avg_level) {
                document.getElementById('num_chars').value = num_chars['num_chars']
                document.getElementById('difficulty').value  = difficulty['difficulty']
                document.getElementById('avg_level').value = avg_level['avg_level']         
            })
        })
    });
}

const btn = document.getElementById('btn_set')
btn.addEventListener("click", function () {
    save_options()
});

window.onload = function () {
    load_options()
}