<?php

    // Get $shiftr class

    global $shiftr;

?>


<!DOCTYPE html>

<html <?php language_attributes(); ?>>
    
    <head>
        <?php shiftr_head_open(); ?>
        
        
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="theme-color" content="<?php $shiftr->the( 'primary_color' ); ?>"> 
        
        <link rel="icon" type="image/png" href="<?php shiftr_get_asset( 'sr@32.png', '_shiftr' ); ?>" sizes="32x32">
        <link rel="apple-touch-icon" href="<?php bloginfo( 'template_directory' ); ?>/assets/media/_shiftr/sr@128.png" />  

        <?php wp_head(); ?>

    </head>
    
    <body <?php shiftr_body_class(); ?>>
        <?php wp_body_open(); ?>

        <header class="header-primary">
            <div>

                <a href="<?php bloginfo( 'url' ); ?>" class="logo">
                    <?php shiftr_inline_svg( 'shiftr-full', '/assets/media/_shiftr/' ); ?>
                </a>

                <?php shiftr_main_nav(); ?>

                <div class="toggle">
                    <span class="before"></span>
                    <span class="before"></span>
                    <span class="after"></span>
                    <span class="after"></span>
                </div>
                
            </div>
        </header>