$(document).ready(function() {
  $('.change-announcement').click(function(){
    var description = $(this).data('description');
    var poster = $(this).data('poster');
   $('#changingDescription').html(description);
   $('#changingPoster').html("Posted by:" + poster);
  });
});
</script>

<script>
$(document).ready(function() {
  var items = $("#content > button")
  var numItems = items.length;
  var perPage = 8
  var multiplier = 1
  items.slice(perPage).hide();
  $('.next').click(function(){
    if ((multiplier+1)*perPage <= numItems + perPage-1){
      items.hide();
      items.slice(perPage*multiplier,perPage*(multiplier+1)).show();
      multiplier++;
    }
  });
  $('.previous').click(function(){
    if (multiplier-1 >0){
      multiplier--;
      items.hide();
      items.slice(perPage*(multiplier-1),perPage*multiplier).show();
    }
  });
  });
