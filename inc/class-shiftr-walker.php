<?php

/**  
 *  Shiftr_Nav_Walker
 *
 *  The Shiftr walker for the primary navigation
 *
 *  @since 1.0
 */

class Shiftr_Nav_Walker extends Walker_Nav_menu {

    function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

    }


    function start_lvl( &$output, $depth = 0, $args = array() ) {

    }
}


/**  
 *  Shiftr_Nav_Primary_Walker
 *
 *  The Shiftr walker for the primary navigation
 *
 *  @since 1.0
 */


class Shiftr_Nav_Primary_Walker extends Shiftr_Nav_Walker {

    function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

        global $post;

        $name = $item->title;
        $permalink = $item->url;

        if ( is_home() ) {
            $post_slug = get_post_type_archive_link( 'post' );

        } else if ( is_front_page() ) {
            $post_slug = get_bloginfo( 'url' ) . '/';

        } else {
            $post_slug = get_permalink( $post );
        }

        $item->classes = array();

        $item->classes[] = 'menu-item-' . $item->ID;
        $item->classes[] = "level-{$depth}-item";

        if ( $post_slug == $permalink ) {
             $item->classes[] = 'current-page';
        }

        // If the menu item holds a sub-menu, define as parent
        if ( $args->walker->has_children ) {
            $item->classes[] = 'has-sub-menu';

            $sub_menu_name = sanitize_title( $name );
        }

        $output .= '<li class="' . join( ' ', $item->classes ) . '">';
        $output .= "<a href=\"{$permalink}\">";
        $output .= $name;
        $output .= '</a>';
        $output .= ( $args->walker->has_children ) ? "<button id=\"menu-item-control--{$item->ID}\"></button>" : '';
    }


    function start_lvl( &$output, $depth = 0, $args = array() ) {

        $indent = str_repeat( "\t", $depth );
        $output .= "\n$indent<ul class=\"sub-menu\">";
    }
}


/**  
 *  Shiftr_Nav_Footer_Walker
 *
 *  The Shiftr walker for the footer navigation
 *
 *  @since 1.0
 */


class Shiftr_Nav_Footer_Walker extends Shiftr_Nav_Walker {

    function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

        global $post;

        $name = $item->title;
        $permalink = $item->url;

        $item->classes = array();

        $item->classes[] = 'menu-item-' . $item->ID;
        $item->classes[] = "level-{$depth}-item";

        $output .= '<li class="' . join( ' ', $item->classes ) . '">';
        $output .= "<a href=\"{$permalink}\">";
        $output .= $name;
        $output .= '</a>';
    }
}

