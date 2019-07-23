

export class HTMLHelper {

    /**
     * Calculates an element position in relation to the window
     * @param element - HTMLElement/Element
     * @return {object} { x: value, y: value }
     */
    public static getPosition(element: any): any {
        let xPosition = 0;
        let yPosition = 0;

        while( element ) {
            xPosition += ( element.offsetLeft - element.scrollLeft + element.clientLeft );
            yPosition += ( element.offsetTop - element.scrollTop + element.clientTop );
            element = element.offsetParent;
        }

        return { x: xPosition, y: yPosition };
    };



    /**
     * Calculates the element position in relation to an element with the target id provided
     *
     * @param element
     * @param {string} targetId
     * @return {any}
     */
    public static getPositionToTargetId(element: any, targetId: string): any {
        let xPosition = 0;
        let yPosition = 0;

        while( element.id !== targetId ) {
            xPosition += ( element.offsetLeft - element.scrollLeft + element.clientLeft );
            yPosition += ( element.offsetTop - element.scrollTop + element.clientTop );
            element = element.offsetParent;
        }

        return { x: xPosition, y: yPosition };
    }



    /**
     * Calculates the absolute height of a specified HTML element
     * @param {HTMLElement} el
     * @return {number}
     */
    public static getAbsoluteHeight(el: HTMLElement): number {

        // Get the DOM Node if a string was provided
        el = ( typeof el === "string" ) ? document.querySelector( el ) : el;

        const styles = window.getComputedStyle( el );
        const margin = parseFloat( styles[ "marginTop" ] ) + parseFloat( styles[ "marginBottom" ] );

        return Math.ceil( el.offsetHeight + margin );
    }



    /**
     * Returns the index of the specified element
     * @param {Element} elem
     * @return {number}
     */
    public static getElementIndex(elem: Element): number {
        let  i = 0;
        while( ( elem = elem.previousElementSibling ) != null ) ++i;
        return i;
    }



    /**
     * Checks if the element is visible in the container
     * @param {HTMLElement} container
     * @param {HTMLElement} element
     * @param {boolean} partial
     * @return {boolean}
     */
    public static checkInView(container: HTMLElement, element: HTMLElement, partial: boolean): boolean {

        // Get container properties
        let cTop = container.scrollTop;
        let cBottom = cTop + container.clientHeight;

        // Get element properties
        let eTop = element.offsetTop;
        let eBottom = eTop + element.clientHeight;

        // Check
        let isTotal = ( eTop >= cTop && eBottom <= cBottom );
        let isPartial = partial && (
            ( eTop < cTop && eBottom > cTop ) ||
            ( eBottom > cBottom && eTop < cBottom )
        );

        // Return the result
        return  ( isTotal  || isPartial );
    }



    /**
     * Returns a boolean value, specifying if the element is partially in the viewport
     * NOTE: Accepts both HTML and jQuery elements
     * @param el - DOM/jQuery element
     * @returns {boolean}
     */
    public static isElementPartiallyInViewport(el: HTMLElement): boolean {
        // if ( typeof jQuery !== 'undefined' && el instanceof jQuery ) el = el[0];

        const rect = el.getBoundingClientRect();

        const windowHeight = ( window.innerHeight || document.documentElement.clientHeight );
        const windowWidth = ( window.innerWidth || document.documentElement.clientWidth );

        const vertInView = ( rect.top <= windowHeight ) && ( ( rect.top + rect.height ) >= 0 );
        const horInView = ( rect.left <= windowWidth ) && ( ( rect.left + rect.width ) >= 0 );

        return ( vertInView && horInView );
    };



    /**
     * Returns a boolean value, specifying if the element is in the viewport
     * NOTE: Accepts both HTML and jQuery elements
     * @param el - DOM/jQuery element
     * @returns {boolean}
     */
    public static isElementInViewport(el: HTMLElement): boolean {

        // if ( typeof jQuery !== 'undefined' && el instanceof jQuery ) el = el[0];

        const rect = el.getBoundingClientRect();

        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < ( window.innerWidth || document.documentElement.clientWidth ) /* or $(window).width() */ &&
            rect.top < ( window.innerHeight || document.documentElement.clientHeight ) /* or $(window).height() */;
    };



    /**
     * Copies a string to the clipboard
     *
     * @param {string} str
     */
    public static copyToClipboard(str: string): void {
        let el              = document.createElement( "textarea" );
        el.value            = str;
        el.style.position   = "absolute";
        el.style.left       = "-9999px";
        el.setAttribute( "readonly", '' );
        document.body.appendChild( el );

        if ( navigator.userAgent.match( /ipad|ipod|iphone/i ) ) {
            // save current contentEditable/readOnly status
            let editable = el.contentEditable;
            let readOnly = el.readOnly;

            // convert to editable with readonly to stop iOS keyboard opening
            el.contentEditable = "true";
            el.readOnly = true;

            // create a selectable range
            let range = document.createRange();
            range.selectNodeContents( el );

            // select the range
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange( range );
            el.setSelectionRange( 0, 999999 );

            // restore contentEditable/readOnly to original state
            el.contentEditable  = editable;
            el.readOnly         = readOnly;
        } else {
            el.select();
        }

        document.execCommand( "copy" );
        document.body.removeChild( el );
    }



    /**
     * Returns the index of an element in relationship to it's parent
     * element
     *
     * Useful when working with lists or dropdowns.
     *
     * @param {HTMLElement} element
     */
    public static indexOfElement(element: HTMLElement): void {
        return Array.prototype.indexOf.call( element.parentElement.children, element );
    }

}
