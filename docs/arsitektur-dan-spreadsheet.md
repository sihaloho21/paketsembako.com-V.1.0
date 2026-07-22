# Arsitektur Backend Google Apps Script & Struktur Spreadsheet

Dokumen ini menjelaskan rancangan arsitektur backend menggunakan Google Apps Script (GAS) dan struktur kolom pada Google Spreadsheet yang akan digunakan sebagai database untuk website paketsembako.com.

## 1. Arsitektur Sistem

Sistem akan menggunakan arsitektur *serverless* dengan komponen berikut:

*   **Frontend (Client-side):** Aplikasi React (Vite) yang di-host di Netlify. Frontend akan melakukan HTTP GET/POST request ke endpoint Google Apps Script.
*   **Backend (Server-side):** Google Apps Script yang di-deploy sebagai Web App. Script ini akan menerima request dari frontend, memproses data, dan berinteraksi dengan Google Spreadsheet.
*   **Database:** Google Spreadsheet. Setiap *sheet* (tab) di dalam dokumen spreadsheet akan merepresentasikan sebuah tabel database (misalnya: `Products`, `Categories`, `Cart`).

### Alur Komunikasi (Data Flow)

1.  **Frontend** memanggil fungsi `fetch` ke URL Web App Google Apps Script (misal: `https://script.google.com/macros/s/.../exec?action=getProducts`).
2.  **Google Apps Script** menerima request melalui fungsi `doGet(e)` atau `doPost(e)`.
3.  Berdasarkan parameter `action` (misal: `getProducts`), script akan membaca data dari sheet yang sesuai (misal: sheet `Products`).
4.  Script memformat data menjadi JSON dan mengembalikannya ke frontend dengan tipe konten `application/json`.
5.  **Frontend** menerima JSON dan me-render UI (misal: menampilkan daftar produk).

## 2. Struktur Google Spreadsheet

Spreadsheet akan memiliki beberapa sheet (tab) utama. Script GAS akan dirancang untuk **otomatis membuat sheet dan header (kolom)** ini jika belum ada saat pertama kali dijalankan.

### Sheet: `Products`

Menyimpan data produk. Kolom-kolom ini disesuaikan dengan schema `productsTable` dan `ProductDetail` di frontend.

| Nama Kolom (Header) | Tipe Data (Frontend) | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `id` | Number | ID unik produk (Auto-increment/Timestamp) | `1` |
| `name` | String | Nama produk | `Beras Maknyus 5kg` |
| `price` | Number | Harga jual saat ini | `65000` |
| `originalPrice` | Number | Harga asli (sebelum diskon) | `70000` |
| `discountPercent` | Number | Persentase diskon | `7` |
| `imageUrl` | String | URL gambar utama produk | `https://example.com/beras.jpg` |
| `images` | JSON String | Array URL gambar tambahan | `["url1", "url2"]` |
| `categoryId` | Number | ID kategori produk | `2` |
| `categoryName` | String | Nama kategori | `Sembako` |
| `rating` | Number | Rating produk (1.0 - 5.0) | `4.8` |
| `reviewCount` | Number | Jumlah ulasan | `120` |
| `sold` | Number | Jumlah terjual | `500` |
| `badge` | String | Label khusus (misal: "Terlaris") | `Terlaris` |
| `isPromo` | Boolean | Status promo (TRUE/FALSE) | `TRUE` |
| `description` | String | Deskripsi lengkap produk | `Beras kualitas premium...` |
| `shelfLife` | String | Masa simpan/kadaluarsa | `6 Bulan` |
| `deliveryInfo` | String | Info pengiriman | `1-2 Jam Tiba` |
| `variants` | JSON String | Array varian produk (id, label, price) | `[{"id":1,"label":"5kg","price":65000}]` |

### Sheet: `Categories`

Menyimpan data kategori produk.

| Nama Kolom (Header) | Tipe Data (Frontend) | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `id` | Number | ID unik kategori | `1` |
| `name` | String | Nama kategori | `Daging` |
| `productCount` | Number | Jumlah produk dalam kategori ini | `15` |
| `imageUrl` | String | URL gambar/ikon kategori | `https://example.com/daging.jpg` |

### Sheet: `Cart` (Opsional/Jika Diperlukan Backend)

Jika keranjang belanja (cart) ingin disimpan di backend (agar tersinkronisasi antar perangkat). Jika cart hanya disimpan di `localStorage` browser, sheet ini tidak diperlukan. Mengingat aplikasi ini adalah toko sederhana, menyimpan cart di `localStorage` lebih disarankan untuk kecepatan, namun kita siapkan strukturnya jika dibutuhkan.

| Nama Kolom (Header) | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `userId` | String | ID unik pengguna (bisa dari localStorage/session) |
| `productId` | Number | ID produk |
| `quantity` | Number | Jumlah barang |
| `variantId` | Number | ID varian (jika ada) |

## 3. Desain Endpoint Google Apps Script

Script akan menangani request GET dan POST. Parameter `action` akan menentukan operasi yang dilakukan.

**GET Requests (`doGet(e)`):**

*   `?action=getProducts`: Mengambil semua produk. Mendukung parameter tambahan seperti `?categoryId=1`, `?sort=terbaru`, `?isPromo=true`, `?isTrending=true`.
*   `?action=getProduct&id=1`: Mengambil detail satu produk berdasarkan ID.
*   `?action=getCategories`: Mengambil semua kategori.

**POST Requests (`doPost(e)`):**

*   `action=checkout`: (Rencana masa depan) Menerima data pesanan dari frontend dan menyimpannya ke sheet `Orders`.

## 4. Strategi Integrasi Frontend

1.  **Konfigurasi Base URL:** File `lib/api-client-react/src/custom-fetch.ts` akan dimodifikasi atau kita akan membuat file konfigurasi baru (misal `config.json` yang di-fetch saat load) untuk menyimpan URL Web App Google Apps Script.
2.  **Penyesuaian API Client:** Mengubah endpoint yang dipanggil oleh React Query (di `api.ts`) agar mengarah ke URL GAS dengan parameter `?action=...` yang sesuai, alih-alih menggunakan path relatif `/api/...`.
3.  **Penanganan CORS:** Google Apps Script Web App secara default menangani CORS dengan baik jika merespons dengan `ContentService.createTextOutput()`, namun frontend harus siap menerima respons yang mungkin di-redirect (HTTP 302) oleh infrastruktur Google. Penggunaan `fetch` standar biasanya sudah cukup menangani ini secara transparan.
