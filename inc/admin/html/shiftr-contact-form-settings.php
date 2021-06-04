<?php
/**
 * Shiftr Forms - settings page
 */
?>
<div class="wrap">
    
    <h1>Contact Form Settings</h1>

    <div class="shiftr-box">
        <h2>Default Settings</h2>

        <?php do_action( 'admin_notices' ); ?>

        <form method="post">
            <div class="shiftr-textarea">
                <label>Recepients</label>
                <span>Separate email addresses with a new line</span>
                <textarea name="shiftr_form_default_recepients" rows="4"><?php echo esc_html( get_option( 'shiftr_form_default_recepients' ) ); ?></textarea>
            </div>

            <div class="shiftr-input">
                <label>Subject</label>
                <input type="text" name="shiftr_form_default_subject" value="<?php echo esc_attr( get_option( 'shiftr_form_default_subject' ) ); ?>">
            </div>


            <div class="shiftr-separator"></div>


            <div class="shiftr-subheading">
                <h3>Success Message</h3>
                <span>The message shown when the submission was successful</span>
            </div>

            <div class="shiftr-input">
                <label>Heading</label>
                <input type="text" name="shiftr_form_message_success_heading" value="<?php echo esc_attr( get_option( 'shiftr_form_message_success_heading' ) ); ?>">
            </div>

            <div class="shiftr-input">
                <label>Body</label>
                <input type="text" name="shiftr_form_message_success_body" value="<?php echo esc_attr( get_option( 'shiftr_form_message_success_body' ) ); ?>">
            </div>


            <div class="shiftr-separator"></div>


            <div class="shiftr-subheading">
                <h3>Error Message</h3>
                <span>The message shown when the submission failed</span>
            </div>

            <div class="shiftr-input">
                <label>Heading</label>
                <input type="text" name="shiftr_form_message_error_heading" value="<?php echo esc_attr( get_option( 'shiftr_form_message_error_heading' ) ); ?>">
            </div>

            <div class="shiftr-input">
                <label>Body</label>
                <input type="text" name="shiftr_form_message_error_body" value="<?php echo esc_attr( get_option( 'shiftr_form_message_error_body' ) ); ?>">
            </div>


            <div class="shiftr-submit">
                <?php submit_button(); ?>
            </div>
        </form>
    </div>
</div>  
