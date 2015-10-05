$(document).ready(function() {
  $('#trends-table').DataTable( {
    // 'scrollY': '500px',
    // 'scrollCollapse': true,
    'ajax': '../data/table_data.json',
    'columns': [
    { 'data': 'name' },
    { 'data': 'score' }
    ]
  } );
} );

