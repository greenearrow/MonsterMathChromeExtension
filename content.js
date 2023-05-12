const xtraMonkeyHost = 'https://1xtramonkey.net'
//const xtraMonkeyHost = 'http://localhost'
const alpha = 'abcdefghijklmnopqrstuvwxyz'


function catalogMonsters(raw_a, hop_list) {
    var my_html = ''
    var temp = link_decompose(raw_a, 'monster', hop_list)
    var links = temp[0]
    hop_list = temp[1]
    for (var link = 0; link < links.length; link++) {
        var my_link = links[link].pretty_link
        my_html = my_html + '<br/>' + my_link.outerHTML
        for (var p = 0; p < links[link].parent_id.length; p++) {
            var a = document.createElement('a')
            a.href = "#" + links[link].parent_id[p]
            a.innerHTML = links[link].parent_id[p]
            my_html = my_html + ' ' + a.outerHTML
        }
    }

    insideMathBox(my_html, 'monster-box')
    return hop_list
};
function catalogItems(raw_a, hop_list) {
    var my_html = ''
    var temp = link_decompose(raw_a, 'item', hop_list)
    var links = temp[0]
    hop_list = temp[1]
    for (var link = 0; link < links.length; link++) {
        var my_link = links[link].pretty_link
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
};
function catalogSpells(raw_a, hop_list) {
    var my_html = ''
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
};
function readDetails(details) {
    var data = getNameId()
    var name = data['name']
    var id = data['id']
    if (!(id == '-')) {
        var key = name + '-' + id
    } else { var key = name }

    chrome.storage.local.get([key, 'dl_object_toggle'], function (val) {
        if (typeof val[key] != 'string') {
            if (val['dl_object_toggle'] == 'on') {
                downloadDNDB(key, data['og_url'], details, val)
            }
        }
        else {
            console.log(name + ' already downloaded')

        };
    });
    printRandomEncounter(id + '-' + name)
};
function downloadDNDB(key, og_url, details, val) {

    var start_text = "<!DOCTYPE html><html>" + og_url + "<head></head><body>"
    var end_text = "</body></html>"
    var details_html = start_text + details[0].outerHTML + end_text
    var blob = new Blob([details_html], { type: "text/html" })
    var url = URL.createObjectURL(blob)
    var filename = key + '.html'
    var param = {
        method: 'download',
        collection: url,
        filename: filename
    }
    chrome.runtime.sendMessage(param)
    console.log(key)
    val[key] = key;
    // Save data
    chrome.storage.local.set(val)
    console.log('stored ' + key);
}
function getNameId() {
    const og_url = document.querySelectorAll('[property="og:url"]')[0].outerHTML
    var names = document.querySelectorAll('[property="og:url"]')[0].content
    var name = names.split("/").slice(-1)[0]
    if (!(isNaN(name.split('-')[0]))) {
        var id = name.split('-')[0]
        name = name.split('-').slice(1).join('-')
    } else { var id = '' }
    // } else {
    // var name = document.getElementsByClassName('Core-Styles_Chapter-Title')[0].innerHTML 
    // }
    return { name: name, id: id, og_url: og_url }
}

function printRandomEncounter(monster) {
    chrome.storage.local.get(['difficulty', 'num_chars', 'avg_level', 'encounter_toggle'], function (data) {
         if (typeof data['encounter_toggle'] == 'string' & data['encounter_toggle'] == 'on') {
            var params = {
                format: 'html',
                difficulty: data["difficulty"] ?? "Medium",
                characters: data["num_chars"] ?? 5,
                level: data["avg_level"] ?? 11

            }
            var encounter = httpPost(xtraMonkeyHost + '/api/party-up/' + monster, params)
            if (!encounter.includes('500 Internal Server Error')) {
                var encounter_ele = document.createElement('div')
                encounter_ele.innerHTML = encounter
                document.getElementsByClassName('more-info')[0].appendChild(encounter_ele)
            }
        }
    })

};

function mathBox() {
    if (document.getElementsByClassName('math-box'.len == 0)) {
        var main_content_container = document.getElementsByClassName('secondary-content')[0]
        var math_box = document.createElement('section')
        math_box.style.backgroundColor = '#fff'
        math_box.style.border = '1px solid #CBC6C3'
        math_box.classList.add('math-box')

        main_content_container.appendChild(math_box)
    }
};


function insideMathBox(my_html, my_class) {
    mathBox()
    var item_box = document.createElement('div')
    item_box.classList.add(my_class)
    //    item_box.style.backgroundColor = 'gray';
    item_box.innerHTML = my_html
    document.getElementsByClassName('math-box')[0].appendChild(item_box)
};

function httpPost(theUrl, params) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, false);
    // xmlHttp.setRequestHeader('Access-Control-Allow-Origin','*')
    // xmlHttp.setRequestHeader('Access-Control-Allow-Methods')
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {   //if complete
            if (xmlHttp.status === 200) {  //check if "OK" (200)
                //success
            } else {
                xmlHttp.responseText = ""; //otherwise, some other code was returned
            }
        }
    }
    xmlHttp.send(JSON.stringify(params));
    return xmlHttp.responseText

};

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
        var id = my_object.href.split('/').slice(-1)[0]
        if (!(isNaN(id.split('-')[0]))) {
            var path = id //.split('-').slice(1).join('-') // THIS IS BASED ON THE NON-KEYED NAME - TEXT ONLY, NOT LEADING NUMBER 
            //change this to take name-id instead of name only. 
        } else { var path = id }
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
                    pos = Object.keys(hop_list).length
                } // this is overwriting the id, so any existing links or javascript may fuck up
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
};

function remove_from_storage(key) {
    chrome.local.storage.remove(key)
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
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
};

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
};

function titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }

    return sentence.join(" ");
};
/**
 * Forces a reload of all stylesheets by appending a unique query string
 * to each stylesheet URL.
 */
function reloadStylesheets() {
    // var queryString = '?reload=' + new Date().getTime();
    // $('link[rel="stylesheet"]').each(function () {
    //     this.href = this.href.replace(/\?.*|$/, queryString);
    // });
};

function exportSourcePage(containers, header, title, my_url) {
    title = title.replace(' - Sources - D&D Beyond', "")
    start_text = "<!DOCTYPE html><html><head><title>" + title + "</title></head><body>"
    end_text = "</body></html>"
    var header_txt = ''
    for (const item of header) {
        header_txt += item.outerHTML
    }
    var container_txt = ''
    var img_arr = []


    key = my_url.replace('https://www.dndbeyond.com/sources/', '').replace('/', '_').split('#')[0]

    chrome.storage.local.get(key, function (val) {
        // Create property if does not exist (yet)
        if (typeof val[key] != 'string') {
            for (const item of containers) {
                let script_ele = item.getElementsByTagName('script')
                // for (ele of script_ele) {
                //     ele.remove() //This may remove all scripts from the page AS YOU ARE ATTEMPTING TO USE IT
                // }
                container_txt += item.outerHTML
                for (const image of item.getElementsByTagName('img')) {

                    downloadImage(image.src, image.src.replace('https://www.dndbeyond.com/', ''))
                    if (image.parentElement.hasAttribute('href')) {
                        href = image.parentElement.href
                        if (href != image.src) {
                            downloadImage(href, href.replace('https://www.dndbeyond.com/', ''))
                        }
                    }
                }
            }
            var details_html = start_text + header_txt + container_txt + end_text
            details_html = details_html.replace('https://www.dndbeyond.com', '')
            var blob = new Blob([details_html], { type: "text/html" })
            var url = URL.createObjectURL(blob)
            var filename = my_url.replace('https://www.dndbeyond.com/sources/', '').replace('/', '_') + '.html'
            var param = {
                method: 'download',
                collection: url,
                filename: filename
            }
            chrome.runtime.sendMessage(param)
            // let label = document.createElement("p");
            // label.innerHTML = 'Downloaded!'
            // document.getElementsByClassName("page-title")[0].appendChild(label)
            // Append value of param1
            // console.log(key)
            val[key] = key;
            // Save data
            chrome.storage.local.set(val)
            // console.log('stored ' + key);
        }
    });
    // let button = document.createElement('button')
    // button.fun = function () { remove_from_storage(key) }
    // button.innerText = "Clear from memory"
    // header[0].appendChild(button)
    //    });
};

async function downloadImage(imageSrc, filename) { //I imagine this will need to go into background, which will ruin it, but who knows, it may work.
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
};

function onPageLoad() {


    const mm_options = document.getElementsByClassName("MM-options") // Extension Options page identification
    const monster_search_form = document.getElementById('monster-search-form')

    const my_params = new URLSearchParams(document.location.search)
    const listing = document.getElementsByClassName('listing')


    const
        keys = my_params.keys(),
        values = my_params.values(),
        entries = my_params.entries();

    for (const key of keys) console.log(key);
    downloadCheck()
    indexCheck()
    if (mm_options.length != 0) {
        console.log("I'm on my options page!")
    }



};

function downloadCheck() {
    const my_url = document.location.href
    const details = document.getElementsByClassName("more-info") // identifies monster stat block pages (and maybe also spell and magic item pages, but not supported yet)
    const article = document.getElementsByClassName('p-article') // future - strip articles
    const header = document.getElementsByClassName("page-header")
    const container = document.getElementsByClassName("container")
    const title = document.title
    chrome.storage.local.get(['dl_source_toggle'], function (dl_source_toggle) {


        if (dl_source_toggle['dl_source_toggle'] == 'on') {
            if ('www.dndbeyond.com' == document.location.href.split('/')[2] & 'sources' == document.location.href.split('/')[3]) {
                exportSourcePage(container, header, title, my_url)
            }

            // if (article.length != 0) {
            //     readDetails(article)
            // }

        }
        if (details.length != 0) {
            readDetails(details)
        }
    })
}

function indexCheck() {
    const monster_links = document.getElementsByClassName("monster-tooltip") // looks for all monsters listed
    const item_links = document.getElementsByClassName("magic-item-tooltip") // looks for all magic items listed
    const spell_links = document.getElementsByClassName("spell-tooltip") // looks for all spells listed
    var hop_list = Object()
    chrome.storage.local.get(['index_toggle'], function (index_toggle) {
        if (index_toggle['index_toggle'] == 'on') {
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
        }
    })
}
onPageLoad()
