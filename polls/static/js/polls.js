const qwrapper = document.querySelectorAll('.q-wrapper li');
const voteBtn = document.querySelector('.vote-btn')
let pickedID;

// -----------------------------------------
// generate csrf token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
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
    const url = `http://127.0.0.1:8000/vote-update/${pickedID}`
    console.log('picked id is:', pickedID)
    console.log('API url is:', url)

    fetch(url, {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
         'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({'id': pickedID})
    }).then((response) => {
        console.log("Call after calling the API")
    })
})
// ------------------------------------