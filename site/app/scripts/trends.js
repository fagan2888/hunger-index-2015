$(document).ready(function() {
  var table = $('#trends-table').DataTable( {
    'paging': false,
    'ajax': '../data/trends-2015.json',
    'columns': [
    { data: 'name' },
    { data: 'undernourished' },
    { data: 'stunting' },
    { data: 'wasting' },
    { data: 'mortality' },
    { data: 'score' }
    ],
    "dom": '<"trends-toolbar">frtip'
  } );

  $("div.trends-toolbar").html('<label for="year">Year</label> <select name="year" id="year"> <option value="2015" selected>2015</option> <option value="2005">2005</option> <option value="2000">2000</option> <option value="1995">1995</option> <option value="1990">1990</option> </select>');

  $("div.trends-toolbar #year option").click( function () { 
    var year = this.value; 
    table.ajax.url('../data/trends-' + year + '.json').load();
  });


} );


/*
<label for="year">Year</label> <select name="year" id="year"> <option value="2015" selected>2015</option> <option value="2005">2005</option> <option value="2000">2000</option> <option value="1995">1995</option> <option value="1990">1990</option> </select>

<label for="year">Year</label>
<select name="year" id="year">
  <option value="2015" selected>2015</option> 
  <option value="2005">2005</option>
  <option value="2000">2000</option>
  <option value="1995">1995</option>
  <option value="1990">1990</option>
</select>

*/
