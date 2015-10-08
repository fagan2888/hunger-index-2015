$(document).ready(function() {
  var table = $('#trends-table').DataTable( {
    'ajax': '../data/trends-2015.json',
    'columns': [
      { data: 'name' },
      { data: 'undernourished' },
      { data: 'stunting' },
      { data: 'wasting' },
      { data: 'mortality' },
      { data: 'zone' },
      { data: 'score' }
    ],
    // hide zone column
    'columnDefs': [ {'targets': [5], 'visible': false} ],
    "dom": '<"trends-toolbar">frtip',
    'paging': false,
    'info': false
  } );

  $("div.trends-toolbar").html('<label for="year">Year</label> <select name="year" id="year"> <option value="2015" selected>2015</option> <option value="2005">2005</option> <option value="2000">2000</option> <option value="1995">1995</option> <option value="1990">1990</option> </select> <label for="zone">Zone</label> <select name="zone" id="zone"> <option value="all" selected>All countries</option> <option value="MENA">Near East and North Africa</option> <option value="WAF">West Africa</option> <option value="CSAF">Central and Southern Africa</option> <option value="EAF">East Africa</option> <option value="SA">South America</option> <option value="CAR">Central America and the Caribbean</option> <option value="SEA">South, East and Southeast Asia</option> <option value="EEFSU">Eastern Europe and the Commonwealth of Independent States</option> </select>');

  $("div.trends-toolbar #year option").click( function () { 
    var year = this.value; 
    table.ajax.url('../data/trends-' + year + '.json').load();
  });

  $("div.trends-toolbar #zone option").click( function () { 
    var zone = this.value; 
    table.column(5).search(zone).draw()

  });


} );


/*

<label for="year">Year</label>
<select name="year" id="year">
  <option value="2015" selected>2015</option> 
  <option value="2005">2005</option>
  <option value="2000">2000</option>
  <option value="1995">1995</option>
  <option value="1990">1990</option>
</select>

<label for="zone">Zone</label>
<select name="zone" id="zone">
  <option value="all" selected>All countries</option> 
  <option value="MENA">Near East and North Africa</option>
  <option value="WAF">West Africa</option>
  <option value="CSAF">Central and Southern Africa</option>
  <option value="EAF">East Africa</option>
  <option value="SA">South America</option>
  <option value="CAR">Central America and the Caribbean</option>
  <option value="SEA">South, East and Southeast Asia</option>
  <option value="EEFSU">Eastern Europe and the Commonwealth of Independent States</option>
</select>








*/