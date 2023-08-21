function save_options() {
    var num_chars = document.getElementById("num_chars").value
    var avg_level = document.getElementById("avg_level").value
    var difficulty = document.getElementById("difficulty").value
    var dl_source_toggle = document.getElementById("dl_source_toggle").value
    var dl_object_toggle = document.getElementById("dl_object_toggle").value
    var index_toggle = document.getElementById("index_toggle").value
    var encounter_toggle = document.getElementById("encounter_toggle").value
    chrome.storage.local.set({ num_chars: num_chars });
    chrome.storage.local.set({ avg_level: avg_level });
    chrome.storage.local.set({ difficulty: difficulty });
    chrome.storage.local.set({ dl_source_toggle: dl_source_toggle });
    chrome.storage.local.set({ dl_object_toggle: dl_object_toggle });
    chrome.storage.local.set({ index_toggle: index_toggle });
    chrome.storage.local.set({ encounter_toggle: encounter_toggle });
}

function load_options() {
    chrome.storage.local.get(["difficulty"], function (difficulty) {
        if (typeof difficulty["difficulty"] != "string") {
            chrome.storage.local.set({ difficulty: "Medium" })
        };
        document.getElementById("difficulty").value = difficulty["difficulty"]
    });
    chrome.storage.local.get(["num_chars"], function (num_chars) {
        if (typeof num_chars["num_chars"] != "string") {
            chrome.storage.local.set({ num_chars: 4 })
        };
        document.getElementById("num_chars").value = num_chars["num_chars"]
    })
    chrome.storage.local.get(["avg_level"], function (avg_level) {
        if (typeof avg_level["avg_level"] != "string") {
            chrome.storage.local.set({ avg_level: 5 })
            avg_level["avg_level"] = 5
        }
        document.getElementById("avg_level").value = avg_level["avg_level"]
    })
    chrome.storage.local.get(["dl_source_toggle"], function (dl_source_toggle) {
        if (typeof dl_source_toggle["dl_source_toggle"] != "string") {
            chrome.storage.local.set({ dl_source_toggle: "off" })
            dl_source_toggle["dl_source_toggle"] = "off"
        }
        document.getElementById("dl_source_toggle").value = dl_source_toggle["dl_source_toggle"]
    })
    chrome.storage.local.get(["dl_object_toggle"], function (dl_object_toggle) {
        if (typeof dl_object_toggle["dl_object_toggle"] != "string") {
            chrome.storage.local.set({ dl_object_toggle: "off" })
            dl_object_toggle["dl_object_toggle"] = "off"
        }
        document.getElementById("dl_object_toggle").value = dl_object_toggle["dl_object_toggle"]
    })
    chrome.storage.local.get(["index_toggle"], function (index_toggle) {
        if (typeof index_toggle["index_toggle"] != "string") {
            chrome.storage.local.set({ index_toggle: "on" })
            index_toggle["index_toggle"] = "on"
        }
        document.getElementById("index_toggle").value = index_toggle["index_toggle"]
    })
    chrome.storage.local.get(["encounter_toggle"], function (encounter_toggle) {
        if (typeof encounter_toggle["encounter_toggle"] != "string") {
            chrome.storage.local.set({ encounter_toggle: "on" })
            encounter_toggle["encounter_toggle"] = "on"
        }
        document.getElementById("encounter_toggle").value = encounter_toggle["encounter_toggle"]
    })
}

function reset_downloads() {
    chrome.storage.local.clear();
}

const btn = document.getElementById("btn_set")
btn.addEventListener("click", function () {
    save_options()
});

const btn2 = document.getElementById("btn_reset")
btn2.addEventListener("click", function () {
    reset_downloads()
});
// const btn_reset = document.getElementById("btn_reset")
// btn_reset.addEventListener("click", function () {
//     reset_downloads()
// });

window.onload = function () {
    load_options()
}