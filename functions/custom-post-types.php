<?php

	/*  ////  --|    Register any Custom Post Types

        * Find icons at: https://developer.wordpress.org/resource/dashicons

        * Pages menu item is position 20

        * The following seperator is position 59

    */




$shiftr_post_type_sample = new Shiftr_Custom_Post_Type(
    array(

        // The plural label of the post type,
        // singular/plurals automatically handled
        'name'          => 'New Events',

        // Where the link should appear in the menu order
        'menu_position' => 21,

        // The icon to accompany the menu item
        'menu_icon'     => 'dashicons-calendar-alt'
    ),
    array(

        // The slug prepended on single posts
        'rewrite' => array( 'slug' => 'events' ),

        // The slug to the archive
        'has_archive' => 'our-events'
    )
);

