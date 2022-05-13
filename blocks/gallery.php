<?php
/**
 * Block: Image Gallery
 * 
 * Display an image gallery powered by Glide.js
 * 
 * @var array $settings The Block settings.
 */
$images = get_flexi_field( 'images' );

?>
<div class="container">
    <?php shiftr_block_heading(); ?>
    <?php if ( $images ) : ?>
        <div class="glide" data-infinite-loop="<?php echo $settings['infinite_loop'] ? 'true' : 'false'; ?>">
            <div class="glide__track" data-glide-el="track">
                <ul class="glide__slides">
                    <?php foreach ( $images as $image ) : ?>
                        <li class="glide__slide">
                            <div class="image"><?php shiftr_image( $image ); ?></div>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <div class="glide__arrows" data-glide-el="controls">
                <button class="glide__arrow glide__arrow--left" data-glide-dir="<">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                        <path d="M14.71 6.71c-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z"/>
                    </svg>
                </button>
                <button class="glide__arrow glide__arrow--right" data-glide-dir=">">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                        <path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"/>
                    </svg>
                </button>
            </div>
            <?php if ( $settings['display_bullets'] ) : ?>
                <div class="glide__bullets" data-glide-el="controls[nav]">
                    <?php for ( $i = 0; $i < count( $images ); $i++ ) : ?>
                        <button class="glide__bullet" data-glide-dir="=<?php echo $i; ?>"></button>
                        <?php endfor; ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    <?php shiftr_block_after(); ?>
</div>
