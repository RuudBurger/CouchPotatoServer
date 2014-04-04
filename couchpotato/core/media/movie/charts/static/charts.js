var Charts = new Class({

	Implements: [Options, Events],

	initialize: function(options){
		var self = this;
		self.setOptions(options);

		self.create();
	},

	create: function(){
		var self = this;

		self.el_refreshing_text = new Element('span.refreshing', {'text': 'Refreshing charts...'});
		self.el_refresh_link = new Element('a.refresh', { 'href': '#', 'text': 'Refresh charts', 'events': { 'click': function(e) {
			e.preventDefault();
			self.el.getChildren('div.chart').destroy();
			self.el_refreshing_text.show();
			self.el_refresh_link.hide();
			self.api_request = Api.request('charts.view', {
				'data': { 'force_update': 1 },
				'onComplete': self.fill.bind(self)
			});
		}}}).hide();
		self.el_refresh_container = new Element('div.refresh').grab( self.el_refreshing_text ).grab( self.el_refresh_link );
		self.el_no_charts_enabled = new Element('p.no_charts_enabled', {
			'html':'Hey, it looks like you have no charts enabled at the moment. If you\'d like some great movie suggestions you can go to <a href="' + App.createUrl('settings/display') + '">settings</a> and turn on some charts of your choice.'
		}).hide();

		self.el = new Element('div.charts').grab(self.el_no_charts_enabled).grab( self.el_refresh_container );

		if( Cookie.read('suggestions_charts_menu_selected') === 'charts') self.el.show(); else self.el.hide();

		self.api_request = Api.request('charts.view', {
			'onComplete': self.fill.bind(self)
		});

	},

	fill: function(json){

		var self = this;

		self.el_refreshing_text.hide();
		self.el_refresh_link.show();

		if(!json || json.count == 0){
			self.el_no_charts_enabled.show();
		    self.el_refresh_link.show();
		    self.el_refreshing_text.hide();
		}
		else
		{
			self.el_no_charts_enabled.hide();

		    json.charts.sort(function(a, b) {
				return a.order - b.order;
			});

			Object.each(json.charts, function(chart){

				var c = new Element('div.chart').grab(
					new Element('h3').grab( new Element('a', {
						'text': chart.name,
						'href': chart.url
					}))
				);

				var it = 1;

				Object.each(chart.list, function(movie){

					var m = new Block.Search.MovieItem(movie, {
						'onAdded': function(){
							self.afterAdded(m, movie)
						}
					});
					var in_database_class = movie.in_wanted ? '.chart_in_wanted' : (movie.in_library ? '.chart_in_library' : '');
					var in_database_title = movie.in_wanted ? 'Movie in wanted list' : (movie.in_library ? 'Movie in library' : '');
					m.el.grab( new Element('div.chart_number' + in_database_class, { 'text': it++, 'title': in_database_title }));
					m.data_container.grab(
						new Element('div.actions').adopt(
							new Element('a.add.icon2', {
								'title': 'Add movie with your default quality',
								'data-add': movie.imdb,
								'events': {
									'click': m.showOptions.bind(m)
								}
							}),
							$(new MA.IMDB(m)),
							$(new MA.Trailer(m, {
								'height': 150
							}))
						)
					);
					m.data_container.removeEvents('click');

					var plot = false;
					if(m.info.plot && m.info.plot.length > 0)
						plot = m.info.plot;

					// Add rating
					m.info_container.adopt(
						m.rating = m.info.rating && m.info.rating.imdb && m.info.rating.imdb.length == 2 && parseFloat(m.info.rating.imdb[0]) > 0  ? new Element('span.rating', {
							'text': parseFloat(m.info.rating.imdb[0]),
							'title': parseInt(m.info.rating.imdb[1]) + ' votes'
						}) : null,
						m.genre = m.info.genres && m.info.genres.length > 0 ? new Element('span.genres', {
							'text': m.info.genres.slice(0, 3).join(', ')
						}) : null,
						m.plot = plot ? new Element('span.plot', {
							'text': plot,
							'events': {
								'click': function(){
									this.toggleClass('full')
								}
							}
						}) : null
					)

					$(m).inject(c);

				});

				$(c).inject(self.el_refresh_container, 'before');

			});

		}

		self.fireEvent('loaded');

	},

	afterAdded: function(m, movie){
		var self = this;

		$(m).getElement('div.chart_number').addClass('chart_in_wanted').setProperty('title','Movie in wanted list');


	},

	toElement: function(){
		return this.el;
	}

})
