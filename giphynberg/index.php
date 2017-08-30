<?php

defined( 'ABSPATH' ) || exit;

add_action( 'enqueue_block_editor_assets', 'giphynberg_enqueue_block_editor_assets' );

function giphynberg_enqueue_block_editor_assets() {
	$options = get_option( 'giphynberg_settings' );
	wp_enqueue_script(
		'giphynberg',
		plugins_url( 'block.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'block.js' )
	);

	wp_add_inline_script(
		'giphynberg',
		sprintf(
			'
				_giphynberg_giphy_api_key = %1$s;',
			wp_json_encode( $options['giphy_api_key'] )
		),
		'before'
	);

	wp_enqueue_style(
		'giphynberg',
		plugins_url( 'editor.css', __FILE__ ),
		array( 'wp-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
	);
}

// Settings Page.
add_action( 'admin_menu', 'giphynberg_add_admin_menu' );
add_action( 'admin_init', 'giphynberg_settings_init' );


function giphynberg_add_admin_menu(  ) { 
	add_submenu_page( 'tools.php', 'Giphynberg', 'Giphynberg', 'manage_options', 'giphynberg', 'giphynberg_options_page' );
}


function giphynberg_settings_init(  ) { 
	register_setting( 'pluginPage', 'giphynberg_settings' );

	add_settings_section(
		'giphynberg_pluginPage_section', 
		__( 'Configure Giphynberg', 'giphynberg' ), 
		'giphynberg_settings_section_callback', 
		'pluginPage'
	);

	add_settings_field( 
		'giphynberg_giphy_api_key', 
		__( 'Giphy API Key', 'giphynberg' ), 
		'giphynberg_giphy_api_key_render', 
		'pluginPage', 
		'giphynberg_pluginPage_section' 
	);
}

function giphynberg_giphy_api_key_render(  ) { 
	$options = get_option( 'giphynberg_settings' );
	?>
	<input type='text' name='giphynberg_settings[giphy_api_key]' value='<?php echo $options['giphy_api_key']; ?>'>
	<?php
}


function giphynberg_settings_section_callback(  ) { 
	echo __( 'To get an API key for Giphy, please visit <a href="https://developers.giphy.com/dashboard/?create=true" target="_blank">the Giphy Developers Page</a>.', 'giphynberg' );
}


function giphynberg_options_page(  ) { 
	?>
	<form action='options.php' method='post'>
		<?php
		settings_fields( 'pluginPage' );
		do_settings_sections( 'pluginPage' );
		submit_button();
		?>

	</form>
	<?php
}