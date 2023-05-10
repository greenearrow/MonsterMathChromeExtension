function save_options() {
    var num_chars = document.getElementById('num_chars').value
    var avg_level = document.getElementById('avg_level').value
    var difficulty = document.getElementById('difficulty').value
    var download_toggle = document.getElementById('download_toggle').value
    var index_toggle = document.getElementById('index_toggle').value
    chrome.storage.local.set({ num_chars: num_chars });
    chrome.storage.local.set({ avg_level: avg_level });
    chrome.storage.local.set({ difficulty: difficulty });
    chrome.storage.local.set({ download_toggle: download_toggle });
    chrome.storage.local.set({ index_toggle: index_toggle });
}

function load_options() {
    chrome.storage.local.get(['difficulty'], function (difficulty) {
        if (typeof difficulty['difficulty'] != 'string') {
            chrome.storage.local.set({ difficulty: 'Medium' })
        };
        document.getElementById('difficulty').value = difficulty['difficulty']
    });
    chrome.storage.local.get(['num_chars'], function (num_chars) {
        if (typeof num_chars['num_chars'] != 'string') {
            chrome.storage.local.set({ num_chars: 4 })
        };
        document.getElementById('num_chars').value = num_chars['num_chars']
    })
    chrome.storage.local.get(['avg_level'], function (avg_level) {
        if (typeof avg_level['avg_level'] != 'string') {
            chrome.storage.local.set({ avg_level: 5 })
            avg_level['avg_level'] = 5
        }
        document.getElementById('avg_level').value = avg_level['avg_level']
    })
    chrome.storage.local.get(['download_toggle'], function (download_toggle) {
        if (typeof download_toggle['download_toggle'] != "string") {
            chrome.storage.local.set({ download_toggle: 'off' })
            download_toggle['download_toggle'] = 'off'
        }
        document.getElementById('download_toggle').value = download_toggle['download_toggle']
    })
    chrome.storage.local.get(['index_toggle'], function (index_toggle) {
        if (typeof index_toggle['index_toggle'] != "string") {
            chrome.storage.local.set({ index_toggle: 'off' })
            index_toggle['index_toggle'] = 'off'
        }
        document.getElementById('index_toggle').value = index_toggle['index_toggle']
    })
}

function reset_downloads() {
    chrome.storage.local.clear();
}

const btn = document.getElementById('btn_set')
btn.addEventListener("click", function () {
    save_options()
});

const btn2 = document.getElementById('btn_reset')
btn2.addEventListener("click", function () {
    reset_downloads()
});
// const btn_reset = document.getElementById('btn_reset')
// btn_reset.addEventListener("click", function () {
//     reset_downloads()
// });

window.onload = function () {
    load_options()
}