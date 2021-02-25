<?php

    global $shiftr;

?>


<!DOCTYPE html>

<html <?php language_attributes(); ?>>
    
    <head>
        <?php shiftr_head_open(); ?>
        
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="theme-color" content="<?php $shiftr->the( 'primary_color' ); ?>"> 
        
        <link rel="icon" type="image/png" href="<?php shiftr_get_asset_url( 'sr@32.png', '_shiftr' ); ?>" sizes="32x32">
        <link rel="apple-touch-icon" href="<?php shiftr_get_asset_url( 'sr@128.png', '_shiftr' ); ?>" />
        <script>document.documentElement.classList.add('js');</script>

        <?php wp_head(); ?>
    </head>
    
    <body <?php shiftr_body_class(); ?>>
        <?php wp_body_open(); ?>

        <header class="site-header">
            <div class="container">

                <a href="<?= home_url(); ?>" class="site-logo" aria-label="<?php echo bloginfo( 'name' ); ?> home">
                    <?php shiftr_inline_svg( 'shiftr-full', '/assets/_shiftr/' ); ?>
                </a>

                <button class="nav-primary--toggle" aria-label="Toggle navigation">
                    <span class="before" aria-hidden="true"></span>
                    <span class="before" aria-hidden="true"></span>
                    <span class="after" aria-hidden="true"></span>
                    <span class="after" aria-hidden="true"></span>
                </button>

                <div class="header--offset-contents">
                    <?php shiftr_nav_primary(); ?>
                </div>
                
            </div>
        </header>