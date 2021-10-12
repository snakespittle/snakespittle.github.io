
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

    fetch('https://getpantry.cloud/apiv1/pantry/927f3b9f-0044-4a90-bfde-419e5d55fba4/basket/alphawishviktor', {method: 'POST', headers: { 'Content-Type': 'application/json;charset=utf-8' }, body: JSON.stringify(newList)}).then(response => console.log(response));
  }
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
          z-index: 100;
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
        .alpha-wish-close-modal-button,
        .alpha-wish-open-modal-button {
          position: fixed;
          bottom: 10px;
          right: 10px;
          padding: 10px;
        }
        .alpha-wish-open-modal-button {
          left: 10px;
        }
        .alpha-wish-close-modal-button {
          position: sticky;
          left: calc(100% - 80px);
          bottom: -20px;
            top: 100%;
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

  var openAlphaWishModalButton = $('<button>');
  openAlphaWishModalButton.text('Visa');
  openAlphaWishModalButton.addClass('alpha-wish-open-modal-button');

  var addAlphaWishButton = $('<button>');
  addAlphaWishButton.text('Spara');
  addAlphaWishButton.addClass('alpha-wish-add-list-button');

  $('body').append(alphaWishModal);
  $('body').append(openAlphaWishModalButton);
  $('body').append(addAlphaWishButton);
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
  $(document.body).on('click', '.alpha-wish-list-row-show', function() {
    var id = $(this).closest('[data-alpha-wish-list-id]').data('alpha-wish-list-id');
    $('.alpha-wish-list-container').removeClass('active');
    $('.alpha-wish-list-items-container').addClass('active');
    updateAlphaWishList(id);
  });
  $(document.body).on('click', '.alpha-wish-list-row-hide', function() {
    $('.alpha-wish-list-container').addClass('active');
    $('.alpha-wish-list-items-container').removeClass('active');
  });
}

function updateAlphaWishList(id) {
  var listItemsContainer = $('.alpha-wish-list-items-container');
  listItemsContainer.html('');
  listItemsContainer.append(`
    <table>
      <tr>
        <th>Bild</th>
        <th>Namn</th>
        <th>Antal</th>
        <th>Pris</th>
      </tr>
    </table>`
  );
  var listItems = window.alphaWishLists[id].items;
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
      </tr>
    `);
    listItemsContainer.find('table').append(listItemRow);
  }
}

function updateAlphaWishLists() {
  fetch('https://getpantry.cloud/apiv1/pantry/927f3b9f-0044-4a90-bfde-419e5d55fba4/basket/alphawishviktor')
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
        var listRow = $(`
          <tr data-alpha-wish-list-id="` + alphaWishListsArray[list].id + `">
            <td>` + alphaWishListsArray[list].name + `</td>
            <td>` + alphaWishListsArray[list].time + `</td>
            <td>` + Object.keys(alphaWishListsArray[list].items).length + `</td>
            <td><button class="alpha-wish-list-row-show">Visa</button></td>
          </tr>
        `);
        listRow.addClass('alpha-wish-list-row');
        listContainer.find('table').append(listRow);
      }
    });
}

$(document).ready(function(){
  alphaWishInit();
});