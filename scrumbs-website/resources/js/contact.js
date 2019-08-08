
const nameInput     = document.getElementById( "contact-name" );
const emailInput    = document.getElementById( "contact-email" );
const messageInput  = document.getElementById( "contact-message" );
const sendBtn       = document.getElementById( "send-message-btn" );

const nameError     = document.getElementById( "contact-name-input-error" );
const emailError    = document.getElementById( "contact-email-input-error" );
const messageError  = document.getElementById( "contact-message-input-error" );

const feedbackSuccess   = document.getElementById( "email-sent-feedback-success" );
const feedbackError     = document.getElementById( "email-sent-feedback-error" );
const contactContainer  = document.getElementById( "contact-container" );


sendBtn.addEventListener( "click", () => {

    if ( ! validateInputs() ) return;

    httpRequest(
        "POST",
        `${ location.protocol }//${ location.hostname }${ location.port ? ':' + location.port: '' }/contact`,
        {
           name: nameInput.value,
           email: emailInput.value,
           message: messageInput.value
        },
        () => {
            contactContainer.style.display  = "none";
            feedbackSuccess.style.display   = "block";
        },
        (err) => {
            contactContainer.style.display  = "none";
            feedbackError.style.display     = "block";
            console.error( err );
        }
    )
});


nameInput.addEventListener( "focus", () => nameError.style.opacity = "0" );
emailInput.addEventListener( "focus", () => emailError.style.opacity = "0" );
messageInput.addEventListener( "focus", () => messageError.style.opacity = "0" );



function validateInputs() {

    let isValid = true;

    if ( nameInput.value.length < 1 ) {
        nameError.style.opacity = "1";
        isValid = false;
    }

    if ( validateEmail( emailInput.value ) ) {
        emailError.style.opacity = "1";
        isValid = false;
    }

    if ( messageInput.value.length < 1 ) {
        messageError.style.opacity = "1";
        isValid = false;
    }

    return isValid;
}



function validateEmail(email) {
    let regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    return ! regex.test( String( email ).toLocaleLowerCase() );
}



function httpRequest(method, endpoint, data, success, failure) {

    let xhr = new XMLHttpRequest();

    xhr.open( method, endpoint, true );
    xhr.setRequestHeader( "Content-type", "application/json");
    xhr.setRequestHeader( "Accept", "application/json" );


    xhr.onload = () => {

        let response = JSON.parse( xhr.responseText );

        if ( xhr.status == 200 || response.success ) {

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