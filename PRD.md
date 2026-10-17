# Product Requirements Document (PRD)
## Platform Pembelajaran Pembukaan Catur Populer (Bahasa Indonesia)

---

### 1. Ringkasan Eksekutif (Executive Summary)
* **Nama Proyek (Tentatif):** CaturMaster ID / Akademi Pembukaan Catur
* **Deskripsi:** Aplikasi web interaktif berbasis Svelte 5 untuk mempelajari pembukaan-pembukaan catur paling populer di dunia dengan penjelasan berbobot, ringkas, dan 100% menggunakan Bahasa Indonesia.
* **Tujuan Utama:** Membantu pemain catur Indonesia memahami *ide strategis*, *rencana midgame*, *karakteristik endgame*, serta *senjata counter* di balik setiap pembukaan catur, bukan sekadar menghafal urutan langkah secara buta.

---

### 2. Sasaran Pengguna (Target Audience & Persona)
1. **Pemain Pemula (Elo 600 - 1200):**
   * *Masalah:* Sering bingung langkah di fase awal, terjebak jebakan pembukaan, dan tidak tahu apa yang harus dilakukan setelah pembukaan selesai.
   * *Kebutuhan:* Penjelasan konsep dasar (kontrol pusat, perkembangan perwira, keamanan raja), visualisasi langkah demi langkah yang interaktif, dan navigasi ramah pemula.
2. **Pemain Menengah (Elo 1200 - 1800):**
   * *Masalah:* Tahu urutan pembukaan tetapi kebingungan mengeksekusi rencana midgame dan mengonversinya menjadi kemenangan di endgame. Sulit menghadapi lawan yang memainkan pembukaan tidak biasa atau agresif.
   * *Kebutuhan:* Rencana transisi midgame yang konkret (struktur pion, petak outposts, terobosan pion), pemahaman counter-opening, dan latihan tebak langkah.

---

### 3. Lingkup Fitur Utama (Core Features)

#### Fitur 1: Repertoar & Seleksi Pembukaan (Putih vs Hitam)
* **Kategori Pemain:**
  * **Sebagai Pemain Putih (White Repertoire):**
    * *Jalur 1.e4 (King's Pawn):* Ruy Lopez (Pembukaan Spanyol), Italian Game (Giuoco Piano), Scotch Game, King's Gambit.
    * *Jalur 1.d4 (Queen's Pawn):* Queen's Gambit (Diterima & Ditolak), London System, Catalan Opening.
    * *Jalur Alternatif:* English Opening (1.c4), Reti Opening (1.Nf3).
  * **Sebagai Pemain Hitam (Black Repertoire):**
    * *Melawan 1.e4:* Sicilian Defense (Najdorf, Dragon), French Defense, Caro-Kann Defense, Scandinavian Defense, 1...e5 (Open Game).
    * *Melawan 1.d4:* King's Indian Defense (KID), Nimzo-Indian Defense, Slav Defense, Dutch Defense.
* **Filter & Pencarian:**
  * Filter berdasarkan Gaya Bermain: *Agresif/Taktikal*, *Posisional/Solid*, *Universal/Pemula*.
  * Tag kesulitan (Mudah, Menengah, Mahir).
  * Statistik popularitas dan persentase kemenangan (Putih/Remis/Hitam).

#### Fitur 2: Papan Simulasi Interaktif & Panduan Langkah-per-Langkah
* **Papan Catur Interaktif:**
  * Ditenagai oleh engine aturan catur (`chess.js`) dan render papan responsif (SVG/CSS modern).
  * Dukungan kontrol: *Next Step, Previous Step, Auto-play, Reset to Start, Flip Board (Putih/Hitam).*
  * Anotasi visual: Panah penunjuk rencana (*Arrows*), highlight petak kunci (*Key Squares*), dan highlight langkah terakhir (*Last Move*).
* **Anotasi Naratif Bahasa Indonesia:**
  * Penjelasan spesifik per langkah: Maksud strategis di balik langkah, perwira mana yang dibuka, dan petak mana yang dikuasai.
  * *Alert Waspada / Warning:* Sorotan khusus pada blunder paling umum atau jebakan taktis (*traps*) di 5–10 langkah awal (misal: *Noah's Ark Trap* di Ruy Lopez, *Fishing Pole Trap*, dsb.).
* **Mode Latihan / Uji Pemahaman (Guess the Move):**
  * Pengguna dapat mencoba memainkan langkah di atas papan. Jika langkah sesuai teori pembukaan, papan akan memberikan feedback positif; jika keliru, papan memberikan petunjuk (hint).

#### Fitur 3: Rencana Transisi Midgame hingga Karakteristik Endgame
* **Rencana Strategis Midgame (Middlegame Masterplan):**
  * **Struktur Pion (Pawn Structure):** Penjelasan struktur pion khas yang dihasilkan (misal: *Carlsbad structure*, *Isolani/pion d terisolasi*, rantai pion tertutup, rantai pion terbuka sayap menteri).
  * **Petak Lemah & Outpost:** Di mana letak kuda dan gajah terbaik untuk mengunci kendali.
  * **Rencana Serangan (Pawn Breaks & Invasions):** Kapan harus mendorong pion penembus (*break* seperti c5, d5, e5, f4), dan arah penyerangan (sayap raja vs sayap menteri).
* **Karakteristik & Transisi Endgame:**
  * Tipe perwira yang ingin dipertahankan atau ditukar menuju babak akhir (misal: "Pertahankan sepasang gajah", atau "Tukar menteri untuk masuk ke ending benteng yang unggul secara struktural").
  * Pola keunggulan jangka panjang (misal: mayoritas pion di sayap menteri, penguasaan jalur terbuka untuk benteng).

#### Fitur 4: Matriks Counter-Opening (Cara Mengantisipasi & Membalas)
* **Sistem "Lawan Opening Ini Dengan Apa?":**
  * Setiap pembukaan dilengkapi dengan tab **"Cara Menghadapi / Counter"**.
  * Contoh:
    * Ingin menetralkan **London System**? -> Rekomendasikan balasan agresif dengan *Early c5 + Qb6*, atau setup *Nimzo-Indian style*.
    * Ingin meredam **Sicilian Defense**? -> Rekomendasikan *Alapin Variation (2.c3)* yang solid atau *Grand Prix Attack (2.Nc3 & 3.f4)*.
    * Menghadapi **Ruy Lopez**? -> Rekomendasikan *Berlin Defense* (dinding Berlin yang kokoh) atau *Marshall Attack* (serangan balik penuh energi).
* **Bedah Kelemahan (Weaknesses & Vulnerabilities):**
  * Mengapa pembukaan ini bisa rentan?
  * Ide taktik umum yang sering meruntuhkan struktur pembukaan tersebut.

#### Fitur 5: Fitur Pendukung & User Experience (UX)
* **Glosarium Istilah Catur Indonesia:** Kamus istilah seperti *Fianchetto, Skak Ster, Isolani, Garpu Kuda, Skenario Remis, Outpost, Tempo, Gambit.*
* **Efek Suara (Audio Feedback):** Suara move, capture, check, dan error move yang reaktif (dapat di-mute).
* **Tema Visual Premium:** Dark mode bertema papan catur eksklusif (Emerald/Wood/Modern Slate), tipografi modern (Inter/Plus Jakarta Sans), animasi transisi bidak yang mulus.
* **100% Client-Side / PWA Ready:** Cepat, tanpa jeda loading server, dan dapat diakses dengan mudah di desktop maupun smartphone.

---

### 4. Arsitektur Teknis & Tumpukan Teknologi

```
┌────────────────────────────────────────────────────────┐
│                   Aplikasi Web Svelte 5                │
│                                                        │
│  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │   UI & Layout    │  │     Interactive Board      │  │
│  │  - Sidebar/Nav   │  │  - Svelte Board Component  │  │
│  │  - Opening Cards │  │  - Drag & Drop / Click     │  │
│  │  - Tabs & Badges │  │  - Move History & Arrows   │  │
│  └─────────┬────────┘  └─────────────┬──────────────┘  │
│            │                         │                 │
│  ┌─────────▼─────────────────────────▼──────────────┐  │
│  │                   State Manager                  │  │
│  │    (Svelte 5 Runes: $state, $derived, $effect)   │  │
│  └─────────┬─────────────────────────┬──────────────┘  │
│            │                         │                 │
│  ┌─────────▼────────┐       ┌────────▼──────────────┐  │
│  │    chess.js      │       │     Openings Data     │  │
│  │ (Logic & Rules,  │       │  (JSON/TS Data Store, │  │
│  │  FEN, PGN, SAN)  │       │   Moves, Notes, Plans)│  │
│  └──────────────────┘       └───────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

* **Frontend Framework:** Svelte 5 (menggunakan Runes `$state`, `$derived`, `$props`).
* **Tooling & Bundler:** Vite 8.
* **Chess Rule Engine:** `chess.js` (validasi langkah, parsing SAN, FEN generator, status checkmate/draw).
* **Chess Rendering:** Komponen catur kustom berbasis Svelte + CSS Grid/Flexbox + SVG Piece Assets standar internasional (Cburnett/Lichess style) yang ringan dan tajam pada semua resolusi.
* **Styling:** Modern Vanilla CSS dengan design tokens (`app.css`):
  * Palet Warna: Dark Emerald (`#0f172a`, `#1e293b`, `#10b981`, `#059669`), Gold/Amber accent (`#f59e0b`).
  * Desain: Glassmorphism halus, micro-animations, kartu interaktif.
* **Penyimpanan Data:** Modul data statis TypeScript/JSON lokal yang modular dan mudah ditambah di kemudian hari.

---

### 5. Struktur Skema Data Pembukaan (Data Model Schema)

Setiap pembukaan disimpan dalam format data terstruktur berikut:

```typescript
interface OpeningMove {
  ply: number;             // Langkah ke- (1, 2, 3...)
  san: string;             // Standar Notasi Aljabar, misal "e4", "Nf6"
  fen: string;             // FEN posisi setelah langkah ini
  commentary: string;      // Penjelasan strategis langkah ini (Bahasa Indonesia)
  arrows?: [string, string][]; // Koordinat panah visual, contoh [["e2", "e4"]]
  highlightSquares?: string[]; // Petak kunci yang disorot, contoh ["e4", "d5"]
  isTrapOrBlunderAlert?: string; // Catatan jika ada jebakan populer di langkah ini
}

interface CounterOpening {
  counterName: string;     // Nama variasi/counter pembukaan
  movesSan: string;        // Urutan langkah counter
  whyItWorks: string;      // Alasan strategis counter ini efektif
  targetWeakness: string;  // Titik lemah pembukaan utama yang diserang
}

interface MidEndGameStrategy {
  pawnStructure: string;   // Analisis struktur pion khas
  keyPlans: string[];      // Daftar rencana utama di babak tengah
  piecePlacement: string;  // Penempatan ideal perwira
  endgameTraits: string;   // Karakteristik babak akhir (keuntungan jangka panjang)
}

interface OpeningData {
  id: string;              // slug unik, misal "ruy-lopez"
  name: string;            // Nama resmi pembukaan
  nameId: string;          // Terjemahan/julukan bahasa Indonesia
  side: "white" | "black"; // Dimainkan untuk putih atau hitam
  difficulty: "Pemula" | "Menengah" | "Mahir";
  style: "Taktikal / Agresif" | "Posisional / Solid" | "Universal";
  ecoCode: string;         // Kode ECO, misal "C60"
  summary: string;         // Ringkasan singkat pembukaan
  moves: OpeningMove[];    // Deretan langkah simulasi
  strategy: MidEndGameStrategy; // Panduan mid-to-end game
  counters: CounterOpening[];   // Matriks counter
}
```

---

### 6. Daftar Pembukaan Catur Populer Rilis Awal (Initial Repertoire)

| No | Nama Pembukaan | Sisi | Karakter | Kode ECO | Alasan Dipilih |
|---|---|---|---|---|---|
| 1 | **Ruy Lopez (Pembukaan Spanyol)** | Putih | Posisional / Klasik | C60 - C99 | Pembukaan paling fundamental & paling banyak dimainkan di level master |
| 2 | **Italian Game (Giuoco Piano)** | Putih | Fleksibel / Pemula Ramah | C50 - C54 | Pilihan nomor 1 untuk belajar kontrol pusat cepat & serangan sayap raja |
| 3 | **Queen's Gambit** | Putih | Strategis / Penguasaan Ruang | D06 - D59 | Fondasi utama permainan 1.d4, populer di segala tingkatan |
| 4 | **London System** | Putih | Solid / Terstruktur | D00 - D02 | Sangat populer di kalangan klub karena skema langkah yang konsisten |
| 5 | **Sicilian Defense (Najdorf/Dragon)** | Hitam | Taktikal / Menyerang | B20 - B99 | Tanggapan terpopuler dan paling tajam melawan 1.e4 |
| 6 | **French Defense** | Hitam | Solid / Rantai Pion Tertutup | C00 - C19 | Karakteristik counter-attack sayap menteri yang sangat khas |
| 7 | **Caro-Kann Defense** | Hitam | Sangat Solid / Endgame Kuat | B10 - B19 | Favorit pemain yang menginginkan struktur pion bersih & aman |
| 8 | **King's Indian Defense (KID)** | Hitam | Dinamis / Serangan Balik Brutal | E60 - E99 | Senjata legendaris Garry Kasparov melawan 1.d4 |

---

### 7. Alur Pengguna (User Flow)

1. **Halaman Utama (Dashboard / Katalog Pembukaan):**
   * Pengguna disambut dengan selector: **"Saya Bermain Sebagai: [PUTIH ♔] / [HITAM ♚]"**.
   * Pengguna memfilter berdasarkan gaya (Posisional, Taktikal, Pemula).
   * Pengguna memilih kartu pembukaan (misal: *Italian Game*).
2. **Halaman Studio Pembukaan (Interactive Study Room):**
   * **Sisi Kiri:** Papan Catur Interaktif dengan tombol kendali langkah (`⏮`, `◀`, `▶`, `⏭`, Auto, Flip).
   * **Sisi Kanan:** Panel Tab Informasi Terintegrasi:
     * **Tab 1 - Panduan Langkah:** Menampilkan langkah saat ini, notasi aljabar, dan penjelasan Bahasa Indonesia mengapa langkah ini bagus + peringatan jebakan/blunder.
     * **Tab 2 - Strategi Midgame:** Menampilkan peta jalan babak tengah (struktur pion, rencana serangan, petak perwira ideal).
     * **Tab 3 - Transisi Endgame:** Karakteristik perwira yang harus dipertahankan, potensi pion bebas, dan tips mengunci kemenangan.
     * **Tab 4 - Senjata Counter:** Cara lawan membalas pembukaan ini dan pembukaan tandingan yang paling efektif.
     * **Tab 5 - Mode Tebak Langkah:** Fitur latihan interaktif di mana pengguna mencoba melangkah sendiri untuk menguji daya ingat konsep.

---

### 8. Rencana Implementasi Bertahap (Roadmap)

* **Fase 1: Fondasi & Kebutuhan (PRD & Desain Arsitektur) — *Saat Ini***
  * Finalisasi PRD dan persetujuan alur/fitur.
  * Instalasi library pendukung (`chess.js`).
* **Fase 2: Desain Sistem UI & Komponen Papan Catur**
  * Membangun tema visual elegan catur (Dark Chessboard Theme, Typography, Layout Grid).
  * Pembuatan komponen Svelte untuk Papan Catur SVG interaktif (move highlighter, visual arrows, flip board, sound effect audio).
* **Fase 3: Penyusunan Dataset Pembukaan Komprehensif**
  * Menulis data detail untuk 8 pembukaan utama dengan penjelasan naratif bahasa Indonesia yang mendalam, mencakup data moves, midgame, endgame, dan counter.
* **Fase 4: Integrasi Modul Tab Analisis & Simulasi**
  * Mengintegrasikan step-by-step move narration dengan papan catur.
  * Menyajikan tab Midgame Plans, Endgame Conversion, dan Counter Matrix.
* **Fase 5: Mode Kuis Interaktif & Glosarium**
  * Fitur "Uji Langkah Pembukaan" (Interactive Quiz/Practice).
  * Halaman Glosarium Istilah Catur Indonesia.
* **Fase 6: Testing, Polish, & Responsivitas Mobile**
  * Uji sentuhan pada perangkat mobile (touch controls).
  * Optimasi aksesibilitas dan performa.
