
function saveCartAsWishlist() {
  var listName = prompt("Ange ett namn på listan");

  if (listName) {
    var items = {};

    $('.cart-item').each(function() {
      let itemData = {
        name: $(this).find('.cart-item-name-with-warning a').text().trim(),
        id: $(this).find('.cart-item-name-with-warning').siblings('div:not([class])').text(),
        href: $(this).find('.cart-item-name-with-warning a').attr('href'),
        img: $(this).find('img').attr('src'),
        quantity: $(this).find('.cart-item-amount [type=number]').val(),
        price: $(this).find('.cart-item-amount').contents().filter(function() { return this.nodeType === 3; }).text().trim().match(/×.([0-9]*).kr/)[1]
      };

      items[itemData.id] = itemData;
    });

    var newListId = (new Date()).getTime();
    var newList = {};
    newList[newListId] = {
      id: newListId,
      name: listName,
      time: (new Date()).toISOString(),
      items: items
    }

    fetch(
      'https://getpantry.cloud/apiv1/pantry/927f3b9f-0044-4a90-bfde-419e5d55fba4/basket/alphawishpontus',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(newList)
      }
    ).then(function(response) {
      showSavedNotice();
      updateAlphaWishLists();
    });
  }
}

function saveProductToWishlist() {
  var listName = prompt("Välj lista för produkten, lämna tomt för standardlistan");

  if (listName !== null) {
    var wishlist = {};

    listName = listName.trim().length ? listName.trim().toLowerCase() : 'standard'

    let itemData = {
      name: $('h3').text().trim(),
      id: $('.reference').text().trim(),
      href: window.location.href,
      img: $('.product-image-wrapper').find('img').attr('src').replace('300x300', '80x80'),
      quantity: 1,
      price: $('.price').text().trim().match(/([0-9]*).kr/)[1]
    };

    if (typeof window.alphaWishLists[listName] !== 'undefined') {
      wishlist[listName] = window.alphaWishLists[listName];
      wishlist[listName].time = (new Date()).toISOString();
      wishlist[listName].items[itemData.id] = itemData;
    } else {
      var items = {};
      items[itemData.id] = itemData;
      wishlist[listName] = {
        id: listName,
        name: listName,
        time: (new Date()).toISOString(),
        items: items
      }
    }

    fetch(
      'https://getpantry.cloud/apiv1/pantry/927f3b9f-0044-4a90-bfde-419e5d55fba4/basket/alphawishpontus',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(wishlist)
      }
    ).then(function(response) {
      showSavedNotice();
      updateAlphaWishLists();
    });
  }
}

function showSavedNotice() {
  $('.alpha-wish-saved-notice').addClass('active');
  setTimeout(function() {
    $('.alpha-wish-saved-notice').removeClass('active');
  }, 2000)
}

function showDeletedNotice() {
  $('.alpha-wish-deleted-notice').addClass('active');
  setTimeout(function() {
    $('.alpha-wish-deleted-notice').removeClass('active');
  }, 2000)
}

function alphaWishInit() {
  var alphaWishStyles = `
    <style>
        .alpha-wish-modal {
            height: 90vh;
            width: calc(100% - 40px);
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            background-color: #fbfaf7;
            border: 2px solid black;
            border-radius: 5px;
            max-width: 800px;
            display: none;
            padding-bottom: 40px;
            margin-bottom: 70px;
          max-height: calc(100% - 100px);
          overflow: auto;
          z-index: 100000;
        }
        .alpha-wish-modal.active {
          display: block;
        }
        .alpha-wish-list-container table,
        .alpha-wish-list-items-container table {
          width: 100%;
          border-spacing: 0 10px;
          border-collapse: separate;
        }
        .alpha-wish-list-container table td,
        .alpha-wish-list-items-container table td {
          background-color: #ffffff;
        }
        .alpha-wish-list-container,
        .alpha-wish-list-items-container {
          padding: 20px;
          display: none;
        }
        .alpha-wish-list-container.active,
        .alpha-wish-list-items-container.active {
          display: block;
        }
        .alpha-wish-add-list-button,
        .alpha-wish-add-product-button,
        .alpha-wish-close-modal-button,
        .alpha-wish-open-modal-button {
          position: fixed;
          bottom: 10px;
          right: 10px;
          padding: 10px;
          color: white;
          background: #5cb85c;
          border-radius: 5px;
          letter-spacing: 0.5px;
          border: none;
        }
        .alpha-wish-open-modal-button {
          left: 10px;
        }
        .alpha-wish-close-modal-button {
          position: sticky;
          left: calc(100% - 80px);
          bottom: -20px;
          top: 100%;
          background: #3858f5;
        }
        .alpha-wish-saved-notice,
        .alpha-wish-deleted-notice {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          background: #5cb85c;
          width: 100px;
          height: 50px;
          align-items: center;
          justify-content: center;
          border: 2px solid green;
          border-radius: 5px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          letter-spacing: 0.5px;
          box-shadow: 3px 3px 25px #5c5c5c;
          display: none;
          z-index: 100001;
        }
        .alpha-wish-deleted-notice {
          background: red;
          border: 2px solid darkred;
        }
        .alpha-wish-saved-notice.active,
        .alpha-wish-deleted-notice.active {
          display: flex;
        }
        .alpha-wish-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .alpha-wish-list-back {
          padding: 10px;
          color: white;
          background: #3858f5;
          border-radius: 5px;
          letter-spacing: 0.5px;
          border: none;
        }
        .alpha-wish-list-row-delete,
        .alpha-wish-list-items-row-delete {
          padding: 10px;
          color: white;
          background: #ef4141;
          border-radius: 5px;
          letter-spacing: 0.5px;
          border: none;
        }
        .alpha-wish-list-row-show {
          padding: 10px;
          color: white;
          background: #5cb85c;
          border-radius: 5px;
          letter-spacing: 0.5px;
          border: none;
        }
        .alpha-wish-list-items-table td {
          padding: 0 10px;
        }
        .alpha-wish-list-items-table-action-cell {
          text-align: right;
        }
    </style>`;
  var alphaWishModal = $('<div>');
  alphaWishModal.addClass('alpha-wish-modal');
  var closeAlphaWishModalButton = $('<button>');
  closeAlphaWishModalButton.text('Stäng');
  closeAlphaWishModalButton.addClass('alpha-wish-close-modal-button');
  var alphaWishModalListContainer = $('<div>');
  alphaWishModalListContainer.addClass('alpha-wish-list-container active');
  var alphaWishModalListItemsContainer = $('<div>');
  alphaWishModalListItemsContainer.addClass('alpha-wish-list-items-container');
  alphaWishModal.append(alphaWishModalListContainer);
  alphaWishModal.append(alphaWishModalListItemsContainer);
  alphaWishModal.append(closeAlphaWishModalButton);

  var alphaWishDeletedNotice = $('<div>');
  alphaWishDeletedNotice.text('Raderat!');
  alphaWishDeletedNotice.addClass('alpha-wish-deleted-notice');

  var alphaWishSavedNotice = $('<div>');
  alphaWishSavedNotice.text('Sparat!');
  alphaWishSavedNotice.addClass('alpha-wish-saved-notice');

  var openAlphaWishModalButton = $('<button>');
  openAlphaWishModalButton.text('Visa');
  openAlphaWishModalButton.addClass('alpha-wish-open-modal-button');

  var addAlphaWishButton = $('<button>');
  if ($('#checkout.content-bubble').length) {
    addAlphaWishButton.text('Spara varukorg');
    addAlphaWishButton.addClass('alpha-wish-add-list-button');
  } else if ($('.product.content-bubble').length) {
    addAlphaWishButton.text('Spara produkt');
    addAlphaWishButton.addClass('alpha-wish-add-product-button');
  }

  $('body').append(alphaWishModal);
  $('body').append(openAlphaWishModalButton);
  $('body').append(alphaWishSavedNotice);
  $('body').append(alphaWishDeletedNotice);

  if ($('#checkout.content-bubble').length || $('.product.content-bubble').length) {
    $('body').append(addAlphaWishButton);
  }

  $('body').append(alphaWishStyles);

  $(document.body).on('click', '.alpha-wish-close-modal-button', function() {
    $('.alpha-wish-modal').removeClass('active');
  });
  $(document.body).on('click', '.alpha-wish-open-modal-button', function() {
    updateAlphaWishLists();
    $('.alpha-wish-modal').addClass('active');
    $('.alpha-wish-list-container').addClass('active');
    $('.alpha-wish-list-items-container').removeClass('active');
  });
  $(document.body).on('click', '.alpha-wish-add-list-button', function() {
    saveCartAsWishlist();
  });
  $(document.body).on('click', '.alpha-wish-add-product-button', function() {
    saveProductToWishlist();
  });
  $(document.body).on('click', '.alpha-wish-list-row-show', function() {
    var id = $(this).closest('[data-alpha-wish-list-id]').data('alpha-wish-list-id');
    $('.alpha-wish-list-container').removeClass('active');
    $('.alpha-wish-list-items-container').addClass('active');
    updateAlphaWishList(id);
  });
  $(document.body).on('click', '.alpha-wish-list-row-delete', function() {
    var id = $(this).closest('[data-alpha-wish-list-id]').data('alpha-wish-list-id');
    deleteAlphaWishList(id);
  });
  $(document.body).on('click', '.alpha-wish-list-items-row-delete', function() {
    var listId = $(this).closest('[data-alpha-wish-list-id]').data('alpha-wish-list-id');
    var itemId = $(this).closest('[data-alpha-wish-list-item-id]').data('alpha-wish-list-item-id');
    deleteAlphaWishListItem(listId, itemId);
  });
  $(document.body).on('click', '.alpha-wish-list-back', function() {
    $('.alpha-wish-list-container').addClass('active');
    $('.alpha-wish-list-items-container').removeClass('active');
  });

  updateAlphaWishLists();
}

function deleteAlphaWishList(id) {
  if (confirm('Är du säker?')) {
    if (typeof window.alphaWishLists[id] !== 'undefined') {
      delete window.alphaWishLists[id];
      resetAlphaWishListBasketAfterDeletion();
    }
  }
}

function deleteAlphaWishListItem(listId, itemId) {
  if (confirm('Är du säker?')) {
    if (typeof window.alphaWishLists[listId] !== 'undefined' && typeof window.alphaWishLists[listId].items[itemId] !== 'undefined') {
      delete window.alphaWishLists[listId].items[itemId];
      resetAlphaWishListBasketAfterDeletion();
    }
  }
}

function resetAlphaWishListBasketAfterDeletion() {
  fetch(
    'https://getpantry.cloud/apiv1/pantry/927f3b9f-0044-4a90-bfde-419e5d55fba4/basket/alphawishpontus',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(window.alphaWishLists)
    }
  ).then(function(response) {
    showDeletedNotice();
    updateAlphaWishLists();
  });
}

function updateAlphaWishList(listId) {
  var listItemsContainer = $('.alpha-wish-list-items-container');
  listItemsContainer.html('');
  listItemsContainer.append(`
    <div class="alpha-wish-list-header">
      <h4>` + window.alphaWishLists[listId].name + `</h4>
      <button class="alpha-wish-list-back">Tillbaka</button>
    </div>
  `);
  listItemsContainer.append(`
    <table class="alpha-wish-list-items-table" data-alpha-wish-list-id="` + listId + `">
      <tr>
        <th>Bild</th>
        <th>Namn</th>
        <th>Antal</th>
        <th>Pris</th>
        <th></th>
      </tr>
    </table>`
  );
  var listItems = window.alphaWishLists[listId].items;
  for (const item in listItems) {
    var listItemRow = $(`
      <tr data-alpha-wish-list-item-id="` + listItems[item].id + `">
        <td><img src="` + listItems[item].img + `"></td>
        <td>
          <a href="` + listItems[item].href + `" target="_blank">` + listItems[item].name + `</a><br>
          ` + listItems[item].id + `
        </td>
        <td>` + listItems[item].quantity + `</td>
        <td>` + listItems[item].price + `</td>
        <td class="alpha-wish-list-items-table-action-cell"><button class="alpha-wish-list-items-row-delete">Radera</button></td>
      </tr>
    `);
    listItemsContainer.find('table').append(listItemRow);
  }
}

function updateAlphaWishLists() {
  fetch('https://getpantry.cloud/apiv1/pantry/927f3b9f-0044-4a90-bfde-419e5d55fba4/basket/alphawishpontus')
    .then(response => response.json())
    .then(function(response) {
      window.alphaWishLists = response;
      var alphaWishListsArray = Object.values(response);
      alphaWishListsArray.sort((a, b) => a.time < b.time ? 1 : a.time > b.time ? -1 : 0);

      var listContainer = $('.alpha-wish-list-container');
      listContainer.html('');
      listContainer.append(`
        <table>
          <tr>
            <th>Namn</th>
            <th>Datum</th>
            <th>Antal rader</th>
            <th></th>
          </tr>
        </table>`
      );

      for (const list in alphaWishListsArray) {
        var prettyTime = alphaWishListsArray[list].time.match(/(.*)T(..:..:..)/)[1] + ' ' + alphaWishListsArray[list].time.match(/(.*)T(..:..:..)/)[2];
        var listRow = $(`
          <tr data-alpha-wish-list-id="` + alphaWishListsArray[list].id + `">
            <td>` + alphaWishListsArray[list].name + `</td>
            <td>` + prettyTime + `</td>
            <td>` + Object.keys(alphaWishListsArray[list].items).length + `</td>
            <td><button class="alpha-wish-list-row-delete">Radera</button></td>
            <td><button class="alpha-wish-list-row-show">Visa</button></td>
          </tr>
        `);
        listRow.addClass('alpha-wish-list-row');
        listContainer.find('table').append(listRow);
      }

      if (
        $('.product.content-bubble').length &&
        typeof window.alphaWishAddProductOnLoad !== 'undefined' &&
        window.alphaWishAddProductOnLoad === 1
      ) {
        saveProductToWishlist();
        window.alphaWishAddProductOnLoad = 0;
      } else if ($('.alpha-wish-list-items-container [data-alpha-wish-list-id]').length) {
        var listId = $('.alpha-wish-list-items-container [data-alpha-wish-list-id]').data('alpha-wish-list-id');
        updateAlphaWishList(listId);
      }
    });
}

$(document).ready(function(){
  alphaWishInit();
});