# RILZPEDIA — Roadmap

## Selesai (tahap 1: tampilan toko)
- [x] Design system dark premium, aksen biru elektrik, font Sora + Plus Jakarta Sans
- [x] Navbar sticky + menu hamburger, footer, toast
- [x] Homepage: hero, search, kategori, promo, populer, terbaru, siap kirim, keunggulan, ulasan, FAQ
- [x] Katalog produk + pencarian, filter kategori/stok, sorting
- [x] Detail produk (harga promo, stok, benefit, cara pakai, garansi, S&K)
- [x] Keranjang (localStorage) + checkout langkah 1 (data pembeli)
- [x] Cek Pesanan (form + arti status)
- [x] Login, Register, Lupa Password (tampilan)
- [x] Terms, Privacy, Refund, sitemap, meta SEO per halaman

## Berikutnya (butuh backend / keputusan user)
- [ ] Aktifkan Lovable Cloud: tabel users, products, categories, product_stock, orders, order_items, payments, reviews, coupons, coupon_usage, notifications, user_roles, audit_logs
- [ ] Login email/password + Google OAuth, profil, riwayat transaksi
- [ ] Pembayaran QRIS via payment gateway (rekomendasi: Midtrans) + webhook verifikasi signature
- [ ] PayPal (Sandbox → Production): create order server-side, verifikasi via API/webhook, idempotency, PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET/PAYPAL_ENVIRONMENT
- [ ] Halaman status pembayaran (menunggu/berhasil/gagal/kedaluwarsa) dengan animasi status
- [ ] Auto delivery dengan database transaction/locking stok
- [ ] Halaman /payment/[orderId], /order/[orderId], /orders, /profile
- [ ] Admin dashboard + manajemen produk, stok, order, kupon, review, settings
- [ ] Invoice PDF, notifikasi email/WhatsApp, review & rating
