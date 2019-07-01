<?php


/**  
 *  shiftr_handle_bulk_actions
 *
 *  Filter bulk_actions on a custom post type
 *
 *  @since 1.0
 *
 *	@param $actions array The actions available in bulk actions
 *	@return array The actions
 */

function shiftr_handle_bulk_actions( $actions ) {

	unset( $actions['edit'] );
	unset( $actions['trash'] );

	return $actions;
}

add_filter( 'bulk_actions-edit-post_name', 'shiftr_handle_bulk_actions' );


/**  
 *  shiftr_handle_post_actions
 *
 *  Filter post_row_actions on a custom post type
 *
 *  @since 1.0
 *
 *	@param $actions array The actions available on a post
  *	@param $post object Global $post object
 *	@return array The actions
 */

function shiftr_handle_post_actions( $actions, $post ) {

	if ( $post->post_type == 'post_name' ) {
		unset( $actions['inline hide-if-no-js'] );
		unset( $actions['trash'] );
	}

	return $actions;
}

add_filter( 'post_row_actions', 'shiftr_handle_post_actions', 10, 2 );


/**  
 *  shiftr_handle_date_filter
 *
 *  Filter months_dropdown_results on a custom post type
 *
 *  @since 1.0
 *
 *	@param $months array The months
  *	@param $post_type str The post type name
 *	@return array The actions
 */

function shiftr_handle_date_filter( $months, $post_type ) {

	if ( $post_type == 'post_name' ) {
		$months = array();

		return $months; 

	} else {
		return $months;
	}
}

add_filter( 'months_dropdown_results', 'shiftr_handle_date_filter', 10, 2 );

