

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


}