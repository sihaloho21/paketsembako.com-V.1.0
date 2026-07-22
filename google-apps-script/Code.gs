const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Ganti dengan ID Google Spreadsheet Anda

/**
 * Fungsi utama untuk menangani request GET.
 * @param {Object} e - Objek event dari request GET.
 * @returns {GoogleAppsScript.Content.TextOutput} Output JSON.
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
      default:
        return createErrorResponse('Invalid action: ' + action, 400);
    }
    return createJsonResponse(result);
  } catch (error) {
    return createErrorResponse(error.message, 500);
  }
}

/**
 * Membuat response JSON.
 * @param {Object} data - Data yang akan di-return.
 * @returns {GoogleAppsScript.Content.TextOutput} Output JSON.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Membuat response error JSON.
 * @param {string} message - Pesan error.
 * @param {number} statusCode - Kode status HTTP.
 * @returns {GoogleAppsScript.Content.TextOutput} Output JSON error.
 */
function createErrorResponse(message, statusCode) {
  const error = { error: message, statusCode: statusCode };
  return ContentService.createTextOutput(JSON.stringify(error))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Mendapatkan atau membuat sheet berdasarkan nama dan header.
 * @param {string} sheetName - Nama sheet.
 * @param {Array<string>} headers - Array header kolom.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} Objek sheet.
 */
function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    Logger.log(`Sheet '${sheetName}' created with headers: ${headers.join(', ')}`);
  } else {
    // Cek apakah header sudah sesuai
    const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (JSON.stringify(existingHeaders) !== JSON.stringify(headers)) {
      Logger.log(`Headers for sheet '${sheetName}' are different. Updating headers.`);
      sheet.clearContents(); // Clear existing content
      sheet.appendRow(headers); // Write new headers
    }
  }
  return sheet;
}

/**
 * Mengambil semua produk dari sheet 'Products'.
 * Mendukung filter categoryId, sort, isPromo, isTrending, limit.
 * @param {Object} params - Parameter filter dari request.
 * @returns {Array<Object>} Array objek produk.
 */
function getProducts(params) {
  const productHeaders = [
    'id', 'name', 'price', 'originalPrice', 'discountPercent', 'imageUrl', 'images', 
    'categoryId', 'categoryName', 'rating', 'reviewCount', 'sold', 'badge', 
    'isPromo', 'description', 'shelfLife', 'deliveryInfo', 'variants'
  ];
  const sheet = getOrCreateSheet('Products', productHeaders);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Baris pertama adalah header
  const products = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const product = {};
    for (let j = 0; j < headers.length; j++) {
      let value = row[j];
      // Konversi tipe data dari string/number di spreadsheet ke tipe yang sesuai
      if (headers[j] === 'id' || headers[j] === 'price' || headers[j] === 'originalPrice' ||
          headers[j] === 'discountPercent' || headers[j] === 'categoryId' ||
          headers[j] === 'reviewCount' || headers[j] === 'sold') {
        value = parseInt(value);
      } else if (headers[j] === 'rating') {
        value = parseFloat(value);
      } else if (headers[j] === 'isPromo') {
        value = String(value).toLowerCase() === 'true';
      } else if (headers[j] === 'images' || headers[j] === 'variants') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = []; // Default ke array kosong jika parsing gagal
        }
      }
      product[headers[j]] = value;
    }
    products.push(product);
  }

  // Apply filters
  let filteredProducts = products;

  if (params.categoryId) {
    const categoryId = parseInt(params.categoryId);
    filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
  }
  if (params.isPromo) {
    filteredProducts = filteredProducts.filter(p => p.isPromo === (String(params.isPromo).toLowerCase() === 'true'));
  }
  // Untuk isTrending, kita bisa asumsikan produk dengan 'sold' tertinggi atau rating tertinggi
  if (params.isTrending) {
    filteredProducts = filteredProducts.sort((a, b) => b.sold - a.sold);
  }

  // Apply sorting
  if (params.sort) {
    switch (params.sort) {
      case 'harga-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'harga-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'terbaru':
        // Asumsi ada kolom 'createdAt' atau 'id' yang bisa digunakan untuk sorting terbaru
        // Untuk saat ini, kita bisa sort berdasarkan ID tertinggi sebagai proxy
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      case 'teratas':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // No specific sort
        break;
    }
  }

  // Apply limit
  if (params.limit) {
    const limit = parseInt(params.limit);
    filteredProducts = filteredProducts.slice(0, limit);
  }

  return filteredProducts;
}

/**
 * Mengambil detail produk berdasarkan ID dari sheet 'Products'.
 * @param {string} id - ID produk.
 * @returns {Object} Objek produk.
 */
function getProductById(id) {
  const products = getProducts({}); // Ambil semua produk tanpa filter awal
  const productId = parseInt(id);
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found with ID: ' + id);
  }
  return product;
}

/**
 * Mengambil semua kategori dari sheet 'Categories'.
 * @returns {Array<Object>} Array objek kategori.
 */
function getCategories() {
  const categoryHeaders = ['id', 'name', 'productCount', 'imageUrl'];
  const sheet = getOrCreateSheet('Categories', categoryHeaders);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Baris pertama adalah header
  const categories = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const category = {};
    for (let j = 0; j < headers.length; j++) {
      let value = row[j];
      if (headers[j] === 'id' || headers[j] === 'productCount') {
        value = parseInt(value);
      }
      category[headers[j]] = value;
    }
    categories.push(category);
  }
  return categories;
}

// Fungsi ini akan dijalankan saat Web App di-deploy atau dibuka pertama kali
function setupInitialSheets() {
  const productHeaders = [
    'id', 'name', 'price', 'originalPrice', 'discountPercent', 'imageUrl', 'images', 
    'categoryId', 'categoryName', 'rating', 'reviewCount', 'sold', 'badge', 
    'isPromo', 'description', 'shelfLife', 'deliveryInfo', 'variants'
  ];
  getOrCreateSheet('Products', productHeaders);

  const categoryHeaders = ['id', 'name', 'productCount', 'imageUrl'];
  getOrCreateSheet('Categories', categoryHeaders);
}

// Panggil setupInitialSheets() saat script di-deploy atau di-update
// Ini akan memastikan sheet dan header ada saat pertama kali digunakan
// Anda bisa memanggilnya secara manual sekali setelah deployment awal jika diperlukan
// atau menambahkannya ke fungsi onOpen() jika ingin dijalankan setiap kali spreadsheet dibuka
// function onOpen() {
//   setupInitialSheets();
// }
