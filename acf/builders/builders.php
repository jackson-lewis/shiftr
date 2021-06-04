<?php
use Shiftr_ACF\Flexi_Builder;

/**
 * Register all the Flexi Blocks Builders*
 * 
 * * excludes the "Global Blocks" builder as this is auto generated
 */
new Flexi_Builder(
    'main',
    array(), // Gets all blocks in library
    array(
        'wrapper' => array(
            'width' => '',
            'class' => 'hide-label',
            'id' => ''
        )
    )
);
