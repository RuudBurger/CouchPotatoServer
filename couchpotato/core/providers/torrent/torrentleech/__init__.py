from .main import TorrentLeech

def start():
    return TorrentLeech()

config = [{
    'name': 'torrentleech',
    'groups': [
        {
            'tab': 'searcher',
            'subtab': 'providers',
            'list': 'torrent_providers',
            'name': 'TorrentLeech',
            'description': 'See <a href="http://torrentleech.org">TorrentLeech</a>',
            'wizard': True,
            'options': [
                {
                    'name': 'enabled',
                    'type': 'enabler',
                    'default': False,
                },
                {
                    'name': 'username',
                    'default': '',
                },
                {
                    'name': 'password',
                    'default': '',
                    'type': 'password',
                },
                {
                    'name': 'extra_score',
                    'advanced': True,
                    'label': 'Extra Score',
                    'default': '',
                    'description': 'Adds an extra score for each provided download.',
                }
            ],
        },
    ],
}]
