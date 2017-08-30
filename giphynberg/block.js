( function( blocks, i18n, element, components, $, _ ) {
	var el = element.createElement;
	var __ = i18n.__;
	var GIPHY_API_KEY = '3d128764d40343e19c52aceecafad2e5';

	blocks.registerBlockType( 'giphynberg/giphy', {
		title: __( 'Giphy', 'giphynberg' ),
		icon: 'format-image',
		category: 'embed',
		attributes: {
			url: {
				type: 'string',
			}
		},
		edit: function( props ) {
			var results = [];
			var attributes = props.attributes;

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

				$.getJSON( 'https://api.giphy.com/v1/gifs/search?api_key=' + GIPHY_API_KEY + '&q=' + encodeURI( search ) + '&limit=10&offset=0&rating=G&lang=en' )
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

			if ( ! attributes.url ) {
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

				return components.Placeholder( {
					className: 'giphynberg__placeholder',
					icon: 'format-image',
					label: 'Search for the perfect GIF!',
					children: [
						el( 'input', {
							type: 'text',
							key: 'search-field',
							placeholder: 'Enter Search Term Here',
							onChange: function( event ) {
								fetchGiphyResults( event.target.value );
							}
						} ),
						el( 'ul', {
							className: 'giphynberg__results',
							key: 'results'
						}, results )
					]
				} );
			} else {
				return el( 'img', { src: attributes.url } );
			}
		},
		save: function( props ) {
			if ( props.attributes.url ) {
				return el( 'img', { src: props.attributes.url } );
			}
		},
	} );
} )(
	window.wp.blocks,
	window.wp.i18n,
	window.wp.element,
	window.wp.components,
	jQuery,
	_
);
