# Panduan Deployment Website paketsembako.com

Dokumen ini menjelaskan langkah-langkah untuk mendeploy website `paketsembako.com` ke Netlify dan mengkonfigurasi Google Apps Script sebagai backend.

## 1. Deployment Google Apps Script (GAS)

Google Apps Script akan berfungsi sebagai backend yang berinteraksi dengan Google Spreadsheet Anda. Ikuti langkah-langkah berikut untuk mendeploy GAS:

1.  **Buat Google Spreadsheet Baru:**
    *   Buka Google Drive Anda.
    *   Buat Google Spreadsheet baru (misal: `PaketSembako_DB`).
    *   Catat **ID Spreadsheet** dari URL. Contoh: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`.

2.  **Buat Project Google Apps Script Baru:**
    *   Buka [script.google.com](https://script.google.com/).
    *   Klik `New project`.
    *   Salin seluruh isi file `google-apps-script/Code.gs` yang telah disediakan ke dalam editor script.
    *   Ganti placeholder `YOUR_SPREADSHEET_ID` di baris `const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';` dengan ID Spreadsheet yang Anda catat sebelumnya.

3.  **Konfigurasi Manifest File (`appsscript.json`):**
    *   Di editor GAS, klik ikon `Project Settings` (roda gigi) di sidebar kiri.
    *   Centang `Show 
 "appsscript.json" manifest file in editor`.
    *   Buka file `appsscript.json`.
    *   Pastikan `oauthScopes` menyertakan `https://www.googleapis.com/auth/spreadsheets` dan `https://www.googleapis.com/auth/script.external_request`.
    *   Contoh `appsscript.json`:

        ```json
        {
          "timeZone": "Asia/Jakarta",
          "dependencies": {},
          "exceptionLogging": "STACKDRIVER",
          "runtimeVersion": "V8",
          "oauthScopes": [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/script.external_request"
          ]
        }
        ```

4.  **Deploy sebagai Web App:**
    *   Di editor GAS, klik `Deploy` -> `New deployment`.
    *   Pilih tipe `Web app`.
    *   Konfigurasi:
        *   `Execute as`: `Me` (email Anda)
        *   `Who has access`: `Anyone`
    *   Klik `Deploy`.
    *   Anda akan diminta untuk mengotorisasi script. Ikuti langkah-langkah otorisasi.
    *   Setelah berhasil deploy, Anda akan mendapatkan `Web app URL`. Salin URL ini. Ini akan terlihat seperti `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`.
    *   **PENTING:** Ganti bagian `/exec` dengan `/usercontent` di URL ini untuk digunakan di frontend. Jadi, URL yang akan Anda gunakan di frontend adalah `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent`.

5.  **Inisialisasi Sheet Otomatis:**
    *   Setelah deployment pertama, buka URL Web App Anda di browser (URL dengan `/exec`). Ini akan menjalankan fungsi `doGet` dan `setupInitialSheets` yang akan membuat sheet `Products` dan `Categories` beserta headernya di Google Spreadsheet Anda.
    *   Anda bisa mengisi data contoh di sheet `Products` dan `Categories` sesuai dengan struktur kolom yang telah dirancang.

## 2. Deployment Frontend ke Netlify

Frontend aplikasi ini akan di-deploy ke Netlify. Berikut langkah-langkahnya:

1.  **Commit dan Push Perubahan ke GitHub:**
    *   Pastikan semua perubahan yang telah saya buat (file `config.json`, `config.ts`, `gas-api.ts`, `App.tsx`, `vite.config.ts`, `.env.example`, `netlify.toml`, dan `deployment-guide.md`) sudah di-commit dan di-push ke repository GitHub Anda (`sihaloho21/paketsembako.com-V.1.0`).

2.  **Buat Situs Baru di Netlify:**
    *   Login ke akun Netlify Anda.
    *   Klik `Add new site` -> `Import an existing project`.
    *   Pilih `Deploy with GitHub` dan otorisasi Netlify untuk mengakses repository Anda.
    *   Pilih repository `sihaloho21/paketsembako.com-V.1.0`.

3.  **Konfigurasi Build Settings di Netlify:**
    *   **Base directory:** Biarkan kosong atau sesuaikan jika Anda memindahkan proyek ke sub-folder.
    *   **Build command:** `pnpm install && pnpm --filter @workspace/hypermart-store build`
    *   **Publish directory:** `artifacts/hypermart-store/dist`

4.  **Tambahkan Environment Variable (Opsional, tapi disarankan):**
    *   Di Netlify, navigasikan ke `Site settings` -> `Build & deploy` -> `Environment`.
    *   Tambahkan variabel lingkungan:
        *   `VITE_GAS_API_URL`: Masukkan URL Web App Google Apps Script Anda yang sudah dimodifikasi (dengan `/usercontent`). Contoh: `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent`.
    *   Meskipun frontend dirancang untuk mengambil `config.json` secara dinamis, menyediakan `VITE_GAS_API_URL` sebagai environment variable di Netlify akan membantu jika Anda ingin menggunakannya untuk tujuan lain atau sebagai fallback.

5.  **Deploy Situs:**
    *   Klik `Deploy site`.
    *   Netlify akan secara otomatis membangun dan mendeploy aplikasi Anda.

## 3. Konfigurasi Frontend (Setelah Deployment Netlify)

Setelah website terdeploy di Netlify, Anda perlu memperbarui file `config.json` di Netlify agar mengarah ke URL Google Apps Script yang benar.

1.  **Akses `config.json` di Netlify:**
    *   Di Netlify, navigasikan ke `Deploys` -> Pilih deploy terbaru Anda.
    *   Klik `Post processing` -> `Snippet injection` (atau cari cara untuk mengedit file yang sudah terdeploy, biasanya ini dilakukan dengan mengedit file di repository dan redeploy).
    *   **Cara yang lebih disarankan:** Edit file `/artifacts/hypermart-store/public/config.json` di repository GitHub Anda secara langsung.
        *   Ganti `"apiBaseUrl": "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent"` dengan URL Web App Google Apps Script Anda yang sebenarnya.
        *   Commit perubahan ini dan push ke GitHub. Netlify akan secara otomatis melakukan redeploy.

Dengan langkah-langkah ini, website Anda akan terhubung ke Google Apps Script sebagai backend dan terhosting di Netlify.
