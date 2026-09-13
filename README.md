# RilzPedia Digital Store

Buat sebuah website e-commerce digital bernama RILZPEDIA, yaitu toko online untuk menjual produk digital seperti akun premium, voucher, lisensi, membership, dan produk digital lainnya.



Website harus terlihat seperti toko digital profesional, modern, cepat, responsif, dan nyaman digunakan di HP maupun desktop.



1. BRANDING & DESAIN



Nama website: RILZPEDIA



Tema:



- Dark modern premium

- Dominan hitam/abu gelap dengan aksen warna yang elegan

- UI bersih dan tidak terlalu ramai

- Card produk dengan border radius modern

- Animasi halus

- Responsive mobile-first

- Gunakan font modern seperti Inter/Poppins

- Buat navbar sticky

- Gunakan icon yang konsisten

- Hindari tampilan seperti template website generik



Homepage memiliki:



- Logo RILZPEDIA

- Navbar: Home, Produk, Kategori, Cek Pesanan, Bantuan

- Tombol Login/Register

- Hero section dengan slogan toko

- Search bar produk

- Kategori produk

- Produk populer

- Produk terbaru

- Produk dengan stok tersedia

- Promo/discount section

- Keunggulan toko

- FAQ

- Footer



2. SISTEM PRODUK



Setiap produk memiliki:



- Nama produk

- Gambar/logo

- Deskripsi

- Harga normal

- Harga promo

- Durasi

- Kategori

- Status stok

- Jumlah stok

- Badge "Best Seller", "Promo", "New", atau "Limited"

- Informasi produk

- Informasi garansi

- Cara penggunaan



Contoh kategori:



- Streaming

- Music

- AI

- VPN

- Gaming

- Software

- Voucher

- Membership

- Lainnya



Tampilan stok harus jelas seperti toko online pada umumnya.



Contoh:



Netflix Premium

Rp25.000

STOK: 8 tersedia



Spotify Premium

Rp15.000

STOK: 12 tersedia



Jika stok 0:

STOK HABIS



Produk yang stoknya habis tidak dapat dibeli.



3. HALAMAN DETAIL PRODUK



Ketika pelanggan membuka produk:



- Foto/logo produk

- Nama produk

- Rating/review

- Harga

- Harga coret jika sedang promo

- Stok tersedia

- Durasi produk

- Deskripsi lengkap

- Benefit

- Garansi

- Syarat dan ketentuan

- Tombol "Beli Sekarang"

- Tombol "Tambah ke Keranjang"



Tampilkan jumlah stok secara realtime.



4. SISTEM PEMBELIAN



Alur pembelian:



1. User memilih produk.

2. User memilih jumlah pembelian.

3. Sistem mengecek stok.

4. User mengisi data yang diperlukan, misalnya:

   - Nama

   - Email

   - Nomor WhatsApp

5. Sistem membuat order.

6. Sistem menghasilkan invoice.

7. Sistem membuat QRIS pembayaran dengan nominal yang sesuai.

8. User melakukan pembayaran.

9. Sistem memverifikasi pembayaran secara otomatis melalui payment gateway/API.

10. Jika pembayaran berhasil, status order berubah menjadi:

    PAID / BERHASIL

11. Sistem mengambil data produk digital dari database stok.

12. Sistem mengirim/membuka data produk kepada pelanggan secara otomatis.

13. Stok berkurang otomatis.

14. Order tersimpan di riwayat pembelian.



Jangan mengurangi stok sebelum pembayaran berhasil.



Jika pembayaran gagal/expired:



- Order menjadi EXPIRED/FAILED

- Stok dikembalikan jika sebelumnya sudah di-reserve.



5. SISTEM QRIS OTOMATIS



Integrasikan website dengan payment gateway yang mendukung QRIS API.



Jangan membuat sistem QRIS palsu atau sekadar gambar QR.



Gunakan API payment gateway yang benar dan memiliki webhook/callback.



Flow:



CREATE ORDER

↓

CREATE PAYMENT

↓

GENERATE QRIS

↓

USER SCAN QRIS

↓

PAYMENT GATEWAY VERIFICATION

↓

WEBHOOK

↓

VERIFY PAYMENT

↓

ORDER = PAID

↓

DELIVER PRODUCT



Tampilkan:



- QR Code

- Total pembayaran

- Order ID

- Countdown pembayaran

- Status pembayaran realtime

- Tombol "Saya Sudah Bayar" hanya sebagai pengecekan status, bukan sebagai cara memalsukan pembayaran.



Jika payment gateway mendukung:



- Auto checking

- Webhook

- Expired payment

- Payment status

- Transaction ID



gunakan semuanya.



API key/payment secret harus disimpan di server/environment variable dan TIDAK boleh dimasukkan ke frontend.



6. AUTO DELIVERY PRODUK DIGITAL



Setelah payment benar-benar terverifikasi:



Sistem otomatis mengambil satu stok produk dari database.



Contoh database stok:



PRODUCT:

Netflix Premium 1 Bulan



STOCK:

account1@example.com | password123

account2@example.com | password456

account3@example.com | password789



Setelah order berhasil:



- Ambil 1 stok yang tersedia.

- Tandai stok sebagai SOLD.

- Hubungkan stok dengan order ID.

- Tampilkan data kepada pelanggan.

- Jangan pernah memberikan stok yang sama kepada dua pelanggan.



Halaman hasil pembelian:



Pembayaran Berhasil



Order ID: #RZP123456



Produk:

Netflix Premium 1 Bulan



Status:

PAID



Data produk:

Email: ********

Password: ********



Berikan tombol:

Tampilkan Data

Salin Data

Download/Save Invoice



Data sensitif jangan ditampilkan sebelum pembayaran terverifikasi.



7. KEAMANAN AUTO DELIVERY



Implementasikan transaction/database locking agar dua user yang membeli bersamaan tidak mendapatkan akun yang sama.



Gunakan konsep:



BEGIN TRANSACTION

→ verify payment

→ lock available stock

→ assign stock

→ mark stock as sold

→ attach stock to order

→ COMMIT



Jika proses gagal:

ROLLBACK.



Jangan menyimpan password/API secret di source code frontend.



8. USER ACCOUNT



Buat sistem:



- Register

- Login

- Logout

- Forgot password

- Profile

- Riwayat transaksi

- Detail transaksi

- Status order

- Produk yang pernah dibeli



Tambahkan opsi login menggunakan:

Google OAuth



User dapat:



- Login dengan Google

- Login menggunakan email/password

- Melihat order history

- Melihat invoice

- Melihat produk digital yang sudah dibeli



Gunakan sistem authentication yang aman.



9. CEK PESANAN



Buat halaman:



Cek Pesanan



User dapat memasukkan:



- Order ID

- Email



Kemudian sistem menampilkan:



Order ID

Produk

Tanggal

Total

Status pembayaran

Status delivery



Status:



- WAITING PAYMENT

- PAID

- PROCESSING

- DELIVERED

- EXPIRED

- FAILED



10. ADMIN DASHBOARD



Buat dashboard admin terpisah.



Dashboard menampilkan:



- Total penjualan

- Pendapatan hari ini

- Pendapatan bulan ini

- Total order

- Order pending

- Order berhasil

- Produk terlaris

- Produk stok menipis

- Jumlah stok

- Grafik penjualan



Menu admin:



Dashboard

Products

Categories

Stock

Orders

Customers

Payments

Discounts

Reviews

Settings



11. MANAJEMEN PRODUK



Admin dapat:



- Tambah produk

- Edit produk

- Hapus produk

- Upload gambar

- Mengatur harga

- Mengatur harga promo

- Mengatur kategori

- Mengatur deskripsi

- Mengatur durasi

- Mengatur garansi

- Mengaktifkan/nonaktifkan produk



12. MANAJEMEN STOK



Buat halaman khusus:



Stock Management



Admin dapat:



- Menambahkan stok secara manual

- Import stok dalam jumlah banyak

- Melihat stok tersedia

- Melihat stok terjual

- Melihat stok yang digunakan

- Melihat stok berdasarkan produk

- Menghapus stok

- Menandai stok sebagai inactive



Gunakan status:



AVAILABLE

RESERVED

SOLD

INVALID



Admin tidak boleh secara tidak sengaja melihat password stok secara terbuka; sediakan tombol reveal/copy dan audit log jika diperlukan.



13. AUTO STOCK WARNING



Jika stok kurang dari batas tertentu:



Contoh:

Stok ≤ 5



Tampilkan:

STOK MENIPIS



Jika stok 0:

HABIS



Dashboard admin juga memberikan warning:



"Netflix Premium hanya tersisa 3 stok."



14. DISCOUNT & PROMO



Buat sistem voucher:



Contoh:



RILZ10



Diskon:

10%



Admin dapat menentukan:



- Persentase diskon

- Nominal diskon

- Minimum pembelian

- Maksimum penggunaan

- Tanggal mulai

- Tanggal berakhir

- Produk yang berlaku



15. REVIEW & RATING



Setelah order berhasil, user dapat memberikan:



⭐ Rating 1–5

Komentar/review



Admin dapat melakukan moderasi review.



Homepage menampilkan review pelanggan.



16. NOTIFIKASI



Sediakan sistem notifikasi untuk:



- Order dibuat

- Pembayaran berhasil

- Produk berhasil dikirim

- Pembayaran expired

- Promo

- Stok produk menipis untuk admin



Jika memungkinkan, integrasikan notifikasi email dan WhatsApp melalui provider/API resmi.



17. INVOICE



Setiap transaksi memiliki invoice.



Invoice berisi:



RILZPEDIA

Order ID

Tanggal

Nama pelanggan

Email

Produk

Jumlah

Harga

Diskon

Total

Payment status



Sediakan:

Download Invoice PDF



18. DATABASE



Gunakan database relasional yang cocok untuk production.



Minimal tabel:



users

products

categories

product_stock

orders

order_items

payments

reviews

coupons

coupon_usage

notifications

admin_users

audit_logs



Relasikan tabel dengan foreign key yang benar.



Stock harus memiliki relasi dengan product dan order.



19. ADMIN SECURITY



Admin dashboard wajib memiliki:



- Authentication

- Authorization

- Role-based access

- Admin session

- Audit log

- Rate limiting

- Server-side validation



Jangan hanya menyembunyikan halaman admin dari frontend.



Pastikan API admin benar-benar memeriksa authorization di server.



20. API STRUCTURE



Gunakan backend API yang rapi.



Contoh:



POST /api/auth/register

POST /api/auth/login

POST /api/auth/google

GET /api/products

GET /api/products/:id

POST /api/orders

GET /api/orders/:id

POST /api/payments/create

GET /api/payments/:id/status

POST /api/payments/webhook



Admin:



GET /api/admin/dashboard

POST /api/admin/products

PUT /api/admin/products/:id

DELETE /api/admin/products/:id

POST /api/admin/stock

GET /api/admin/orders



Webhook pembayaran harus diverifikasi menggunakan signature/secret dari payment gateway.



21. SEARCH & FILTER



Buat pencarian produk dengan:



- Search keyword

- Kategori

- Harga

- Status stok

- Popularitas

- Terbaru



Tambahkan sorting:



- Terbaru

- Harga termurah

- Harga tertinggi

- Terlaris



22. RESPONSIVE



Website harus optimal untuk:



Mobile 360px+

Tablet

Desktop



Mobile navigation menggunakan hamburger menu.



Admin dashboard juga harus tetap usable di HP.



23. SEO



Tambahkan:



- Dynamic page title

- Meta description

- Open Graph

- Sitemap

- robots.txt

- SEO-friendly URL

- Product structured data jika relevan



24. PERFORMA



Prioritaskan:



- Fast loading

- Lazy loading image

- Optimized image

- API caching jika sesuai

- Database indexing

- Pagination

- Tidak mengambil seluruh stok sekaligus ke frontend



25. HALAMAN YANG WAJIB ADA



/



/products



/products/[slug]



/categories/[slug]



/cart



/checkout



/payment/[orderId]



/order/[orderId]



/orders



/login



/register



/forgot-password



/profile



/faq



/terms



/privacy



/admin



/admin/products



/admin/products/[id]



/admin/stock



/admin/orders



/admin/customers



/admin/payments



/admin/coupons



/admin/reviews



/admin/settings



26. UX CHECKOUT



Checkout harus sederhana.



Step 1:

Data pelanggan



Step 2:

Ringkasan pesanan



Step 3:

Pembayaran QRIS



Step 4:

Verifikasi otomatis



Step 5:

Produk dikirim



Jangan membuat pelanggan harus melakukan banyak langkah yang tidak diperlukan.



27. EMPTY STATE & ERROR STATE



Buat UI khusus untuk:



- Produk habis

- Keranjang kosong

- Order tidak ditemukan

- Payment expired

- Payment gagal

- Server error

- Network error

- Produk tidak tersedia

- Stok habis saat checkout



Gunakan pesan yang jelas dan tombol kembali/retry.



28. LEGAL & COMPLIANCE



Buat halaman Terms of Service, Privacy Policy, Refund Policy, dan aturan penggunaan produk.



Sistem hanya boleh digunakan untuk menjual produk digital yang memang memiliki hak untuk dijual/didistribusikan oleh pemilik toko. Jangan membuat fitur untuk menjual atau mendistribusikan akses yang diperoleh secara ilegal.



29. PRIORITAS IMPLEMENTASI



Bangun terlebih dahulu fitur inti:



1. Homepage

2. Product catalog

3. Product detail

4. Cart

5. Checkout

6. QRIS payment

7. Payment webhook

8. Automatic digital delivery

9. Stock management

10. Order history

11. Authentication

12. Google Login

13. Admin dashboard



Setelah fitur inti stabil, baru tambahkan:



- Voucher

- Review

- Notification

- Analytics

- Promo

- Advanced SEO



30. HASIL AKHIR



Hasil akhir harus terasa seperti toko digital sungguhan, bukan sekadar landing page.



Pastikan seluruh flow dapat bekerja:



USER

↓

BROWSE PRODUCT

↓

SELECT PRODUCT

↓

CHECK STOCK

↓

CHECKOUT

↓

CREATE ORDER

↓

GENERATE QRIS

↓

PAYMENT

↓

PAYMENT GATEWAY WEBHOOK

↓

VERIFY PAYMENT

↓

ASSIGN STOCK

↓

AUTO DELIVERY

↓

ORDER COMPLETED



Buat kode production-ready dengan struktur project yang rapi, environment variables untuk secret/API key, validasi server-side, database transaction untuk stok, webhook verification, authentication yang aman, dan error handling yang lengkap.



Jangan menggunakan data pembayaran palsu sebagai sistem pembayaran sebenarnya. Sediakan konfigurasi agar API payment gateway/QRIS dapat dimasukkan melalui environment variables.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fa03efb9-91cb-40e7-a101-41b66a1a5134).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
