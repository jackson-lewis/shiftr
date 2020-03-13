<?php

// This file should not be executed,
// contains the default flexi blocks template

    exit;
?>


<?php
        
if ( have_rows( 'blocks' ) ) :

    while ( have_rows( 'blocks' ) ) : the_row();

        $block = get_row_layout();

        $atts = array( 'class' => 'site-section block--' . $block );

        $settings = get_sub_field( 'settings' ) ? get_sub_field( 'settings' ) : array();


        foreach ( $settings as $setting => $value ) {

            if ( $setting == 'id' ) {
                $atts['id'] = $value;

            } else if ( is_bool( $value ) ) {
                $atts['class'] .= $value ? " {$setting}" : '';
                
            } else {
                $atts['class'] .= " {$setting}-{$value}";
            }                    
        }


        echo '<section ' . shiftr_output_attr( $atts ) . '>';


        switch ( $block ) :

            case 'content':
?>


<div class="container">
    <div class="content">
        <?php the_sub_field( 'content' ); ?>
    </div>
</div>


<?php
    break;

    case 'content_image':
?>


<div class="container">
    <div class="content">
        <?php the_sub_field( 'content' ); ?>
    </div>
    <div class="image">
        <?php shiftr_image(); ?>
    </div>
</div>


<?php
    break;

    case 'block_3':
?>


<div class="container">

</div>


<?php
    break;

    case 'block_4':
?>


<div class="container">

</div>


<?php
    break;

    case 'block_5':
?>


<div class="container">

</div>
    

<?php
            break;

        endswitch;

        echo "</section>\n";

    endwhile;
endif;

?>

