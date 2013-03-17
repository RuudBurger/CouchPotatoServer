from .main import BinSearch

def start():
    return BinSearch()

config = [{
    'name': 'binsearch',
    'groups': [
        {
            'tab': 'searcher',
            'subtab': 'providers',
            'list': 'nzb_providers',
            'name': 'binsearch',
            'description': 'Free provider, less accurate. See <a href="https://www.binsearch.info/">BinSearch</a>',
            'wizard': True,
            'options': [
                {
                    'name': 'enabled',
                    'type': 'enabler',
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
