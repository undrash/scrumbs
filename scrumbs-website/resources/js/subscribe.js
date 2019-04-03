

const nameInput                     = document.getElementById( "subscriber-name" );
const emailInput                    = document.getElementById( "subscriber-email" );
const subscribeBtn                  = document.getElementById( "subscribe-button" );

const nameInputError                = document.getElementById( "name-input-error" );
const emailInputError               = document.getElementById( "email-input-error" );


const subscribeContainer            = document.getElementById( "subscribe-container" );
const subscribeSuccessContainer     = document.getElementById( "subscribed-feedback" );
const alreadySubscribedContainer    = document.getElementById( "already-subscribed-feedback" );


let blocked = false;



subscribeBtn.addEventListener( "click", () => {

    if ( blocked ) return;

    disableForm();

    const name      = nameInput.value;
    const email     = emailInput.value;


    if ( validateName( name ) && validateEmail( email ) ) {

        httpRequest(
            "POST",
            "https://www.scrumbs.app/subscriptions/subscribe",
            {
                name,
                email
            },
            (response) => {
                console.info( response );
                subscribeContainer.style.display            = "none";
                subscribeSuccessContainer.style.display     = "block";


            },
            (message) => {
                console.warn( message );
                subscribeContainer.style.display            = "none";
                alreadySubscribedContainer.style.display    = "block";

            }
        );

    } else {
        enableForm();
    }

});


nameInput.addEventListener( "focus", () => nameInputError.classList.remove( "show-input-error" ) );

emailInput.addEventListener( "focus", () => emailInputError.classList.remove( "show-input-error" ) );




function disableForm() {
    blocked             = true;
    nameInput.disabled  = true;
    emailInput.disabled = true;
}



function enableForm() {
    blocked             = false;
    nameInput.disabled  = false;
    emailInput.disabled = false;
}


function resetForm() {
    nameInput.value     = "";
    emailInput.value    = "";
}



function validateEmail(email) {
    let regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    const isEmailValid = regex.test( String(email).toLocaleLowerCase() );

    if ( ! isEmailValid ) {
        emailInputError.classList.add( "show-input-error" );
    }

    return isEmailValid;
}



function validateName(name) {
    const isNameValid = name.length >= 2 && name.length < 100;

    if ( ! isNameValid ) {
        nameInputError.classList.add( "show-input-error" );
    }

    return isNameValid;
}



function httpRequest(method, endpoint, data, success, failure) {

    let xhr = new XMLHttpRequest();

    xhr.open( method, endpoint, true );
    xhr.setRequestHeader( "Content-type", "application/json");
    xhr.setRequestHeader( "Accept", "application/json" );


    xhr.onload = () => {

        console.log( xhr.responseText );

        let response = JSON.parse( xhr.responseText );

        if ( response.success ) {

            if ( success ) success( response );

        } else {

            if ( failure ) failure( response.message );
        }
    };

    if ( data ) {
        xhr.send( JSON.stringify( data ) );
    } else {
        xhr.send();
    }

    return xhr;
}



