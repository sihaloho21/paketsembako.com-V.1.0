const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Ganti dengan ID Google Spreadsheet Anda

/**
 * Fungsi utama untuk menangani request GET.
 */
function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'getProducts':
        result = getProducts(e.parameter);
        break;
      case 'getProduct':
        result = getProductById(e.parameter.id);
        break;
      case 'getCategories':
        result = getCategories();
        break;
      case 'getCart':
        result = getCart(e.parameter.userId);
        break;
      default:
        return createErrorResponse('Invalid action: ' + action, 400);
    }
    return createJsonResponse(result);
  } catch (error) {
    return createErrorResponse(error.message, 500);
  }
}

/**
 * Fungsi utama untuk menangani request POST.
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    let result;

    switch (action) {
      case 'saveCart':
        result = saveCart(postData.userId, postData.cart);
        break;
      default:
        return createErrorResponse('Invalid action: ' + action, 400);
    }
    return createJsonResponse(result);
  } catch (error) {
    return createErrorResponse(error.message, 500);
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message, statusCode) {
  const error = { error: message, statusCode: statusCode };
  return ContentService.createTextOutput(JSON.stringify(error))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
  }
  return sheet;
}

function getProducts(params) {
  const productHeaders = [
    'id', 'name', 'price', 'originalPrice', 'discountPercent', 'imageUrl', 'images', 
    'categoryId', 'categoryName', 'rating', 'reviewCount', 'sold', 'badge', 
    'isPromo', 'description', 'shelfLife', 'deliveryInfo', 'variants'
  ];
  const sheet = getOrCreateSheet('Products', productHeaders);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const products = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const product = {};
    for (let j = 0; j < headers.length; j++) {
      let value = row[j];
      if (['id', 'price', 'originalPrice', 'discountPercent', 'categoryId', 'reviewCount', 'sold'].includes(headers[j])) {
        value = parseInt(value);
      } else if (headers[j] === 'rating') {
        value = parseFloat(value);
      } else if (headers[j] === 'isPromo') {
        value = String(value).toLowerCase() === 'true';
      } else if (['images', 'variants'].includes(headers[j])) {
        try { value = JSON.parse(value); } catch (e) { value = []; }
      }
      product[headers[j]] = value;
    }
    products.push(product);
  }

  let filteredProducts = products;
  if (params.categoryId) filteredProducts = filteredProducts.filter(p => p.categoryId === parseInt(params.categoryId));
  if (params.isPromo) filteredProducts = filteredProducts.filter(p => p.isPromo === (String(params.isPromo).toLowerCase() === 'true'));
  if (params.isTrending) filteredProducts.sort((a, b) => b.sold - a.sold);

  if (params.sort) {
    if (params.sort === 'harga-asc') filteredProducts.sort((a, b) => a.price - b.price);
    else if (params.sort === 'harga-desc') filteredProducts.sort((a, b) => b.price - a.price);
    else if (params.sort === 'terbaru') filteredProducts.sort((a, b) => b.id - a.id);
    else if (params.sort === 'teratas') filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  if (params.limit) filteredProducts = filteredProducts.slice(0, parseInt(params.limit));
  return filteredProducts;
}

function getProductById(id) {
  const products = getProducts({});
  const product = products.find(p => p.id === parseInt(id));
  if (!product) throw new Error('Product not found with ID: ' + id);
  return product;
}

function getCategories() {
  const categoryHeaders = ['id', 'name', 'productCount', 'imageUrl'];
  const sheet = getOrCreateSheet('Categories', categoryHeaders);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const categories = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const category = {};
    for (let j = 0; j < headers.length; j++) {
      let value = row[j];
      if (['id', 'productCount'].includes(headers[j])) value = parseInt(value);
      category[headers[j]] = value;
    }
    categories.push(category);
  }
  return categories;
}

/**
 * Mendapatkan data keranjang untuk user tertentu.
 */
function getCart(userId) {
  const cartHeaders = ['userId', 'cartData', 'updatedAt'];
  const sheet = getOrCreateSheet('Carts', cartHeaders);
  const data = sheet.getDataRange().getValues();
  data.shift(); // Remove header

  const userRow = data.find(row => row[0] === userId);
  if (userRow) {
    return JSON.parse(userRow[1]);
  }
  return { items: [], totalItems: 0, totalPrice: 0 };
}

/**
 * Menyimpan data keranjang untuk user tertentu.
 */
function saveCart(userId, cart) {
  const cartHeaders = ['userId', 'cartData', 'updatedAt'];
  const sheet = getOrCreateSheet('Carts', cartHeaders);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const userRowIndex = data.findIndex(row => row[0] === userId);
  const now = new Date();
  const cartJson = JSON.stringify(cart);

  if (userRowIndex > -1) {
    // Update existing row (row index is 0-based from data, so add 2 for 1-based sheet row)
    sheet.getRange(userRowIndex + 2, 2).setValue(cartJson);
    sheet.getRange(userRowIndex + 2, 3).setValue(now);
  } else {
    // Append new row
    sheet.appendRow([userId, cartJson, now]);
  }
  return { success: true, cart: cart };
}

function setupInitialSheets() {
  getOrCreateSheet('Products', ['id', 'name', 'price', 'originalPrice', 'discountPercent', 'imageUrl', 'images', 'categoryId', 'categoryName', 'rating', 'reviewCount', 'sold', 'badge', 'isPromo', 'description', 'shelfLife', 'deliveryInfo', 'variants']);
  getOrCreateSheet('Categories', ['id', 'name', 'productCount', 'imageUrl']);
  getOrCreateSheet('Carts', ['userId', 'cartData', 'updatedAt']);
}
