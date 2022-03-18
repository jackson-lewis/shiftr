<?php
use Shiftr_ACF\Flexi_Builder;

/**
 * Register all the Flexi Blocks Builders*
 * 
 * * excludes the "Global Blocks" builder as this is auto generated
 */
new Flexi_Builder(
    'main',
    [], // Gets all blocks in library
    [
        'wrapper' => [
            'width' => '',
            'class' => 'hide-label',
            'id'    => ''
        ]
    ]
);
