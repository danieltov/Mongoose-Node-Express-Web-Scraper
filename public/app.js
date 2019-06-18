$(() => {
  // ! === RENDER FUNCTIONS ===

  const renderReviewCard = dbReview => {
    // Create elements
    const $col = $('<div>').addClass('col s12 m3');
    const $card = $('<div>').addClass('card');
    const $cardImage = $('<div>').addClass('card-image');
    const $img = $('<img>').attr('src', dbReview.image);
    const $title = $('<span>')
      .addClass('card-title')
      .html(`${dbReview.artist}: <em>${dbReview.title}</em>`);
    const $button = $('<a>')
      .addClass(
        'btn-floating halfway-fab waves-effect waves-light cyan modal-trigger'
      )
      .attr({ href: '#comments', 'data-id': dbReview._id }).html(`<i
                class="material-icons">add</i></a>`);
    const $cardAction = $('<div>').addClass('card-action');
    const $link = $('<a>')
      .attr({
        href: dbReview.link,
        target: '_blank'
      })
      .text('Read Full Review');

    // Build card
    $cardAction.append($link);
    $cardImage.append($img, $title, $button);
    $card.append($cardImage, $cardAction);
    $col.append($card);

    return $('#reviews').append($col);
  };

  const renderComments = dbComment => {
    const $col = $('<div>').addClass('col s12');
    const $card = $('<div>').addClass('card-panel grey lighten-5 z-depth-1');
    const $cardRow = $('<div>').addClass('row valign-wrapper');
    const $cardCol1 = $('<div>').addClass('col s2');
    const $commentImg = $('<img>')
      .addClass('circle responsive-img')
      .attr('src', `https://source.unsplash.com/random/500x500?beard`);
    const $cardCol2 = $('<div>').addClass('col s10');
    const $commentName = $('<p>')
      .addClass('black-text')
      .text(dbComment.name);
    const $commentBody = $('<p>')
      .addClass('black-text')
      .text(dbComment.body);

    // Build comment
    $cardCol2.append($commentName, $commentBody);
    $cardCol1.append($commentImg);
    $cardRow.append($cardCol1, $cardCol2);
    $card.append($cardRow);
    $col.append($card);

    return $('#populateComments').append($col);
  };

  // ! === API CALLS ===

  const getReviews = () => {
    $.getJSON('/api/reviews', data => {
      console.log(data);
      data.forEach(dbReview => renderReviewCard(dbReview));
    });
  };

  const getComments = id => {
    $.ajax({
      method: 'GET',
      url: 'api/reviews/' + id
    }).then(data => {
      const existingComments = data.comments;
      existingComments.forEach(dbComment => renderComments(dbComment));
    });
  };

  $(document).on('click', 'a.modal-trigger', event => {
    $('#populateComments').empty();
    const thisId = event.currentTarget.dataset.id;
    getComments(thisId);
    $('#addComment').attr('data-id', thisId);
  });

  $(document).on('click', '#addComment', function(event) {
    event.preventDefault();
    const thisId = $('#addComment').attr('data-id');
    const dataObj = {
      name: $('#commentName').val(),
      body: $('#commentBody').val()
    };

    $.ajax({
      method: 'POST',
      url: 'api/reviews/' + thisId,
      data: dataObj
    }).then(function(data) {
      $('#populateComments').empty();
      getComments(data._id);
    });

    // Also, remove the values entered in the input and textarea for comment entry
    $('#commentName').val('');
    $('#commentBody').val('');
  });

  // Activat modal
  $('.modal').modal();
  getReviews();
});
