$(document).ready(function() {
  $('#trends-table').DataTable( {
    'paging': false,
    'ajax': '../data/trends-2015.json',
    'columns': [
    { data: 'name' },
    { data: 'undernourished' },
    { data: 'stunting' },
    { data: 'wasting' },
    { data: 'mortality' },
    { data: 'score' }
    ]
  } );
} );

