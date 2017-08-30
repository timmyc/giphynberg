<?php

defined( 'ABSPATH' ) || exit;

add_action( 'enqueue_block_editor_assets', 'giphynberg_enqueue_block_editor_assets' );

function giphynberg_enqueue_block_editor_assets() {
	wp_enqueue_script(
		'giphynberg',
		plugins_url( 'block.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'block.js' )
	);

	wp_enqueue_style(
		'giphynberg',
		plugins_url( 'editor.css', __FILE__ ),
		array( 'wp-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
	);
}
