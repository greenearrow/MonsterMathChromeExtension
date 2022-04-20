function onPageLoad() {
    const details = document.getElementsByClassName("more-info")
    const monster_links = document.getElementsByClassName("monster-tooltip")
    const item_links = document.getElementsByClassName("magic-item-tooltip")
    const spell_links = document.getElementsByClassName("spell-tooltip")
    const mm_options = document.getElementsByClassName("MM-options")
    if (mm_options.length != 0) {
        console.log("I'm on my options page!")
    }
    if (details.length != 0) {
        readDetails(details)
    }
    if (monster_links.length != 0) {
        catalogMonsters(monster_links)
    }
    if (item_links.length != 0) {
        catalogItems(item_links)
    }

};

function catalogMonsters(monster_links) {
    var monsters = ''
    // var monsters_ = ''
    for (var link = 0; link < monster_links.length; link++) {

        if (monsters.includes(monster_links[link].outerHTML) == false) {
            monsters = monsters + '<br/>' + monster_links[link].outerHTML
        }
    }
    var param = {
        method: 'store monster',
        monsters: monsters
    }
    chrome.runtime.sendMessage(param)
    monsterBox(monsters)
}
function catalogItems(item_links) {
    var items = ''
    for (var link = 0; link < item_links.length; link++) {
        if (items.includes(item_links[link].outerHTML) == false) {
            items = items + '<br/>' + item_links[link].outerHTML
        }
    }
    var param = {
        method: 'store item',
        items: items
    }
    chrome.runtime.sendMessage(param)
    itemBox(items)
}

function readDetails(details) {
    const og_url = document.querySelectorAll('[property="og:url"]')[0].outerHTML
    const name = document.getElementsByClassName("mon-stat-block__name-link")[0].getAttribute("href").split("/")[2]
    var param1 = name
    var key = name
    start_text = "<!DOCTYPE html><html>" + og_url + "<head></head><body>"
    end_text = "</body></html>"
    chrome.storage.local.get(key, function (val) {
        // Create property if does not exist (yet)
        if (typeof val[key] != 'string') {
            var details_html = start_text + details[0].outerHTML + end_text
            var blob = new Blob([details_html], { type: "text/html" })
            var url = URL.createObjectURL(blob)
            var filename = name + '.html'
            var param = {
                method: 'download',
                collection: url,
                filename: filename
            }
            chrome.runtime.sendMessage(param)
            let label = document.createElement("p");
            label.innerHTML = 'Downloaded!'
            document.getElementsByClassName("page-title")[0].appendChild(label)
            // Append value of param1
            console.log(param1)
            val[key] = param1;
            // Save data
            chrome.storage.local.set(val);
        }
        else { printRandomEncounter(name) };
    });
}

function printRandomEncounter(monster) {
    chrome.storage.local.get(['difficulty'], function (difficulty) {
        chrome.storage.local.get(['num_chars'], function (num_chars) {
            chrome.storage.local.get(['avg_level'], function (avg_level) {
                var params = {
                    format: 'html',
                    difficulty: difficulty["difficulty"],
                    characters: num_chars["num_chars"],
                    level: avg_level["avg_level"]

                }
                var encounter = httpGet('http://localhost:8080/api/party-up/' + monster, params)
                var encounter_ele = document.createElement('div')
                encounter_ele.innerHTML = encounter
                document.getElementsByClassName('more-info')[0].appendChild(encounter_ele)

            })
        })
    })

}

function mathBox() {
    if (document.getElementsByClassName('math-box'.len == 0)) {
        var main_content_container = document.getElementsByClassName('main content-container')[0]
        var math_box = document.createElement('section')
        math_box.classList.add('math-box')

        main_content_container.appendChild(math_box)
    }
}

function monsterBox(monsters) {
    mathBox()
    var monster_box = document.createElement('div')
    monster_box.classList.add('monster-box')
    monster_box.innerHTML = monsters
    document.getElementsByClassName('math-box')[0].appendChild(monster_box)

}

function itemBox(items) {
    mathBox()
    var item_box = document.createElement('div')
    item_box.classList.add('item-box')
    //    item_box.style.backgroundColor = 'gray';
    item_box.innerHTML = items
    document.getElementsByClassName('math-box')[0].appendChild(item_box)
}

function httpGet(theUrl, params) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, false);
    // xmlHttp.setRequestHeader()
    xmlHttp.send(JSON.stringify(params));
    return xmlHttp.responseText
}

function link_decompose(collection) {
    var hrefs = []
    for (var link = 0; link < collection.length; link++) {
        if (!(collection[link.href] in hrefs)) {
            hrefs.push(collection[link].href)
        }
    }
    hrefs = hrefs.filter(onlyUnique)
    var dict = Object()
    for (var link = 0; link < hrefs.length; link++) {
        dict[hrefs[link]] = {
            'name': '',
            'members': []
        }
    }
    for (var link = 0; link < collection.length; link++) {
        dict[collection[link].href]['name'] = collection[link].innerHTML
        dict[collection[link].href]['members'].push(collection[link])
    }
    for (link in dict) {
        console.log(dict[link].name)
    }
    return dict
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

onPageLoad()
