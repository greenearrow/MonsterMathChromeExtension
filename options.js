function save_options() {
    var num_chars = document.getElementById('num_chars').value
    var avg_level = document.getElementById('avg_level').value
    var difficulty = document.getElementById('difficulty').value
    chrome.storage.local.set({num_chars: num_chars});
    chrome.storage.local.set({avg_level: avg_level});
    chrome.storage.local.set({difficulty: difficulty});
}
const btn = document.getElementById('btn_set')
btn.addEventListener("click", function () {
    save_options()
});