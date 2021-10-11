//alert('Grrr.')
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   const re = new RegExp('bear', 'gi')
//   const matches = document.documentElement.innerHTML.match(re)
//   sendResponse({count: matches.length})
// })

// const re = new RegExp('bear', 'gi')
// const matches = document.documentElement.innerHTML.match(re) || []

// chrome.runtime.sendMessage({
//   url: window.location.href,
//   count: matches.length
// })


function onPageLoad() {
    const details = document.getElementsByClassName("more-info")
    const monster_links = document.getElementsByClassName("monster-tooltip")
    if (details.length != 0) {
        readDetails(details)
    }
    if (monster_links.length !=0) {
        catalogMonsters(monster_links)
    }

};

function catalogMonsters(monster_links) {
    var monsters = ''
    for (link in monster_links) {
        if (link == parseInt(link,10)) {
            monsters = monsters + '<p>'+ monster_links[link].getAttribute("href") + '</p>'
        }
    }
    var param = {
        method: 'store monster',
        monsters: monsters
    }
    chrome.runtime.sendMessage(param)
}

function readDetails(details) {
    const og_url = document.querySelectorAll('[property="og:url"]')[0].outerHTML

    const name = document.getElementsByClassName("mon-stat-block__name-link")[0].getAttribute("href").split("/")[2]
    start_text = "<!DOCTYPE html><html>"+og_url+"<head></head><body>"
    end_text = "</body></html>"
    var param1 = name
    var key = name
    chrome.storage.local.get(key, function(val) {
        // Create property if does not exist (yet)
        if (typeof val[key] != 'string') {
            var details_html = start_text + details[0].outerHTML + end_text
            var blob = new Blob([details_html],{type: "text/html"})
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
            val[key] += param1;
            // Save data
            chrome.storage.local.set(val);
        } 
        else {printRandomEncounter(name)};
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
                console.log(params)
                // console.log(result_2['num_chars'])
                var encounter = httpGet('https://1xtramonkey.net/api/party-up/'+monster, params)
                var encounter_ele = document.createElement('div')
                encounter_ele.innerHTML = encounter
                document.getElementsByClassName('more-info')[0].appendChild(encounter_ele)
                
            })
        })
    })

}

function httpGet(theUrl, params) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, false);
    // xmlHttp.setRequestHeader()
    xmlHttp.send( JSON.stringify(params) );
    return xmlHttp.responseText
}

onPageLoad()
