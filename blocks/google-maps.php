<?php
/**
 * Block: Google Maps
 * 
 * A Google Maps JavaScript API map.
 */

defined( 'GOOGLE_API_KEY' ) || exit;

/**
 * The `map` field is required, so checks the data is set
 * is not necessary.
 */
$map_data = get_flexi_field( 'map' );

?>
<div id="map"></div>
<script>
    function initMap() {
        var coords = {
            lat: <?php echo $map_data['lat']; ?>, 
            lng: <?php echo $map_data['lng']; ?>
        };

        var map = new google.maps.Map(
            document.getElementById( 'map' ),
            {
                zoom: <?php echo $map_data['zoom']; ?>,
                center: coords
            }
        );

        new google.maps.Marker({ position: coords, map });
    }
</script>
