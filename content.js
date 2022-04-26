const xtraMonkeyHost = 'https://1xtramonkey.net'
const alpha = 'abcdefghijklmnopqrstuvwxyz'


function catalogMonsters(raw_a, hop_list) {
    var my_html = ''
    // var monsters_ = ''
    var temp = link_decompose(raw_a, 'monster', hop_list)
    var links = temp[0]
    hop_list = temp[1]
    for (var link = 0; link < links.length; link++) {
        var my_link = links[link].pretty_link
        //        my_link.classList.add('monster-tooltip')
        my_html = my_html + '<br/>' + my_link.outerHTML
        for (var p = 0; p < links[link].parent_id.length; p++) {
            var a = document.createElement('a')
            a.href = "#" + links[link].parent_id[p]
            a.innerHTML = links[link].parent_id[p]
            my_html = my_html + ' ' + a.outerHTML
        }
    }
    // console.log(my_html)
    // var param = {
    //     method: 'store monster',
    //     monsters: my_html
    // }
    // chrome.runtime.sendMessage(param)
    insideMathBox(my_html, 'monster-box')
    return hop_list
}
function catalogItems(raw_a, hop_list) {
    var my_html = ''
    // var monsters_ = ''
    var temp = link_decompose(raw_a, 'item', hop_list)
    var links = temp[0]
    hop_list = temp[1]
    for (var link = 0; link < links.length; link++) {
        var my_link = links[link].pretty_link
        //        my_link.classList.add('monster-tooltip')
        my_html = my_html + '<br/>' + my_link.outerHTML
        for (var p = 0; p < links[link].parent_id.length; p++) {
            var a = document.createElement('a')
            a.href = "#" + links[link].parent_id[p]
            a.innerHTML = links[link].parent_id[p]
            my_html = my_html + ' ' + a.outerHTML
        }
    }

    insideMathBox(my_html, 'item-box')
    return hop_list
}
function catalogSpells(raw_a, hop_list) {
    var my_html = ''
    // var monsters_ = ''
    var temp = link_decompose(raw_a, 'spell', hop_list)
    var links = temp[0]
    hop_list = temp[1]
    for (var link = 0; link < links.length; link++) {
        var my_link = links[link].pretty_link
        //        my_link.classList.add('monster-tooltip')
        my_html = my_html + '<br/>' + my_link.outerHTML
        for (var p = 0; p < links[link].parent_id.length; p++) {
            var a = document.createElement('a')
            a.href = "#" + links[link].parent_id[p]
            a.innerHTML = links[link].parent_id[p]
            my_html = my_html + ' ' + a.outerHTML
        }
    }

    insideMathBox(my_html, 'spell-box')
    return hop_list
}
function readDetails(details) {
    const og_url = document.querySelectorAll('[property="og:url"]')[0].outerHTML
    var names = document.querySelectorAll('[property="og:url"]')[0].content
    var name = names.split("/").slice(-1)
    // } else {
    // var name = document.getElementsByClassName('Core-Styles_Chapter-Title')[0].innerHTML 
    // }
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

// function monsterBox(monsters) {
//     mathBox()
//     var monster_box = document.createElement('div')
//     monster_box.classList.add('monster-box')
//     monster_box.innerHTML = monsters
//     document.getElementsByClassName('math-box')[0].appendChild(monster_box)

// }

// function itemBox(items) {
//     mathBox()
//     var item_box = document.createElement('div')
//     item_box.classList.add('item-box')
//     //    item_box.style.backgroundColor = 'gray';
//     item_box.innerHTML = items
//     document.getElementsByClassName('math-box')[0].appendChild(item_box)
// }

function insideMathBox(my_html, my_class) {
    mathBox()
    var item_box = document.createElement('div')
    item_box.classList.add(my_class)
    //    item_box.style.backgroundColor = 'gray';
    item_box.innerHTML = my_html
    document.getElementsByClassName('math-box')[0].appendChild(item_box)
}

function httpGet(theUrl, params) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, false);
    // xmlHttp.setRequestHeader()
    xmlHttp.send(JSON.stringify(params));
    return xmlHttp.responseText
}

function link_decompose(collection, link_type, hop_list) {
    // Get list of applicable links
    var hrefs = []
    for (var link = 0; link < collection.length; link++) {
        if (!(collection[link.href] in hrefs)) {
            hrefs.push(collection[link].href)
        }
    }
    hrefs = hrefs.filter(onlyUnique)

    // apply structured object to each link
    var dict = Object()
    for (var link = 0; link < hrefs.length; link++) {
        dict[hrefs[link]] = {
            'names': [],
            'name': "",
            'members': [],
            'link': '',
            'pretty_link': document.createElement('a'),
            'parent_id': []
        }
    }

    // populate structure with details
    for (var link = 0; link < collection.length; link++) {
        var my_object = collection[link]
        dict[my_object.href].names.push(my_object.innerHTML)
        dict[my_object.href].members.push(my_object)

        // Provide 1xtramonkey link 
        var path = my_object.href.split('/').slice(-1)[0].split('-').slice(1).join('-') // THIS IS BASED ON THE NON-KEYED NAME - TEXT ONLY, NOT LEADING NUMBER
        var a = document.createElement('a');
        a.href = xtraMonkeyHost + '/' + link_type + '/' + path
        var text = document.createElement('SUP')
        text.innerHTML = '🐵'
        a.appendChild(text)
        a.title = 'Lookup ' + my_object.innerHTML + ' on 1xtramonkey'
        my_object.parentNode.insertBefore(a, my_object.nextSibling)

        var my_content_chunk = getMyContentChunk(my_object)

        try {
            if (typeof my_content_chunk.id !== 'undefined') {
                var id = true
                var my_content_chunk_id = my_content_chunk.id
            }
            else {
                var my_content_chunk_id = my_content_chunk.dataset.contentChunkId
                var id = false
            }
            if (!(my_content_chunk_id in Object.keys(hop_list))) {
                if (id) {
                pos = Object.keys(hop_list).length} // this is overwriting the id, so any existing links or javascript may fuck up
                hop_list[my_content_chunk.dataset.contentChunkId] = pos
                my_content_chunk.id = pos
            }
            dict[my_object.href].parent_id.push(pos)
        } catch { console.log(my_object.innerHTML) }

        // Gather parent content-chunk-id and return as linkable id

    }
    var names = Object()
    for (link in dict) {
        dict[link].names = dict[link].names.filter(onlyUnique)
        dict[link].link = link
        dict[link].name = titleCase(returnShortest(dict[link].names)[0])
        names[dict[link].name] = link
    }
    var sorted_names = Object.keys(names).sort()
    var response = []

    for (var n = 0; n < sorted_names.length; n++) {
        var link = names[sorted_names[n]]
        var my_object = dict[link]
        my_object = dict[link]
        my_object.pretty_link.href = link
        my_object.pretty_link.innerHTML = sorted_names[n]
        response.push(my_object)
    }
    return [response, hop_list]
}

function getMyContentChunk(ele) {
    try {
        var my_content_chunk_id = ele.id
        if (my_content_chunk_id == '') {
            var my_content_chunk_id = ele.dataset.contentChunkId
            if (typeof my_content_chunk_id == 'undefined') {
                ele = getMyContentChunk(ele.parentElement)
            }
        }
    } catch { console.log(ele.innerHTML) } finally {
        return ele
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function returnShortest(value) {
    var response = []
    var lengths = []
    for (i = 0; i < value.length; i++) lengths.push(value[i].length)
    var min = Math.min(...lengths)
    for (v = 0; v < value.length; v++) {
        if (lengths[v] == min) {
            response.push(value[v])
        }
    }
    return response
}

function titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }

    return sentence.join(" ");
}
/**
 * Forces a reload of all stylesheets by appending a unique query string
 * to each stylesheet URL.
 */
 function reloadStylesheets() {
    var queryString = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function () {
        this.href = this.href.replace(/\?.*|$/, queryString);
    });
}
function onPageLoad() {
    const details = document.getElementsByClassName("more-info")
    const article = document.getElementsByClassName('p-article')
    const monster_links = document.getElementsByClassName("monster-tooltip")
    const item_links = document.getElementsByClassName("magic-item-tooltip")
    const spell_links = document.getElementsByClassName("spell-tooltip")
    const mm_options = document.getElementsByClassName("MM-options")
    var hop_list = Object()
    if (mm_options.length != 0) {
        console.log("I'm on my options page!")
    }
    if (details.length != 0) {
        readDetails(details)
    }
    // if (article.length != 0) {
    //     readDetails(article)
    // }
    if (monster_links.length != 0) {
        hop_list = catalogMonsters(monster_links, hop_list)
    }
    if (item_links.length != 0) {
        hop_list = catalogItems(item_links, hop_list)
    }
    if (spell_links.length != 0) {
        hop_list = catalogSpells(spell_links, hop_list)
    }
    reloadStylesheets()
};

onPageLoad()
