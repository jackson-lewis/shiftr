( function() {

    /*  ////  --|    Shiftr Editor Extension
        * Just some magic
    */




    //  ////  --|    Email inline shortcode

    tinymce.create( "tinymce.plugins.email_link_plugin", {

        //url argument holds the absolute url of our plugin directory
        init : function( ed, url ) {

            //add new button     
            ed.addButton( "email", {
                title : "Add email link", 
                cmd : "email_link",
                image : shiftr.theme + '/assets/icons/admin--email.svg'
            });

            //button functionality.
            ed.addCommand( "email_link", function() {
                ed.execCommand( "mceInsertContent", 0, "[email_link]" );
            });

            ed.addShortcut( "Command+Shift+E", "Add the email link", "email_link" );

        },

        createControl : function( n, cm ) {
            return null;
        },

        getInfo : function() {
            return {
                longname : "Extra Buttons",
                author : "Narayan Prusty",
                version : "1"
            };
        }
    });

    tinymce.PluginManager.add( "email_link_plugin", tinymce.plugins.email_link_plugin );
    



    //  ////  --|    Phone inline shortcode

    tinymce.create( "tinymce.plugins.phone_link_plugin", {

        //url argument holds the absolute url of our plugin directory
        init : function( ed, url ) {

            //add new button     
            ed.addButton( "phone", {
                title : "Add phone link", 
                cmd : "phone_link",
                image : shiftr.theme + '/assets/icons/admin--phone.svg'
            });

            //button functionality.
            ed.addCommand( "phone_link", function() {
                ed.execCommand( "mceInsertContent", 0, "[phone_link]" );
            });

            ed.addShortcut( "Command+Shift+E", "Add the phone link", "phone_link" );

        },

        createControl : function( n, cm ) {
            return null;
        },

        getInfo : function() {
            return {
                longname : "Extra Buttons",
                author : "Narayan Prusty",
                version : "1"
            };
        }
    });

    tinymce.PluginManager.add( "phone_link_plugin", tinymce.plugins.phone_link_plugin );

})();
