# Changelog

Semua perubahan penting pada ekstensi **JS Conciseness Analyzer** akan didokumentasikan di file ini.

Format pencatatan ini didasarkan pada standar [Keep a Changelog](https://keepachangelog.com/), dan proyek ini mematuhi [Semantic Versioning](https://semver.org/).

## [1.0.1] - 2026-04-25

### Ditambahkan
- **Analisis File Aktif**           : Fitur untuk menghitung metrik Halstead pada file JavaScript yang sedang terbuka di editor (`Analyze Active File`).
- **Analisis Workspace**            : Kemampuan memindai massal seluruh file dalam folder dengan batasan penyaringan NCLOC minimum 20 baris (`Run Workspace Analysis`).
- **Pembedahan Token**              : Fitur untuk melihat rincian operator dan operan yang diekstrak oleh parser (`Show Halstead Token Details`).
- **Output Panel Kustom**           : Tampilan hasil analisis yang rapi langsung di dalam ekosistem VS Code tanpa memerlukan terminal.
- **Parsing AST Lanjutan**          : Dukungan parsing sintaks JavaScript modern menggunakan library `acorn` dengan *fallback* antara mode *module* dan *script*.
- **Penanganan Error Bersahabat**   : Deteksi dan pelaporan lokasi kesalahan sintaks (Baris/Kolom) jika kode pengguna tidak valid sebelum analisis berjalan.

### Diperbaiki
- Penyesuaian pengecualian node dan token agar sesuai dengan standar pengukuran kualitas internal perangkat lunak.

## [1.0.2] - 2026-04-25

### Ditambahkan
- **Manambahkan Icon Ekstensi**