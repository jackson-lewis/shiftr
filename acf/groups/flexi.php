<?php

use Shiftr_ACF\Utils as Utils;
use Shiftr_ACF\Group;
use Shiftr_ACF\Flexi_Builder;

/**
 * Flexi Blocks Builder - main
 */
new Group(
    'flexi_main',
    [
        'title'     => 'Flexi Blocks Builder',
        'fields'    => [
            Utils\get_builder( 'main' )
        ],
        'location'  => [
            [
                [
                    'param'     => 'page_template',
                    'operator'  => '==',
                    'value'     => 'templates/flexi-blocks-builder.php',
                ]
            ]
        ]
    ]
);
