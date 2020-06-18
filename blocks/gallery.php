<?php
/**
 * Gallery block
 * 
 * A sliding carousel of single images.
 * 
 * Glide.js (https://glidejs.com/) powers this gallery, "A dependency-free
 * JavaScript ES6 slider and carousel. It’s lightweight, flexible and fast.
 * Designed to slide."
 * 
 * @var array $images The attachment ID's of images to make up the gallery.
 */
?>
<?php shiftr_flexi_block_heading(); ?>

<div class="gallery glide">
    <?php
    /**
     * This container is used to calculate the current width of the
     * container, so that we can automatically update the primary width
     * of the slider via the update() method on the Glide instance
     */
    ?>
    <div class="container"></div>
    <div class="gallery-row glide__track" data-glide-el="track">
        <ul class="glide__slides">
            <?php // The next line must have no spaces in the html, so there is no gap between the inline-block elements. ?>
            <?php foreach ( $images as $image ) : ?><li class="glide__slide gallery--item"><div class="image"><?php shiftr_image( $image ); ?></div></li><?php endforeach; ?>
        </ul>
        <div class="glide__arrows" data-glide-el="controls">
            <button class="arrow--prev glide__arrow glide__arrow--prev" data-glide-dir="<">Left</button>
            <button class="arrow--next glide__arrow glide__arrow--next" data-glide-dir=">">Right</button>
        </div>
    </div>
</div>

<?php shiftr_flexi_block_after(); ?>
