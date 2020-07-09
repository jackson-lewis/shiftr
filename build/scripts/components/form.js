/**
 * Imports
 */
import { Layout, createEl } from '../inc/global'
import ShiftrComponent from '../inc/component-functions'

const { head } = Layout


/**
 * class
 */
export default class Form extends ShiftrComponent {

    /** @var {bool} cssRequested State of the stylesheet download for Form actions */
    cssRequested = false

    componentSlug() {
        return `form`
    }

    defaultSettings() {
        return {
            states: true,
            validate: true,
            submission: true,
            validationClasses: {
                focus: 'field-event--focus',
                success: 'field-event--success',
                error: 'field-event--error'
            },
            submitMessageCopy: shiftr.form || {}
        }
    }


    /**
     * 
     */
    constructor( ...args ) {
        super( ...args )

        this.fields = this.target.querySelectorAll( `input:not([type="hidden"]):not([type="submit"]), textarea, select` )
        this.submitButton = this.target.querySelector( `[type="submit"]` )
        this.submitButtonOrgLabel = this.submitButton.innerHTML

        this.actionClass = this.settings.validationClasses
    }


    /**
     * Set up event listeners to all components of the form
     */
    init() {
        this.fieldEvents()
        this.submitButton.addEventListener( 'mouseover', this.getStyles.bind( this ) );
        this.target.addEventListener( `submit`, this.submit.bind( this ) )
    }


    /**
     * 
     */
    fieldEvents() {

        const { focus, success, error } = this.actionClass

        this.fields.forEach( field => {

            const { parentElement: fieldWrapper } = field
            field.validateErrorActive = false

            if ( field.nodeName === `SELECT` ) {
                field.addEventListener( `change`, () => {
                    fieldWrapper.classList.add( success )
                })

            } else {
                if ( field.type != `checkbox` && field.type != `radio` ) {
                    
                    field.addEventListener( `focus`, () => {
                        this.getStyles()
                        fieldWrapper.classList.add( focus )
                    })
    
                    field.addEventListener( `blur`, () => {
                        fieldWrapper.classList.remove( focus )
                        fieldWrapper.classList.remove( success )
                        fieldWrapper.classList.remove( error )
    
                        if ( this.settings.validate && field.value != '' ) {
    
                            if ( field.checkValidity() ) {
                                fieldWrapper.classList.add( success )
                                this.clearValidationError( field )
    
                            } else  {
                                fieldWrapper.classList.add( error )
                            }
                        }
                    })

                } else if ( field.type == `checkbox` || field.type == `radio` ) {

                    if ( this.settings.validate ) {
                        field.addEventListener( 'change', e => {
        
                            if ( field.checked ) {
                                fieldWrapper.classList.remove( error )
                                this.clearValidationError( field )
                            }
                        })
                    }
                }

                if ( this.settings.validate ) {
                    field.addEventListener( 'invalid', e => {
                        e.preventDefault()

                        fieldWrapper.classList.add( error )
                        if ( ! field.validateErrorActive ) {
                            this.displayValidationError( field )
                            field.validateErrorActive = true
                        }
                    })
                }
            }
        })
    }


    /**
     * Generate and display the validation notice of a field
     * 
     * @param {object} field The form field element
     */
    displayValidationError( field ) {
        const { parentElement: fieldWrapper } = field
        const notice = createEl( 'span' );

        notice.classList.add( 'validation' );
        notice.innerHTML = field.validationMessage;
        fieldWrapper.appendChild( notice );

        setTimeout( () => {
            notice.classList.add( 'pop' );
        }, 200 );

        setTimeout( () => {
            this.clearValidationError( field );
        }, 6000 );
    }


    /**
     * Clear the validation notice of a field
     * 
     * @param {object} fieldWrfieldapper The form field element
     */
    clearValidationError( field ) {
        const { parentElement: fieldWrapper } = field
        const notice = fieldWrapper.querySelector( 'span.validation' );
        
        if ( notice ) {
            notice.classList.remove( 'pop' );

            setTimeout( () => {
                fieldWrapper.removeChild( notice );
                field.validateErrorActive = false
            }, 400 );
        }
    }


    /**
     * Send the data to the server for handling
     * 
     * @param {object} e The event
     */
    submit( e ) {
        e.preventDefault()

        this.target.classList.add( 'send-in-progress' )
        this.submitButton.disabled = true
        this.submitButton.innerHTML = 'Sending...'

        let data = new FormData( this.target ),
            xhr = new XMLHttpRequest()
    
        xhr.onload = () => {

            if ( xhr.status >= 200 && xhr.status < 400 ) {
                this.target.classList.remove( 'send-in-progress' )
                this.response = xhr.responseText
                this.displaySubmitMessage( xhr.responseText )

            } else {
                this.displaySubmitMessage( `xhr_error_${xhr.status}` )
            }
        };

        xhr.onerror = () => {
            this.displaySubmitMessage( 'xhr_error' )
        };

        xhr.open( 'POST', shiftr.ajax )
        xhr.send( data )
    }


    /**
     * @param {string} response The responseText from the XMLHttpRequest
     */
    displaySubmitMessage( response = `` ) {

        const message = {
            wrapper: createEl( 'div' ),
            container: createEl( 'div' ),
            heading: createEl( 'span' ),
            content: createEl( 'p' ),
            errorRef: createEl( 'span' ),
            close: createEl( 'button' ),
            copy: {
                heading: ``,
                content: ``
            }
        }

        message.wrapper.classList.add( 'form-submission' );

        const { submitMessageCopy } = this.settings

        // Select corresponding confirmation content
        switch ( response ) {

            // '1' equals true. 
            case '1':
                message.copy.heading = submitMessageCopy.successHeading;
                message.copy.content = submitMessageCopy.successBody;
                break;

            case 'invalid_email_address':
                message.copy.heading = 'Security Issue!';
                message.copy.content = 'The request was blocked because of an invalid email address.';
                break;

            default:
                message.copy.heading = submitMessageCopy.errorHeading;
                message.copy.content = submitMessageCopy.errorBody;
        }


        if ( response.match( /[1-9]{1}_field[s]?_missing/g ) ) {
            message.copy.heading = 'Security Issue!';
            message.copy.content = 'The request was blocked because some fields were missing.';
        }


        message.heading.innerHTML = message.copy.heading;
        message.content.innerHTML = message.copy.content;

        message.close.innerHTML = 'Close';
        message.close.setAttribute( 'id', 'close-submission' );
        message.close.classList.add( 'button' );

        message.container.appendChild( message.heading );
        message.container.appendChild( message.content );

        if ( response != '1' ) {
            message.errorRef.innerHTML = `ERROR REF: ${response}`;
            message.container.appendChild( message.errorRef );
        }
        
        message.wrapper.appendChild( message.container );
        message.wrapper.appendChild( message.close );

        this.target.appendChild( message.wrapper );

        setTimeout( () => {
            message.wrapper.classList.add( 'show' );
            this.submitButton.innerHTML = 'Sent!';
        }, 100 );

        message.close.addEventListener( 'click', e => {
            e.preventDefault();
            clearTimeout( autoClear );
            this.clearSubmitMessage( message.wrapper, response );
        });

        const autoClearDelay = response == `1` ? 8100 : 30000

        var autoClear = setTimeout( () => {
            this.clearSubmitMessage( message.wrapper, response );
        }, autoClearDelay );
    }


    /**
     * @param {object} message The message wrapper element
     * @param {string} response The server response
     */
    clearSubmitMessage( message, response ) {

        if ( response == '1' ) {
            const { success, error } = this.actionClass

            // Empty all fields of values
            for ( var i = 0; i < this.fields.length; i++ ) {

                const field = this.fields[i]
                const { parentElement: fieldWrapper } = field

                if ( field.nodeName === `SELECT` ) {
                    fieldWrapper.classList.remove( success )
                    fieldWrapper.classList.remove( error )
    
                } else if ( field.type != `checkbox` && field.type != `radio` ) {
                    field.value = ``
                    fieldWrapper.classList.remove( success )
                    fieldWrapper.classList.remove( error )

                } else if ( field.type == `checkbox` || field.type == `radio` ) {
                    field.checked = false
                }
            }
        }

        setTimeout( () => {
            message.classList.remove( 'show' );
        }, 100 );
        
        /**
         * Enabling the button again is the very last thing we need to do
         */
        this.submitButton.disabled = false;
        this.submitButton.innerHTML = this.submitButtonOrgLabel;
    }


    /**
     * Request the stylesheet for Form interactions
     */
    getStyles() {
        if ( ! this.cssRequested ) {
            const stylesheet = createEl( 'link' );
            stylesheet.setAttribute( 'rel', 'stylesheet' );
            stylesheet.setAttribute( 'href', `${shiftr.theme}/assets/styles/form.css` );
            stylesheet.setAttribute( 'type', 'text/css' );
            head.appendChild( stylesheet );

            this.cssRequested = true;
        }

        this.submitButton.removeEventListener( 'mouseover', this.getStyles );
    }
}
