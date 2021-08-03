<?php

use Shiftr_ACF\Group;
use Shiftr_ACF\Utils;

/**
 * Options - Global Blocks
 */
new Group( 'options_global_blocks', array(
    'title' => 'Global Blocks',
    'fields' => array(
        Shiftr_ACF\Utils\get_global_blocks()
    ),
    'location' => array (
        array (
            array (
                'param' => 'options_page',
                'operator' => '==',
                'value' => 'global-blocks',
            )
        )
    )
));
