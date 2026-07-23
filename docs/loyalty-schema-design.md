# Loyalty & Account Database Schema Design

This document outlines the additional sheets and columns needed in Google Spreadsheet to support dynamic loyalty features.

## 1. New Spreadsheet Sheets

### Sheet: `Users`
Stores user profile information, loyalty points, and XP.

| Nama Kolom (Header) | Tipe Data | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `id` | String | ID unik user (misal: "user-123") | `user-123` |
| `name` | String | Nama lengkap user | `User A` |
| `email` | String | Email user | `user@example.com` |
| `points` | Number | Total poin saat ini | `25000` |
| `xp` | Number | Total XP untuk level | `1250` |
| `level` | String | Nama level saat ini | `Silver` |
| `avatarUrl` | String | URL foto profil | `https://example.com/avatar.jpg` |

### Sheet: `Vouchers`
Stores available vouchers that can be redeemed using points.

| Nama Kolom (Header) | Tipe Data | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `id` | Number | ID unik voucher | `1` |
| `type` | String | Tipe voucher | `Voucher Belanja` |
| `title` | String | Judul voucher | `Voucher Hypermart Rp20.000` |
| `points` | Number | Poin yang dibutuhkan | `2000` |
| `value` | String | Nilai voucher | `20K` |
| `expiryDays` | Number | Masa berlaku (hari) setelah klaim | `30` |
| `color` | String | Kode warna gradient Tailwind | `from-green-400 to-green-600` |
| `description` | String | Deskripsi/syarat voucher | `Minimal belanja Rp100.000` |

### Sheet: `UserVouchers`
Stores history of vouchers redeemed by users.

| Nama Kolom (Header) | Tipe Data | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `id` | String | ID unik transaksi | `uv-987` |
| `userId` | String | ID user | `user-123` |
| `voucherId` | Number | ID voucher yang ditukar | `1` |
| `code` | String | Kode voucher unik | `VCH-ABC-123` |
| `redeemedAt` | String | Tanggal penukaran (ISO) | `2026-07-23T10:00:00Z` |
| `expiryAt` | String | Tanggal kadaluarsa (ISO) | `2026-08-22T10:00:00Z` |
| `status` | String | Status (Active, Used, Expired) | `Active` |

### Sheet: `PointsHistory` (Optional for Activity)
Stores point transaction history.

| Nama Kolom (Header) | Tipe Data | Deskripsi | Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `id` | String | ID unik transaksi | `ph-111` |
| `userId` | String | ID user | `user-123` |
| `type` | String | Tipe (Earn, Redeem) | `Redeem` |
| `amount` | Number | Jumlah poin | `-2000` |
| `description` | String | Deskripsi transaksi | `Tukar Voucher 20K` |
| `createdAt` | String | Tanggal transaksi | `2026-07-23T10:00:00Z` |

## 2. API Endpoints (Google Apps Script)

### GET Requests
*   `?action=getUser&id=user-123`: Get user profile, points, and level.
*   `?action=getAvailableVouchers`: Get list of vouchers available for redemption.
*   `?action=getUserVouchers&userId=user-123`: Get user's redeemed vouchers history.
*   `?action=getPointsHistory&userId=user-123`: Get user's points activity.

### POST Requests
*   `action=redeemVoucher`: User exchanges points for a voucher.
    *   Body: `{ userId: "user-123", voucherId: 1 }`
*   `action=updateUserXP`: Update user XP and level (if applicable).
    *   Body: `{ userId: "user-123", xpToAdd: 100 }`
