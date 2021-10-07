function save_options() {
    var num_chars = document.getElementById('num_chars')
    var avg_level = document.getElementById('avg_level')
    console.log(num_chars)
    console.log(avg_level)
    chrome.storage.local.set({num_chars: num_chars});
    chrome.storage.local.set({avg_level: avg_level});
}
const btn = document.getElementById('btn_set')
btn.addEventListener("click", function () {
    console.log('click')
});