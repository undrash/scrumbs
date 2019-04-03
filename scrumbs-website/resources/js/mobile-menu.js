


if ( document.getElementById( "navbar-menu-btn" ) ) {

    const hamburgerMenu     = document.getElementById( "navbar-menu-btn" );
    const mobileMenu        = document.getElementById( "mobile-menu" );
    const closeMobileMenu   = document.getElementById( "close-mobile-menu-btn" );



    hamburgerMenu.addEventListener( "click", () => {
        mobileMenu.style.display = "block";
        document.documentElement.classList.add( "hide-page-overflow" );
        document.body.classList.add( "hide-page-overflow" );
    });


    closeMobileMenu.addEventListener( "click", () => {
        mobileMenu.style.display = "none";
        document.documentElement.classList.remove( "hide-page-overflow" );
        document.body.classList.remove( "hide-page-overflow" );
    });
}
