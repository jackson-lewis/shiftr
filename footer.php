        <footer class="site-footer">
            <div class="site-footer__main">
                <div class="container">
                    <div class="site-footer__col">
                        <address class="contact-details">
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
                    <div class="site-footer__col">
                        <span class="site-footer__col-heading"><?php echo wp_get_nav_menu_name( 'footer-1' ); ?></span>
                        <?php shiftr_nav_footer_1(); ?>
                    </div>
                    <div class="site-footer__col">
                        <span class="site-footer__col-heading"><?php echo wp_get_nav_menu_name( 'footer-2' ); ?></span>
                        <?php shiftr_nav_footer_2(); ?>
                    </div>
                </div>
            </div>
            <div class="site-footer__legal">
                <div class="container">
                    <small>&copy; <?php echo date( 'Y' ); ?></small>
                </div>
            </div>
        </footer>

        <div id="overlay" aria-hidden="true"></div>

        <?php wp_footer(); ?>
        
    </body>
    
</html>