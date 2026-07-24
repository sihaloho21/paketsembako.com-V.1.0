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
      case 'getUser':
        result = getUser(e.parameter.id);
        break;
      case 'getAvailableVouchers':
        result = getAvailableVouchers();
        break;
      case 'getUserVouchers':
        result = getUserVouchers(e.parameter.userId);
        break;
      case 'getPointsHistory':
        result = getPointsHistory(e.parameter.userId);
        break;
      case 'initializeUser':
        result = initializeUser(e.parameter.id, e.parameter.name, e.parameter.email);
        break;
      default:
        return createErrorResponse('Invalid action: ' + action, 400);
    }
    return createJsonResponse(result);
  } catch (error) {
    logError(action, error);
    return createErrorResponse(error.message, 500);
  }
}

/**
 * Fungsi utama untuk menangani request POST.
 * @param {Object} e - Objek event dari request POST.
 * @returns {GoogleAppsScript.Content.TextOutput} Output JSON.
 */
function doPost(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'redeemVoucher':
        const payload = JSON.parse(e.postData.contents);
        result = redeemVoucher(payload.userId, payload.voucherId);
        break;
      case 'updateUserXP':
        const xpPayload = JSON.parse(e.postData.contents);
        result = updateUserXP(xpPayload.userId, xpPayload.xpToAdd);
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

/**
 * Mengambil profil user berdasarkan ID dari sheet 'Users'.
 * @param {string} id - ID user.
 * @returns {Object} Objek user.
 */
function getUser(id) {
  if (!id) {
    throw new Error('User ID is required');
  }
  
  const userHeaders = ['id', 'name', 'email', 'points', 'xp', 'level', 'avatarUrl'];
  const sheet = getOrCreateSheet('Users', userHeaders);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (String(row[0]) === String(id)) {
      const user = {};
      for (let j = 0; j < headers.length; j++) {
        let value = row[j];
        if (headers[j] === 'points' || headers[j] === 'xp') {
          value = parseInt(value) || 0;
        }
        user[headers[j]] = value;
      }
      return user;
    }
  }
  
  throw new Error('User not found with ID: ' + id);
}

/**
 * Inisialisasi user baru atau cek apakah user sudah terdaftar.
 * @param {string} id - ID user.
 * @param {string} name - Nama user.
 * @param {string} email - Email user.
 * @returns {Object} Hasil inisialisasi.
 */
function initializeUser(id, name, email) {
  if (!id) {
    throw new Error('User ID is required');
  }
  
  const userHeaders = ['id', 'name', 'email', 'points', 'xp', 'level', 'avatarUrl'];
  const sheet = getOrCreateSheet('Users', userHeaders);
  const data = sheet.getDataRange().getValues();
  
  // Cek apakah user sudah ada
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      // User sudah ada, return data yang ada
      return {
        success: true,
        isNew: false,
        message: 'User already exists',
        userId: id
      };
    }
  }
  
  // User baru, tambahkan ke sheet
  const now = new Date();
  sheet.appendRow([
    id,
    name || 'User',
    email || '',
    0,      // points
    0,      // xp
    'Benih', // level
    ''      // avatarUrl
  ]);
  
  logAction('USER_REGISTERED', id, 'New user registered: ' + (name || id));
  
  return {
    success: true,
    isNew: true,
    message: 'User registered successfully',
    userId: id
  };
}

/**
 * Mengambil semua voucher yang tersedia dari sheet 'Vouchers'.
 * @returns {Array<Object>} Array objek voucher.
 */
function getAvailableVouchers() {
  const voucherHeaders = ['id', 'type', 'title', 'points', 'value', 'expiryDays', 'color', 'description'];
  const sheet = getOrCreateSheet('Vouchers', voucherHeaders);
  
  // Cek apakah sheet kosong (hanya ada header)
  if (sheet.getLastRow() <= 1) {
    seedDummyVouchers(sheet);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const vouchers = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const voucher = {};
    for (let j = 0; j < headers.length; j++) {
      let value = row[j];
      if (headers[j] === 'id' || headers[j] === 'points' || headers[j] === 'expiryDays') {
        value = parseInt(value);
      }
      voucher[headers[j]] = value;
    }
    vouchers.push(voucher);
  }
  
  return vouchers;
}

/**
 * Mengambil voucher yang sudah ditukar oleh user dari sheet 'UserVouchers'.
 * @param {string} userId - ID user.
 * @returns {Array<Object>} Array objek user voucher.
 */
function getUserVouchers(userId) {
  const userVoucherHeaders = ['id', 'userId', 'voucherId', 'code', 'redeemedAt', 'expiryAt', 'status'];
  const sheet = getOrCreateSheet('UserVouchers', userVoucherHeaders);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const userVouchers = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (String(row[1]) === String(userId)) {
      const uv = {};
      for (let j = 0; j < headers.length; j++) {
        let value = row[j];
        if (headers[j] === 'voucherId') {
          value = parseInt(value);
        }
        uv[headers[j]] = value;
      }
      userVouchers.push(uv);
    }
  }
  
  return userVouchers;
}

/**
 * Mengambil riwayat poin user dari sheet 'PointsHistory'.
 * @param {string} userId - ID user.
 * @returns {Array<Object>} Array objek points history.
 */
function getPointsHistory(userId) {
  const historyHeaders = ['id', 'userId', 'type', 'amount', 'description', 'createdAt'];
  const sheet = getOrCreateSheet('PointsHistory', historyHeaders);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const history = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (String(row[1]) === String(userId)) {
      const h = {};
      for (let j = 0; j < headers.length; j++) {
        let value = row[j];
        if (headers[j] === 'amount') {
          value = parseInt(value);
        }
        h[headers[j]] = value;
      }
      history.push(h);
    }
  }
  
  return history;
}

/**
 * Menukar poin user dengan voucher.
 * @param {string} userId - ID user.
 * @param {number} voucherId - ID voucher.
 * @returns {Object} Hasil penukaran.
 */
function redeemVoucher(userId, voucherId) {
  // 1. Validasi & Keamanan Input
  if (!userId) {
    throw new Error('Parameter userId wajib diisi');
  }
  if (!voucherId) {
    throw new Error('Parameter voucherId wajib diisi');
  }
  
  // Get user
  const user = getUser(userId);
  
  // Get voucher
  const vouchers = getAvailableVouchers();
  const voucher = vouchers.find(v => v.id === parseInt(voucherId));
  
  if (!voucher) {
    throw new Error('Voucher not found with ID: ' + voucherId);
  }
  
  if (user.points < voucher.points) {
    throw new Error('Insufficient points. Required: ' + voucher.points + ', Available: ' + user.points);
  }
  
  // Deduct points from user
  const newPoints = user.points - voucher.points;
  const userSheet = getOrCreateSheet('Users', ['id', 'name', 'email', 'points', 'xp', 'level', 'avatarUrl']);
  const userData = userSheet.getDataRange().getValues();
  
  for (let i = 1; i < userData.length; i++) {
    if (String(userData[i][0]) === String(userId)) {
      userSheet.getRange(i + 1, 4).setValue(newPoints); // Update points column
      break;
    }
  }
  
  // Create user voucher record
  const userVoucherSheet = getOrCreateSheet('UserVouchers', ['id', 'userId', 'voucherId', 'code', 'redeemedAt', 'expiryAt', 'status']);
  const now = new Date();
  const expiryDate = new Date(now.getTime() + voucher.expiryDays * 24 * 60 * 60 * 1000);
  const voucherCode = 'VCH-' + generateRandomCode(8);
  const uvId = 'uv-' + Math.random().toString(36).substr(2, 9);
  
  userVoucherSheet.appendRow([
    uvId,
    userId,
    voucherId,
    voucherCode,
    now.toISOString(),
    expiryDate.toISOString(),
    'Active'
  ]);
  
  // Record points history
  const historySheet = getOrCreateSheet('PointsHistory', ['id', 'userId', 'type', 'amount', 'description', 'createdAt']);
  const phId = 'ph-' + Math.random().toString(36).substr(2, 9);
  historySheet.appendRow([
    phId,
    userId,
    'Redeem',
    -voucher.points,
    'Tukar Voucher: ' + voucher.title,
    now.toISOString()
  ]);
  
  return {
    success: true,
    message: 'Voucher redeemed successfully',
    voucherCode: voucherCode,
    newPoints: newPoints,
    userVoucherId: uvId
  };
}

/**
 * Update XP user dan cek level progression.
 * @param {string} userId - ID user.
 * @param {number} xpToAdd - Jumlah XP yang ditambahkan.
 * @returns {Object} Hasil update.
 */
function updateUserXP(userId, xpToAdd) {
  // 1. Validasi & Keamanan Input
  if (!userId) {
    throw new Error('Parameter userId wajib diisi');
  }
  if (xpToAdd === undefined || xpToAdd === null) {
    throw new Error('Parameter xpToAdd wajib diisi');
  }
  
  const user = getUser(userId);
  const newXP = user.xp + xpToAdd;
  
  // Level progression logic
  const levelThresholds = {
    'Benih': 0,
    'Bunga': 750,
    'Buah': 1500,
    'Panen': 3000
  };
  
  let newLevel = user.level;
  for (const [levelName, threshold] of Object.entries(levelThresholds)) {
    if (newXP >= threshold) {
      newLevel = levelName;
    }
  }
  
  // Update user sheet
  const userSheet = getOrCreateSheet('Users', ['id', 'name', 'email', 'points', 'xp', 'level', 'avatarUrl']);
  const userData = userSheet.getDataRange().getValues();
  
  for (let i = 1; i < userData.length; i++) {
    if (String(userData[i][0]) === String(userId)) {
      userSheet.getRange(i + 1, 5).setValue(newXP); // Update XP column
      userSheet.getRange(i + 1, 6).setValue(newLevel); // Update level column
      break;
    }
  }
  
  return {
    success: true,
    newXP: newXP,
    newLevel: newLevel,
    levelChanged: newLevel !== user.level
  };
}

/**
 * Generate random code untuk voucher.
 * @param {number} length - Panjang code.
 * @returns {string} Random code.
 */
function generateRandomCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Menambahkan data voucher dummy ke sheet 'Vouchers'.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Objek sheet Vouchers.
 */
function seedDummyVouchers(sheet) {
  const dummyVouchers = [
    [1, 'Voucher Belanja', 'Diskon Belanja Rp 10.000', 500, 10000, 30, 'bg-green-700', 'Voucher diskon belanja senilai Rp 10.000 untuk semua produk.'],
    [2, 'Gratis Ongkir', 'Gratis Ongkir s.d Rp 15.000', 300, 15000, 14, 'bg-blue-600', 'Voucher gratis ongkir hingga Rp 15.000 dengan minimal belanja Rp 50.000.'],
    [3, 'Cashback', 'Cashback 5% s.d Rp 20.000', 800, 20000, 7, 'bg-orange-500', 'Cashback 5% dalam bentuk poin setelah transaksi selesai.'],
    [4, 'Voucher Belanja', 'Diskon Belanja Rp 50.000', 2000, 50000, 60, 'bg-green-700', 'Voucher diskon belanja besar senilai Rp 50.000.'],
    [5, 'Gratis Ongkir', 'Gratis Ongkir Tanpa Min. Belanja', 1000, 20000, 30, 'bg-blue-600', 'Nikmati gratis ongkir tanpa minimum pembelanjaan ke seluruh Indonesia.']
  ];
  
  dummyVouchers.forEach(voucher => {
    sheet.appendRow(voucher);
  });
  
  Logger.log('Dummy vouchers seeded successfully.');
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
  
  const userHeaders = ['id', 'name', 'email', 'points', 'xp', 'level', 'avatarUrl'];
  getOrCreateSheet('Users', userHeaders);
  
  const voucherHeaders = ['id', 'type', 'title', 'points', 'value', 'expiryDays', 'color', 'description'];
  getOrCreateSheet('Vouchers', voucherHeaders);
  
  const userVoucherHeaders = ['id', 'userId', 'voucherId', 'code', 'redeemedAt', 'expiryAt', 'status'];
  getOrCreateSheet('UserVouchers', userVoucherHeaders);
  
  const historyHeaders = ['id', 'userId', 'type', 'amount', 'description', 'createdAt'];
  getOrCreateSheet('PointsHistory', historyHeaders);
}

/**
 * Log aktivitas ke sheet 'Logs'.
 * @param {string} action - Nama action.
 * @param {string} userId - ID user (opsional).
 * @param {string} message - Pesan log.
 */
function logAction(action, userId, message) {
  const logHeaders = ['timestamp', 'action', 'userId', 'message'];
  const sheet = getOrCreateSheet('Logs', logHeaders);
  const now = new Date().toISOString();
  sheet.appendRow([now, action, userId || '', message]);
}

/**
 * Log error ke sheet 'Logs'.
 * @param {string} action - Nama action yang error.
 * @param {Object} error - Error object.
 */
function logError(action, error) {
  logAction('ERROR', '', action + ': ' + error.message);
}

// Panggil setupInitialSheets() saat script di-deploy atau di-update
// Ini akan memastikan sheet dan header ada saat pertama kali digunakan
// Anda bisa memanggilnya secara manual sekali setelah deployment awal jika diperlukan
// atau menambahkannya ke fungsi onOpen() jika ingin dijalankan setiap kali spreadsheet dibuka
// function onOpen() {
//   setupInitialSheets();
// }
