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
    start_text = "<!DOCTYPE html><html>"+og_url+"<head></head><body>"
    end_text = "</body></html>"
    const name = document.getElementsByClassName("mon-stat-block__name-link")[0].getAttribute("href").split("/")[2]

    // console.log(name + ".txt")
    // console.log(details[0].innerHTML)
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
    document.getElementsByClassName("page-title")[0].appendChild(label);
    print_random_encounter(name)    

}

function print_random_encounter(monster) {
    var params = {format: 'html'}
    var encounter = httpGet('http://localhost:8080/api/party-up/'+monster, params)
    var encounter_ele = document.createElement('div')
    encounter_ele.innerHTML = encounter
    document.getElementsByClassName('more-info')[0].appendChild(encounter_ele)

}

function httpGet(theUrl, params) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false);
    // xmlHttp.setRequestHeader()
    xmlHttp.send( params );
    return xmlHttp.responseText

}

onPageLoad()
