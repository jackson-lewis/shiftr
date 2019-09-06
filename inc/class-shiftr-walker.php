<?php

/**  
 *  Shiftr_Walker
 *
 *  The Shiftr walker for the primary navigation
 *
 *  @since 1.0
 */

class Shiftr_Walker extends Walker_Nav_menu {

    function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

    }


    function start_lvl( &$output, $depth = 0, $args = array() ) {

    }
}


/**  
 *  Shiftr_Primary_Walker
 *
 *  The Shiftr walker for the primary navigation
 *
 *  @since 1.0
 */


class Shiftr_Primary_Walker extends Shiftr_Walker {

    function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

        $name = $item->title;
        $permalink = $item->url;

        global $post;


        if ( is_home() ) {
            $post_slug = get_post_type_archive_link( 'post' );

        } else if ( is_front_page() ) {
            $post_slug = get_bloginfo( 'url' ) . '/';

        } else {
            $post_slug = get_permalink( $post );
        }

        $item->classes = $anchor_attr = array();


        $item->classes[] = 'menu-item-' . $item->ID;
    
        if ( $post_slug == $permalink ) {
            $anchor_attr['class'] = 'active'; 
        }

        if ( $depth == 0 ) {
            $item->classes[] = 'top-item';
        } else if ( $depth == 1 ) {
            $item->classes[] = 'secondary-item';
        } else if ( $depth == 2 ) {
            $item->classes[] = 'third-item';
        }

        // If the menu item holds a sub-menu, define as parent
        if ( $args->walker->has_children ) {
            $item->classes[] = 'parent';
            $item->classes[] = space_to_( strtolower( $name ) );
        }

        $output .= '<li class="' . join( ' ', $item->classes ) . '">';

        $output .= '<a ';
        $output .= 'href="' . $permalink . '" ';
        $output .= shiftr_output_attr( $anchor_attr );
        $output .= '>';

        // Actually add the menu item text
        $output .= $name;

        $output .= '</a>';
    }


    function start_lvl( &$output, $depth = 0, $args = array() ) {

        $indent = str_repeat( "\t", $depth );
        $output .= "\n$indent<ul class=\"sub-menu\">";
    }
}


/**  
 *  Shiftr_Footer_Walker
 *
 *  The Shiftr walker for the footer navigation
 *
 *  @since 1.0
 */


class Shiftr_Footer_Walker extends Shiftr_Walker {

    function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

        $name = $item->title;
        $permalink = $item->url;

        global $post;


        if ( is_home() ) {
            $post_slug = get_post_type_archive_link( 'post' );

        } else if ( is_front_page() ) {
            $post_slug = get_bloginfo( 'url' ) . '/';

        } else {
            $post_slug = get_permalink( $post );
        }

        $item->classes = $anchor_attr = array();


        $item->classes[] = 'menu-item-' . $item->ID;
    
        if ( $post_slug == $permalink ) {
            $anchor_attr['class'] = 'active'; 
        }

        if ( $depth == 0 ) {
            $item->classes[] = 'top-item';
        } else if ( $depth == 1 ) {
            $item->classes[] = 'secondary-item';
        }

        // If the menu item holds a sub-menu, define as parent
        if ( $args->walker->has_children ) {
            $item->classes[] = 'parent';
            $item->classes[] = space_to_( strtolower( $name ) );
        }

        $output .= '<li class="' . join( ' ', $item->classes ) . '">';

        if ( $item->type != 'custom' ) {
            $output .= '<a ';
            $output .= 'href="' . $permalink . '" ';
            $output .= shiftr_output_attr( $anchor_attr );

            // Handle external links like we know what we're doing
            if ( stripos( $permalink, get_bloginfo( 'url' ) ) === false ) {
                $output .= ' target="_blank" rel="noopener"';
            }

            $output .= '>';
        } else {

            // Keep menu item in tabindex
            $output .= '<span tabindex="0" ';
            $output .= shiftr_output_attr( $anchor_attr );
            $output .= '>';
        }

        // Actually add the menu item text
        $output .= $name;


        if ( $item->type != 'custom' ) {
            $output .= '</a>';
        } else {
            $output .= '</span>';
        }
    }


    function start_lvl( &$output, $depth = 0, $args = array() ) {

        $indent = str_repeat( "\t", $depth );
        $output .= "\n$indent<ul class=\"sub-menu\">";
    }
}

