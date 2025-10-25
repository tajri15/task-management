# Backend (Laravel)

Ini adalah API backend untuk aplikasi Task Management.

## Cara Menjalankan

1.  Pastikan Anda memiliki PHP, Composer, dan PostgreSQL terinstal.
2.  Masuk ke direktori `backend`: `cd backend`
3.  Install dependensi PHP: `composer install`
4.  Salin file environment: `copy .env.example .env`
5.  Edit file `.env` dan sesuaikan koneksi database PostgreSQL Anda (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
6.  Buat *database* di PostgreSQL (misal: `db_task_management`).
7.  Generate kunci aplikasi: `php artisan key:generate`
8.  Generate kunci JWT: `php artisan jwt:secret`
9.  Jalankan migrasi database: `php artisan migrate`
10. Jalankan server: `php artisan serve`

Server akan berjalan di `http://127.0.0.1:8000`.