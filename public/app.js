// Grab the reviews as a json
$.getJSON('/api/reviews', function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $('#reviews').append(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        '<br />' +
        data[i].link +
        '</p>'
    );
  }
});

// Whenever someone clicks a p tag
$(document).on('click', 'p', function() {
  // Empty the comments from the comment section
  $('#commentForm').empty();
  $('#comments').empty();
  // Save the id from the p tag
  var thisId = $(this).attr('data-id');

  // Now make an ajax call for the review
  $.ajax({
    method: 'GET',
    url: 'api/reviews/' + thisId
  })
    // With that done, add the comment information to the page
    .then(function(data) {
      const existingComments = data.comments;
      $('#comments').append(
        existingComments.map(comment => {
          return `<h4> ${comment.name}</h4><h5> ${comment.body}</h5>`;
        })
      );

      // The title of the review
      $('#comments').append('<h2>' + data.title + '</h2>');
      // An input to enter a new title
      $('#comments').append("<input id='nameinput' name='name' >");
      // A textarea to add a new comment body
      $('#comments').append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new comment, with the id of the review saved to it
      $('#comments').append(
        "<button data-id='" +
          data._id +
          "' id='savecomment'>Save comment</button>"
      );
    });
});

// When you click the savecomment button
$(document).on('click', '#savecomment', function() {
  // Grab the id associated with the review from the submit button
  var thisId = $(this).attr('data-id');
  var dataObj = {
    // Value taken from title input
    name: $('#nameinput').val(),
    // Value taken from comment textarea
    body: $('#bodyinput').val()
  };

  console.log(thisId);
  console.log(dataObj);

  // Run a POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: 'POST',
    url: 'api/reviews/' + thisId,
    data: dataObj
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the comments section
      $('#comments').empty();
    });

  // Also, remove the values entered in the input and textarea for comment entry
  $('#nameinput').val('');
  $('#bodyinput').val('');
});
