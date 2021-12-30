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
        return 'form'
    }

    defaultSettings() {
        return {
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

        this.fields = this.target.querySelectorAll( 'input:not([type="hidden"]):not([type="submit"]), textarea, select' )
        this.submitButton = this.target.querySelector( '[type="submit"]' )
        this.submitButtonOrgLabel = this.submitButton.innerHTML

        this.actionClass = this.settings.validationClasses
    }


    /**
     * Set up event listeners to all components of the form
     */
    init() {
        this.fieldEvents()
        this.submitButton.addEventListener( 'mouseover', this.getStyles.bind( this ) );
        this.target.addEventListener( 'submit', this.submit.bind( this ) )
    }


    /**
     * 
     */
    fieldEvents() {

        const { focus, success, error } = this.actionClass

        this.fields.forEach( field => {

            const { parentElement: fieldWrapper } = field
            field.validateErrorActive = false

            if ( field.nodeName === 'SELECT' ) {
                field.addEventListener( 'change', () => {
                    fieldWrapper.classList.add( success )
                })

            } else {
                if ( field.type != 'checkbox' && field.type != 'radio' ) {
                    
                    field.addEventListener( 'focus', () => {
                        this.getStyles()
                        fieldWrapper.classList.add( focus )
                    })
    
                    field.addEventListener( 'blur', () => {
                        fieldWrapper.classList.remove( focus, success, error )
    
                        if ( this.settings.validate && field.value != '' ) {
    
                            if ( field.checkValidity() ) {
                                fieldWrapper.classList.add( success )
                                this.clearValidationError( field )
    
                            } else  {
                                fieldWrapper.classList.add( error )
                            }
                        }
                    })

                } else if ( field.type == 'checkbox' || field.type == 'radio' ) {

                    if ( this.settings.validate ) {
                        field.addEventListener( 'change', () => {
        
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
        const notice = createEl( 'span' )

        notice.classList.add( 'validation' )
        notice.innerHTML = field.validationMessage
        fieldWrapper.appendChild( notice )

        setTimeout( () => {
            notice.classList.add( 'is-visible' )
        }, 200 )

        setTimeout( () => {
            this.clearValidationError( field )
        }, 6000 )
    }


    /**
     * Clear the validation notice of a field
     * 
     * @param {object} fieldWrfieldapper The form field element
     */
    clearValidationError( field ) {
        const { parentElement: fieldWrapper } = field
        const notice = fieldWrapper.querySelector( 'span.validation' )
        
        if ( notice ) {
            notice.classList.remove( 'is-visible' )

            setTimeout( () => {
                fieldWrapper.removeChild( notice )
                field.validateErrorActive = false
            }, 400 )
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

        fetch( shiftr.ajaxUrl, {
            method: 'post',
            body: new FormData( this.target )
        })
            .then( res => res.json() )
            .then( data => {
                this.target.classList.remove( 'send-in-progress' )
                this.response = data
                this.displaySubmitMessage( data )
            })
            .catch( error => {
                console.log( error )
            })
    }


    /**
     * @param {string} data The body of the response
     */
    displaySubmitMessage( data = '' ) {
        const formSubmitOutput = this.target.querySelector( '.form-submit-output' )

        formSubmitOutput.innerHTML = `
            <p class="${ data.success ? 'success' : 'error' }">${ data.message }</p>
        `

        /**
         * Support for Google Tag Manager tracking
         */
        if ( data.success ) {
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                'event': 'formSubmission',
                'form': this.target.dataset.shiftrForm
            })
        }

        setTimeout( () => {
            formSubmitOutput.classList.add( 'is-visible' )

            if ( data.success ) {
                this.submitButton.innerHTML = 'Sent!'
            } else {
                this.submitButton.disabled = false
                this.submitButton.innerHTML = this.submitButtonOrgLabel
            }
        }, 100 )

        const autoClearDelay = data.success ? 8100 : 30000

        var autoClear = setTimeout( () => {
            this.clearSubmitMessage( data )
        }, autoClearDelay )
    }


    /**
     * @param {object} message The message wrapper element
     * @param {string} data The server response
     */
    clearSubmitMessage( data ) {

        if ( data.success ) {
            const { success, error } = this.actionClass

            this.target.reset()

            // Empty all fields of values
            for ( var i = 0; i < this.fields.length; i++ ) {
                const field = this.fields[i]

                if ( field.nodeName === 'SELECT' || ( field.type != 'checkbox' && field.type != 'radio' ) ) {
                    field.parentElement.classList.remove( success, error )
                }
            }
        }

        setTimeout( () => {
            this.target.querySelector( '.form-submit-output' ).classList.remove( 'is-visible' )
        }, 100 )
        
        /**
         * Enabling the button again is the very last thing we need to do
         */
        this.submitButton.disabled = false
        this.submitButton.innerHTML = this.submitButtonOrgLabel
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
