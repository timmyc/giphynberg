( function( blocks, i18n, element, components, $, _, giphy_api_key ) {
	var el = element.createElement;
	var __ = i18n.__;
	var GIPHY_API_KEY = giphy_api_key;

	var giphySearchUrl = 'https://api.giphy.com/v1/gifs/search?api_key=' + GIPHY_API_KEY + '&limit=10&offset=0&rating=G&lang=en&q='

	blocks.registerBlockType( 'giphynberg/giphy', {
		title: __( 'Giphy', 'giphynberg' ),
		icon: 'format-image',
		category: 'embed',
		attributes: {
			url: {
				type: 'string',
			}
		},
		
		// This method is what renders the block in editor.
		edit: function( props ) {
			var results = [];
			var attributes = props.attributes;
			var loading;

			var setSelectedGiphy = function( value ) {
				props.setAttributes( {
					url: value.images.original.url
				} );
			};

			var fetchGiphyResults = _.debounce( function( search ) {
				if ( attributes.fetching ) {
					return;
				}

				props.setAttributes( {
					fetching: true,
				} );

				$.getJSON( giphySearchUrl + encodeURI( search ) )
					.success( function( data ) {
						props.setAttributes( {
							fetching: false,
							matches: data.data
						} );
					} )
					.fail( function() {
						props.setAttributes( { fetching: false } );
					} );
			}, 1000 );

			// If there is no url set, show the search form.
			if ( ! attributes.url ) {

				// If there are results, create thumbnails to select from.
				if ( attributes.matches && attributes.matches.length ) {
					results = _.map( attributes.matches, function( item ) {
						return el( 'li', {
								key: item.id,
								onClick: function(){
									setSelectedGiphy.apply( this, [ item ] );
								}
							},
							el( 'img', {
								key: item.id + '-img',
								src: item.images.fixed_height_small.url,
							} )
						)
					} );
				};

				// If there is a giphy request happening, lets show a spinner.
				if ( ! results.length && attributes.fetching ) {
					results = el( 'li', { key: 'loading' },
						components.Spinner( { key: 'loading' } )
					);
				}

				return components.Placeholder( {
					className: 'giphynberg__placeholder',
					icon: 'format-image',
					label: __( 'Search for the perfect GIF!', 'giphynberg' ),
					children: [
						el( 'input', {
							type: 'text',
							key: 'search-field',
							placeholder: __( 'Enter Search Term Here', 'giphynberg' ),
							onChange: function( event ) {
								fetchGiphyResults( event.target.value );
							},
							onKeyUp: function( event ) {
								// If the esc key is pressed, clear out the field and matches.
								if ( event.keyCode === 27 ) {
									event.target.value = '';
									props.setAttributes( {
										matches: []
									} );
								}
							}
						} ),
						el( 'div', {
							className: 'giphynberg__results',
							key: 'results-wrapper'
							},
								el( 'ul', {
									key: 'results'
								}, results )
						)
					]
				} );
			} else {

				// If a url is set, show the giphy gif.
				return el( 'img', { src: attributes.url } );
			}
		},

		// This generates what is persisted in `post_content`.
		save: function( props ) {
			if ( props.attributes.url ) {
				return el( 'article', {},
					el( 'img', { src: props.attributes.url } )
				);
			}
		},
	} );
} )(
	window.wp.blocks,
	window.wp.i18n,
	window.wp.element,
	window.wp.components,
	jQuery,
	_,
	window._giphynberg_giphy_api_key
);
