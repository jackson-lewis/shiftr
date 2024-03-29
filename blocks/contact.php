<?php
/**
 * Block: Contact
 * 
 * Display contact details along with a basic contact form.
 * 
 * @var array $settings The block settings.
 */
?>
<div class="container grid-medium">
    <div class="contact-details">
        <?php shiftr_block_heading(); ?>
        <address>
            <?php

            echo do_shortcode( '[phone_link]' );
            echo '<br />';
            echo do_shortcode( '[email_link]' );

            if ( shiftr()->address ) {
                printf( '<p>%s</p>', shiftr()->address );
            }

            shiftr_social_media_links();

            ?>
        </address>
    </div>
    <?php shiftr_form_general(); ?>
</div>
