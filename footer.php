        <footer class="site-footer">
            <div class="footer-row--main">
                <div class="container">
                    <div class="footer-col" rianimate="fade-right">
                        <?php shiftr_inline_svg( 'shiftr-full', '/assets/_shiftr/' ); ?>
                        <address class="contact-details">
                            <?php

                            echo do_shortcode( '[phone_link]' );
                            echo '<br />';
                            echo do_shortcode( '[email_link]' );
                            printf( '<p>%s</p>', shiftr()->address );

                            ?>
                        </address>
                    </div>
                    <div class="footer-col">
                        <span class="footer-heading"><?php echo wp_get_nav_menu_name( 'footer-1' ); ?></span>
                        <?php shiftr_nav_footer_1(); ?>
                    </div>
                    <div class="footer-col">
                        <span class="footer-heading"><?php echo wp_get_nav_menu_name( 'footer-2' ); ?></span>
                        <?php shiftr_nav_footer_2(); ?>
                    </div>
                </div>
            </div>
            <div class="footer-row--legal">
                <div class="container">
                    <small>&copy; <?php echo date( 'Y' ); ?></small>
                </div>
            </div>
        </footer>

        <div id="overlay" aria-hidden="true"></div>

        <?php wp_footer(); ?>
        
    </body>
    
</html>