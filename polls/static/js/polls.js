const qwrapper = document.querySelectorAll('.q-wrapper li');
const voteBtn = document.querySelector('.vote-btn')
let chartEl = document.getElementById('myChart')

let pickedID
let questionID = document.querySelector('[data-question-id]').dataset.questionId

let responseJson
const dataObject = {
    'items': [],
    'values': []
}

// -----------------------------------------
// if choice already in localStorage, hint that poll was already voted
// and show chart
let localStorageChoice = localStorage.getItem(questionID)
if(localStorageChoice) {
    document.querySelector(`[data-id="${localStorageChoice}"]`).classList.add('picked')
    pickedID = localStorageChoice
    initChart()
}
// -----------------------------------------

// -----------------------------------------
// generate csrf token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
// -----------------------------------------

// ------------------------------------
// choice handler
function resetChoices() {
    qwrapper.forEach((element) => {
        element.classList.remove('picked')
    })
}

qwrapper.forEach((element) => {
    element.addEventListener('click', ()=>{
      resetChoices()
      element.classList.add('picked')
      pickedID = element.dataset.id
    })
})
// ------------------------------------

// ------------------------------------
// fetch api --------------------------
voteBtn.addEventListener('click', () => {
    // save choice in localStorage
    localStorage.setItem(questionID, pickedID)
    // if chart already displayed: clear chart data
    dataObject.items = []
    dataObject.values = []

    const url = `http://127.0.0.1:8000/vote-update/${pickedID}`
    console.log('picked id is:', pickedID)
    console.log('API url is:', url)

    fetch(url, {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
         'X-CSRFToken': csrftoken
        }
    }).then((response) => {
        console.log("API done (incremented vote), now build chart")
        // call function that builds the Charts
        initChart()
    })
})
// ------------------------------------

// ------------------------------------
// create chart and fetch data

function getData() {

    const url = `http://127.0.0.1:8000/vote-detail/${questionID}`

    fetch(url)
    .then((response) => {
        responseJson = response.json()
    })
    .then(() => {
        responseJson.then((data) => {
            // Get the data from the API and fill arrays, call function to build charts afterwards
            data.forEach((x) => {
                let tmpItem = Object.keys(x)[0]
                let tmpKey = Object.values(x)[0]
                dataObject.items.push(tmpItem)
                dataObject.values.push(tmpKey)
            })
            buildChart()
        })
    })
}

function initChart() {
    console.log("init Chart called")
    getData()
}

function buildChart() {

        const chartData = {
        "type": "bar",
        "scale-x": {
            "values": dataObject.items
        },
        "series": [
            {
                "values": dataObject.values
            }
        ]
    }

    zingchart.render({
      id: "myChart",
      data: chartData,
    });

    chartEl.style['opacity'] = 1;
}
// ------------------------------------
