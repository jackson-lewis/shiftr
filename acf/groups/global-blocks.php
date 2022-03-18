<?php

use Shiftr_ACF\Group;
use Shiftr_ACF\Utils;

/**
 * Options - Global Blocks
 */
new Group(
    'options_global_blocks',
    [
        'title'     => 'Global Blocks',
        'fields'    => [
            Shiftr_ACF\Utils\get_global_blocks()
        ],
        'location'  => [
            [
                [
                    'param'     => 'options_page',
                    'operator'  => '==',
                    'value'     => 'global-blocks'
                ]
            ]
        ]
    ]
);
