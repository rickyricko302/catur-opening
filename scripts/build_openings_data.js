import fs from 'fs';
import path from 'path';
import { Chess } from 'chess.js';

const rawOpenings = [
  {
    id: "ruy-lopez",
    name: "Ruy Lopez",
    nameId: "Pembukaan Spanyol",
    side: "white",
    difficulty: "Menengah",
    style: "Posisional / Klasik",
    ecoCode: "C60 - C99",
    popularity: 98,
    winRate: { white: 40, draw: 38, black: 22 },
    summary: "Pembukaan tertua dan paling dihormati dalam catur dunia. Putih menekan kuda c6 yang menjadi pelindung pion pusat e5 hitam, menghasilkan pertarungan posisional yang kaya manuver.",
    moves: [
      {
        san: "e4",
        commentary: "Langkah pembuka klasik. Menguasai petak pusat penting d5 dan f5, serta langsung membuka jalur diagonal bagi Menteri (d1-h5) dan Gajah Terang (f1-c4).",
        arrows: [["e2", "e4"]],
        highlightSquares: ["e4", "d5"],
        trapAlert: null
      },
      {
        san: "e5",
        commentary: "Hitam membalas simetris, menghentikan dorongan pion putih ke d4 dan mengontrol petak pusat d4 dan f4.",
        arrows: [["e7", "e5"]],
        highlightSquares: ["e5", "d4"],
        trapAlert: null
      },
      {
        san: "Nf3",
        commentary: "Mengembangkan perwira sayap raja sambil langsung menyerang pion e5 hitam. Mempersiapkan rokade pendek sayap raja secepat mungkin.",
        arrows: [["g1", "f3"], ["f3", "e5"]],
        highlightSquares: ["e5"],
        trapAlert: null
      },
      {
        san: "Nc6",
        commentary: "Hitam mengembangkan Kuda sekaligus melindungi pion e5 yang sedang diincar Kuda putih di f3.",
        arrows: [["b8", "c6"], ["c6", "e5"]],
        highlightSquares: ["e5", "c6"],
        trapAlert: null
      },
      {
        san: "Bb5",
        commentary: "Langkah khas Ruy Lopez! Gajah f1 meluncur ke b5 memberikan tekanan tidak langsung ke pion e5 dengan memaku/mengancam Kuda pembela di c6.",
        arrows: [["f1", "b5"], ["b5", "c6"]],
        highlightSquares: ["b5", "c6"],
        trapAlert: "Catatan: Putih belum bisa langsung memenangkan pion e5 (misal 3...a6 4.Bxc6 dxc6 5.Nxe5? Qd4! memulihkan pion)."
      },
      {
        san: "a6",
        commentary: "Variasi Morphy (3...a6). Hitam langsung menanyakan niat Gajah putih: apakah ingin bertukar perwira atau mundur?",
        arrows: [["a7", "a6"], ["a6", "b5"]],
        highlightSquares: ["a6", "b5"],
        trapAlert: null
      },
      {
        san: "Ba4",
        commentary: "Gajah putih mundur ke a4 untuk mempertahankan tekanan diagonal terhadap Kuda c6 dan sayap menteri hitam.",
        arrows: [["b5", "a4"]],
        highlightSquares: ["a4"],
        trapAlert: null
      },
      {
        san: "Nf6",
        commentary: "Hitam mengembangkan Kuda sayap raja dan balik menyerang pion e4 putih yang belum terlindungi.",
        arrows: [["g8", "f6"], ["f6", "e4"]],
        highlightSquares: ["e4", "f6"],
        trapAlert: null
      },
      {
        san: "O-O",
        commentary: "Putih mengamankan Raja ke posisi aman sayap raja dan mengaktifkan Benteng f1 ke jalur pusat.",
        arrows: [["e1", "g1"]],
        highlightSquares: ["g1", "f1"],
        trapAlert: "Waspada Jebakan: Jika hitam memainkan 8...b5 dan ...Na5 di kemudian hari tanpa persiapan, awas Noah's Ark Trap yang bisa menjebak gajah putih di b3 jika c3 terlambat dimainkan!"
      },
      {
        san: "Be7",
        commentary: "Pertahanan Tertutup (Closed Defense). Hitam mempersiapkan rokade pendek dan menetralisir potensi paku di lajur e.",
        arrows: [["f8", "e7"]],
        highlightSquares: ["e7"],
        trapAlert: null
      },
      {
        san: "Re1",
        commentary: "Benteng mengontrol lajur e yang semi-terbuka sekaligus melindungi pion e4 secara definitif.",
        arrows: [["f1", "e1"]],
        highlightSquares: ["e1", "e4"],
        trapAlert: null
      },
      {
        san: "b5",
        commentary: "Hitam mengusir Gajah putih dari diagonal a4-e8 sebelum melanjutkan ekspansi.",
        arrows: [["b7", "b5"], ["b5", "a4"]],
        highlightSquares: ["b5"],
        trapAlert: null
      },
      {
        san: "Bb3",
        commentary: "Gajah mundur ke b3, mengarahkan moncong serangannya langsung ke petak lemah f7 dekat Raja hitam.",
        arrows: [["a4", "b3"], ["b3", "f7"]],
        highlightSquares: ["b3", "f7"],
        trapAlert: null
      },
      {
        san: "d6",
        commentary: "Hitam memperkuat pion e5 dan membuka jalur bagi Gajah c8.",
        arrows: [["d7", "d6"]],
        highlightSquares: ["d6", "e5"],
        trapAlert: null
      },
      {
        san: "c3",
        commentary: "Langkah persiapan vital khas Ruy Lopez! Mempersiapkan dorongan d4 untuk menguasai pusat papan, sekaligus menyediakan petak perlindungan di c2 jika Gajah diserang ...Na5.",
        arrows: [["c2", "c3"], ["c3", "d4"]],
        highlightSquares: ["c3", "d4", "c2"],
        trapAlert: null
      },
      {
        san: "O-O",
        commentary: "Kedua pihak telah menyelesaikan fase pembukaan dengan solid. Permainan kini memasuki pertarungan strategi midgame bertempo tinggi.",
        arrows: [["e8", "g8"]],
        highlightSquares: ["g8"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Struktur pion fleksibel di mana Putih biasanya membangun rantai c3-d4-e4. Pusat papan bisa tetap tegang atau tertutup jika d4-d5 dimainkan.",
      keyPlans: [
        "Manuver Kuda Spanyol legendaris: Nb1 -> d2 -> f1 -> g3/e3 untuk bergabung dalam serangan badai ke sayap raja hitam.",
        "Mempersiapkan terobosan d4 untuk merebut kontrol pusat penuh.",
        "Mempertahankan Gajah Terang b3/c2 sebagai senjata jarak jauh yang mematikan ke arah Raja lawan.",
        "Mencegah terobosan hitam ...d5 atau mengeksploitasi sayap menteri jika hitam terlalu banyak memajukan pion (a4 break)."
      ],
      piecePlacement: "Kuda Putih idealnya berada di g3/f5. Gajah Terang di c2, Gajah Gelap di e3 atau g5. Benteng di e1 dan d1.",
      endgameTraits: "Dalam babak akhir Ruy Lopez, sepasang Gajah putih sangat bernilai jika posisi terbuka. Putih sering memiliki keuntungan struktur pion yang lebih kompak dibanding sayap menteri hitam yang sedikit renggang."
    },
    counters: [
      {
        counterName: "Berlin Defense (Dinding Berlin)",
        movesSan: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6",
        whyItWorks: "Dikenal sebagai 'The Berlin Wall' yang dipopulerkan Vladimir Kramnik saat mengalahkan Garry Kasparov. Hitam langsung menekan e4 dan memaksakan endgame tanpa menteri yang sangat solid dan sulit ditembus.",
        targetWeakness: "Menghilangkan inisiatif menyerang putih di babak tengah dan memaksa permainan langsung ke babak akhir yang kering dan seimbang."
      },
      {
        counterName: "Marshall Attack",
        movesSan: "8...d5!? (setelah 8.c3)",
        whyItWorks: "Pengorbanan pion agresif oleh hitam untuk mendapatkan keunggulan perkembangan perwira dan inisiatif serangan balasan brutal terhadap Raja putih.",
        targetWeakness: "Memanfaatkan posisi raja putih yang belum memiliki pelindung cukup di f2/h2 untuk melancarkan serangan kombinasi kilat."
      }
    ],
    quiz: [
      {
        question: "Setelah 1.e4 e5 2.Nf3 Nc6, apa langkah resmi pembuka Ruy Lopez?",
        correctSan: "Bb5",
        hint: "Gajah putih meluncur ke petak b5 untuk menekan kuda pelindung pion e5.",
        explanation: "3.Bb5 adalah langkah kunci Ruy Lopez yang membedakannya dari Italian Game (3.Bc4)."
      },
      {
        question: "Setelah 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6, apa langkah persiapan krusial putih untuk menguasai pusat?",
        correctSan: "c3",
        hint: "Pion c dimajukan satu langkah untuk menyiapkan dorongan d4 dan memberi ruang gajah di c2.",
        explanation: "7.c3 mempersiapkan d4 sekaligus mengamankan petak mundur c2 untuk gajah terang putih."
      }
    ]
  },
  {
    id: "italian-game",
    name: "Italian Game",
    nameId: "Pembukaan Italia (Giuoco Piano)",
    side: "white",
    difficulty: "Pemula",
    style: "Universal / Fleksibel",
    ecoCode: "C50 - C54",
    popularity: 96,
    winRate: { white: 41, draw: 34, black: 25 },
    summary: "Salah satu pembukaan catur tertua yang paling ideal bagi pemula hingga master. Mengembangkan perwira secara alami dan langsung membidik petak terlemah hitam di f7.",
    moves: [
      {
        san: "e4",
        commentary: "Langkah pembuka standar untuk penguasaan petak pusat d5 dan membuka diagonal perwira.",
        arrows: [["e2", "e4"]],
        highlightSquares: ["e4", "d5"],
        trapAlert: null
      },
      {
        san: "e5",
        commentary: "Hitam merespons simetris untuk menjaga keseimbangan petak pusat d4.",
        arrows: [["e7", "e5"]],
        highlightSquares: ["e5"],
        trapAlert: null
      },
      {
        san: "Nf3",
        commentary: "Kuda berkembang menyerang pion e5 hitam dan menyiapkan rokade pendek.",
        arrows: [["g1", "f3"], ["f3", "e5"]],
        highlightSquares: ["e5"],
        trapAlert: null
      },
      {
        san: "Nc6",
        commentary: "Hitam mengembangkan Kuda sekaligus melindungi pion e5.",
        arrows: [["b8", "c6"], ["c6", "e5"]],
        highlightSquares: ["e5"],
        trapAlert: null
      },
      {
        san: "Bc4",
        commentary: "Langkah identitas Italian Game! Gajah menempati c4 dan langsung membidik petak terlemah hitam f7 (yang hanya dijaga oleh Raja).",
        arrows: [["f1", "c4"], ["c4", "f7"]],
        highlightSquares: ["c4", "f7"],
        trapAlert: "Catatan: Petak f7 adalah target serangan taktis utama dalam hampir semua variasi Italia (seperti Fried Liver Attack jika hitam main 3...Nf6 4.Ng5)."
      },
      {
        san: "Bc5",
        commentary: "Giuoco Piano (Permainan Tenang). Hitam membalas dengan mengembangkan Gajah ke c5 dan mengontrol petak d4.",
        arrows: [["f8", "c5"], ["c5", "d4"]],
        highlightSquares: ["c5"],
        trapAlert: null
      },
      {
        san: "c3",
        commentary: "Putih berniat membangun pusat pion ideal (c3 diikuti d4). Alternatif lain adalah Giuoco Pianissimo dengan 4.d3.",
        arrows: [["c2", "c3"], ["c3", "d4"]],
        highlightSquares: ["c3", "d4"],
        trapAlert: null
      },
      {
        san: "Nf6",
        commentary: "Hitam mengembangkan Kuda menyerang pion e4 putih sambil bersiap rokade.",
        arrows: [["g8", "f6"], ["f6", "e4"]],
        highlightSquares: ["e4"],
        trapAlert: null
      },
      {
        san: "d3",
        commentary: "Melindungi pion e4 secara solid dan membuka jalan bagi Gajah c1. Formasi ini menciptakan posisi Giuoco Pianissimo yang kaya strategi.",
        arrows: [["d2", "d3"]],
        highlightSquares: ["d3", "e4"],
        trapAlert: null
      },
      {
        san: "d6",
        commentary: "Hitam memperkuat pion e5 dan membuka diagonal untuk Gajah terang c8.",
        arrows: [["d7", "d6"]],
        highlightSquares: ["d6"],
        trapAlert: null
      },
      {
        san: "O-O",
        commentary: "Putih menyelesaikan rokade, Raja aman di sayap raja dan Benteng siap beroperasi.",
        arrows: [["e1", "g1"]],
        highlightSquares: ["g1"],
        trapAlert: null
      },
      {
        san: "O-O",
        commentary: "Hitam juga melakukan rokade. Posisi simetris tetapi putih memiliki inisiatif giliran melangkah.",
        arrows: [["e8", "g8"]],
        highlightSquares: ["g8"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Pusat tertutup atau semi-terbuka dengan pion putih di c3-d3-e4 melawan c7-d6-e5. Kedua pihak saling berebut petak d4 dan d5.",
      keyPlans: [
        "Mengarahkan Gajah Terang ke petak mundur b3/c2 agar tidak tertukar oleh Kuda hitam (...Na5).",
        "Manuver Kuda sayap menteri: Nb1 -> d2 -> f1 -> g3 untuk bergabung menyerang sayap raja hitam.",
        "Memaku Kuda f6 hitam dengan Bg5 setelah hitam rokade.",
        "Mempersiapkan terobosan d4 pada saat yang tepat untuk membuka posisi."
      ],
      piecePlacement: "Kuda di f3 dan g3. Gajah c4/b3 menekan f7. Gajah c1 meluncur ke g5 atau e3. Benteng di e1.",
      endgameTraits: "Posisi babak akhir biasanya sangat seimbang. Penguasaan lajur terbuka atau memiliki keunggulan sepasang Gajah menjadi kunci kemenangan."
    },
    counters: [
      {
        counterName: "Two Knights Defense (Pertahanan Dua Kuda)",
        movesSan: "3...Nf6 (menggantikan 3...Bc5)",
        whyItWorks: "Langsung menyerang balik pion e4 putih tanpa membiarkan putih santai membangun pusat. Jika putih nekat main 4.Ng5, hitam membalas dengan kontra-serangan tajam 4...d5!",
        targetWeakness: "Memaksa putih memilih antara bertahan pasif atau memasuki komplikasi taktis tajam di mana hitam unggul inisiatif."
      },
      {
        counterName: "Hungarian Defense",
        movesSan: "3...Be7",
        whyItWorks: "Pilihan super solid yang langsung menghentikan semua trik serangan putih di f7 dan menghindari komplikasi taktis liar.",
        targetWeakness: "Membuat rencana serangan sayap raja putih menjadi tidak efektif dan memaksa permainan posisional yang lambat."
      }
    ],
    quiz: [
      {
        question: "Setelah 1.e4 e5 2.Nf3 Nc6, ke petak mana Gajah putih melangkah dalam Italian Game?",
        correctSan: "Bc4",
        hint: "Gajah mengincar petak f7 yang rentan dekat raja hitam.",
        explanation: "3.Bc4 mendefinisikan Italian Game dengan langsung membidik titik lemah f7."
      }
    ]
  },
  {
    id: "queens-gambit",
    name: "Queen's Gambit",
    nameId: "Gambit Menteri",
    side: "white",
    difficulty: "Menengah",
    style: "Posisional / Solid",
    ecoCode: "D06 - D59",
    popularity: 95,
    winRate: { white: 43, draw: 36, black: 21 },
    summary: "Fondasi paling agung dalam permainan catur posisi tertutup 1.d4. Putih menawarkan pion c4 untuk mengalihkan pion d5 hitam demi merebut kendali mutlak di pusat papan.",
    moves: [
      {
        san: "d4",
        commentary: "Langkah pembuka tertutup paling populer. Menguasai petak e5 dan c5 secara kokoh serta membuka jalur Gajah Gelap.",
        arrows: [["d2", "d4"]],
        highlightSquares: ["d4", "e5"],
        trapAlert: null
      },
      {
        san: "d5",
        commentary: "Hitam membalas simetris untuk mengontrol petak e4 dan mencegah putih langsung menguasai pusat.",
        arrows: [["d7", "d5"]],
        highlightSquares: ["d5", "e4"],
        trapAlert: null
      },
      {
        san: "c4",
        commentary: "Langkah deklarasi Queen's Gambit! Putih menawarkan pion c4. Ini bukan pengorbanan sejati karena jika hitam makan (2...dxc4), putih mudah merebutnya kembali.",
        arrows: [["c2", "c4"], ["c4", "d5"]],
        highlightSquares: ["c4", "d5"],
        trapAlert: "Penting: Jika hitam mencoba mempertahankan pion c4 dengan ...b5, putih akan menghancurkannya dengan a4! c6 axb5 cxb5?? Qf3! memenangkan benteng a8 hitam."
      },
      {
        san: "e6",
        commentary: "Queen's Gambit Declined (Ditolak). Pilihan paling solid dan legendaris. Hitam memperkokoh d5 dengan rantai pion.",
        arrows: [["e7", "e6"], ["e6", "d5"]],
        highlightSquares: ["e6", "d5"],
        trapAlert: null
      },
      {
        san: "Nc3",
        commentary: "Kuda berkembang ke petak terbaiknya, menambah tekanan ke petak pusat d5 dan e4.",
        arrows: [["b1", "c3"], ["c3", "d5"], ["c3", "e4"]],
        highlightSquares: ["c3", "d5"],
        trapAlert: null
      },
      {
        san: "Nf6",
        commentary: "Hitam mengembangkan Kuda untuk menjaga d5 dan mengontrol e4.",
        arrows: [["g8", "f6"], ["f6", "d5"]],
        highlightSquares: ["d5", "e4"],
        trapAlert: null
      },
      {
        san: "cxd5",
        commentary: "Variasi Pertukaran (Exchange Variation). Putih mengklarifikasi struktur pusat dan menciptakan struktur pion Carlsbad yang terkenal.",
        arrows: [["c4", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "exd5",
        commentary: "Hitam membalas makan dengan pion e6, membuka kembali diagonal Gajah c8 namun meninggalkan struktur Carlsbad.",
        arrows: [["e6", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "Bg5",
        commentary: "Gajah memaku Kuda f6 hitam terhadap Menteri d8, melemahkan kendali hitam atas petak d5 dan e4.",
        arrows: [["c1", "g5"], ["g5", "f6"]],
        highlightSquares: ["g5", "f6"],
        trapAlert: "Elephant Trap: Hati-hati jebakan gajah jika 7.Nxd5?? Nxd5! 8.Bxd8 Bb4+ 9.Qd2 Bxd2+ 10.Kxd2 Kxd8 dan hitam unggul 1 perwira!"
      },
      {
        san: "Be7",
        commentary: "Hitam melepaskan paku pada Kuda dan bersiap melakukan rokade.",
        arrows: [["f8", "e7"]],
        highlightSquares: ["e7"],
        trapAlert: null
      },
      {
        san: "e3",
        commentary: "Putih memperkuat pion d4 dan membuka jalan bagi Gajah Terang f1 untuk berkembang.",
        arrows: [["e2", "e3"]],
        highlightSquares: ["e3", "d4"],
        trapAlert: null
      },
      {
        san: "O-O",
        commentary: "Raja hitam aman di sayap raja. Fase pembukaan selesai dengan pertarungan posisional khas Carlsbad siap dimulai.",
        arrows: [["e8", "g8"]],
        highlightSquares: ["g8"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Struktur Carlsbad klasik: Putih memiliki pion d4 dan e3 di pusat dengan lajur c semi-terbuka; Hitam memiliki pion d5 dan c6 dengan lajur e semi-terbuka.",
      keyPlans: [
        "Serangan Minoritas (Minority Attack): Putih memajukan pion b4-b5 didukung a4 dan Rb1 untuk merusak struktur pion sayap menteri hitam dan menciptakan pion c6 lemah.",
        "Terobosan Pusat e4: Mendukung dorongan e4 dengan f3 dan e3 untuk mendominasi seluruh pusat papan.",
        "Menempatkan Kuda di petak pangkalan strategis e5 didukung f4.",
        "Mengontrol lajur c dengan Benteng."
      ],
      piecePlacement: "Gajah putih di d3 dan g5 (atau f4). Kuda di c3 dan f3 (atau e2). Menteri di c2. Benteng di b1 dan c1.",
      endgameTraits: "Di babak akhir, pion c6 hitam yang terisolasi atau terbelakang di lajur semi-terbuka sering menjadi target empuk bagi Benteng dan Raja putih untuk mengonversi kemenangan."
    },
    counters: [
      {
        counterName: "Slav Defense (Pertahanan Slav)",
        movesSan: "2...c6 (menggantikan 2...e6)",
        whyItWorks: "Hitam memperkuat d5 tanpa mengurung Gajah terang c8 di belakang rantai pion. Sangat solid dan menjadi pilihan utama banyak juara dunia.",
        targetWeakness: "Gajah c8 hitam bebas bergerak ke f5 atau g4, menghindari problem klasik gajah pasif di Queen's Gambit Declined."
      },
      {
        counterName: "Albin Counter-Gambit",
        movesSan: "2...e5!?",
        whyItWorks: "Balasan agresif penuh kejutan! Hitam mengorbankan pion di e5 untuk memasukkan pion ke d4 dan menciptakan jebakan taktis mematikan (Lasker Trap).",
        targetWeakness: "Membongkar rencana posisi putih yang tenang dan memaksa kalkulasi taktis tajam sejak langkah kedua."
      }
    ],
    quiz: [
      {
        question: "Setelah 1.d4 d5, apa langkah karakteristik penawaran pion dalam Queen's Gambit?",
        correctSan: "c4",
        hint: "Pion sayap c dimajukan untuk merongrong kontrol pion pusat d5 lawan.",
        explanation: "2.c4 adalah Queen's Gambit, menantang kontrol d5 hitam demi keunggulan pusat putih."
      }
    ]
  },
  {
    id: "london-system",
    name: "London System",
    nameId: "Sistem London",
    side: "white",
    difficulty: "Pemula",
    style: "Posisional / Solid",
    ecoCode: "D00 - D02",
    popularity: 97,
    winRate: { white: 42, draw: 37, black: 21 },
    summary: "Sistem pembukaan paling praktis dan solid untuk Putih. Mengembangkan Gajah gelap ke f4 sebelum menutup rantai pion dengan e3, menghasilkan piramida pertahanan yang kokoh melawan hampir semua balasan Hitam.",
    moves: [
      {
        san: "d4",
        commentary: "Langkah awal penguasaan petak e5 dan c5.",
        arrows: [["d2", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "d5",
        commentary: "Hitam menduduki petak pusat d5.",
        arrows: [["d7", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "Bf4",
        commentary: "Langkah khas Sistem London! Mengembangkan Gajah di luar rantai pion sebelum memainkan e3. Gajah di f4 mengontrol diagonal c1-h6 yang strategis.",
        arrows: [["c1", "f4"]],
        highlightSquares: ["f4"],
        trapAlert: null
      },
      {
        san: "Nf6",
        commentary: "Hitam mengembangkan perwira dan mengontrol petak e4.",
        arrows: [["g8", "f6"]],
        highlightSquares: ["f6", "e4"],
        trapAlert: null
      },
      {
        san: "e3",
        commentary: "Mengunci Gajah f4 di luar piramida pion dan membuka jalan bagi Gajah Terang f1.",
        arrows: [["e2", "e3"]],
        highlightSquares: ["e3", "d4"],
        trapAlert: null
      },
      {
        san: "c5",
        commentary: "Hitam menantang pusat d4 putih secara aktif di sayap menteri.",
        arrows: [["c7", "c5"], ["c5", "d4"]],
        highlightSquares: ["c5", "d4"],
        trapAlert: null
      },
      {
        san: "c3",
        commentary: "Membentuk piramida pion kokoh b2-c3-d4-e3 yang menjadi benteng pertahanan legendaris London System.",
        arrows: [["c2", "c3"]],
        highlightSquares: ["c3", "d4"],
        trapAlert: null
      },
      {
        san: "Nc6",
        commentary: "Hitam menambah tekanan pada petak pusat d4.",
        arrows: [["b8", "c6"], ["c6", "d4"]],
        highlightSquares: ["c6"],
        trapAlert: null
      },
      {
        san: "Nd2",
        commentary: "Kuda berkembang ke d2 agar tidak menghalangi pion c3 dan bersiap mendukung loncatan Ne5.",
        arrows: [["b1", "d2"]],
        highlightSquares: ["d2", "e4"],
        trapAlert: null
      },
      {
        san: "e6",
        commentary: "Hitam memperkuat pusat dan bersiap mengembangkan Gajah gelap f8.",
        arrows: [["e7", "e6"]],
        highlightSquares: ["e6"],
        trapAlert: null
      },
      {
        san: "Ngf3",
        commentary: "Menyempurnakan perkembangan perwira ringan sayap raja.",
        arrows: [["g1", "f3"]],
        highlightSquares: ["f3", "e5"],
        trapAlert: null
      },
      {
        san: "Bd6",
        commentary: "Hitam menantang Gajah kuat London putih di f4.",
        arrows: [["f8", "d6"], ["d6", "f4"]],
        highlightSquares: ["d6", "f4"],
        trapAlert: null
      },
      {
        san: "Bg3",
        commentary: "Putih tidak memakan gajah di d6 melainkan mundur ke g3. Jika hitam makan hxg3, lajur h akan terbuka untuk Benteng putih menyerang Raja hitam!",
        arrows: [["f4", "g3"]],
        highlightSquares: ["g3", "h1"],
        trapAlert: "Trik London: Jika hitam memainkan ...Bxg3, balas dengan hxg3! Jangan pernah takut, karena lajur h terbuka bagi benteng putih untuk menyerang sayap raja hitam."
      },
      {
        san: "O-O",
        commentary: "Hitam melakukan rokade. Putih siap melancarkan rencana serangan Ne5.",
        arrows: [["e8", "g8"]],
        highlightSquares: ["g8"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Piramida pion super kokoh c3-d4-e3 yang sangat tahan banting terhadap gempuran lawan di pusat.",
      keyPlans: [
        "Menancapkan Kuda ke petak pangkalan (outpost) e5, sering kali didukung f4 (Stonewall setup mini).",
        "Menyerang Raja hitam di sayap raja menggunakan kombinasi Ne5, Qf3/Qh5, dan dorongan h4 jika gajah ditukar di g3.",
        "Mempertahankan kontrol petak pusat e5 dan mencegah hitam melakukan terobosan ...e5."
      ],
      piecePlacement: "Kuda di e5 dan f3. Gajah di d3 dan g3. Menteri di c2 atau f3. Benteng di e1 atau h1.",
      endgameTraits: "London System menghasilkan endgame yang sangat solid dan minim kelemahan pion bagi Putih. Kuda di e5 sering kali mendominasi perwira minor hitam di babak akhir."
    },
    counters: [
      {
        counterName: "Serangan Awal c5 & Qb6",
        movesSan: "1.d4 d5 2.Bf4 c5 3.e3 Nc6 4.c3 Qb6!",
        whyItWorks: "Karena Gajah gelap putih telah meninggalkan sayap menteri (c1) ke f4, petak b2 menjadi tidak terjaga. Menteri hitam langsung mengeksploitasi b2 dan memberi tekanan kuat ke d4.",
        targetWeakness: "Petak b2 dan d4 yang ditinggalkan Gajah c1 sebelum putih sempat menyelesaikan perkembangan perwiranya."
      },
      {
        counterName: "Setup King's Indian / Grunfeld",
        movesSan: "1...Nf6 2...g6 3...Bg7 4...d6 & ...e5",
        whyItWorks: "Menempatkan gajah di g7 menumpulkan Gajah f4 putih dan menyiapkan pembongkaran pusat dengan ...e5.",
        targetWeakness: "Gajah f4 putih tidak memiliki target empuk di rantai pion hitam dan sering dipaksa bertukar atau menjadi pasif."
      }
    ],
    quiz: [
      {
        question: "Setelah 1.d4 d5, langkah perwira apa yang menjadi ciri khas London System?",
        correctSan: "Bf4",
        hint: "Gajah gelap keluar ke petak aktif di sayap raja sebelum pion e dimajukan.",
        explanation: "2.Bf4 adalah inti filosofi London System, mengaktifkan gajah gelap sebelum rantai pion e3 tertutup."
      }
    ]
  },
  {
    id: "scotch-game",
    name: "Scotch Game",
    nameId: "Pembukaan Skotlandia",
    side: "white",
    difficulty: "Menengah",
    style: "Taktikal / Agresif",
    ecoCode: "C45",
    popularity: 91,
    winRate: { white: 41, draw: 35, black: 24 },
    summary: "Alternatif tajam dan terbuka untuk putih melawan 1...e5. Pada langkah ke-3 putih langsung membongkar pusat dengan 3.d4, menghasilkan posisi terbuka penuh dinamika perwira.",
    moves: [
      {
        san: "e4",
        commentary: "Langkah pembuka menguasai pusat.",
        arrows: [["e2", "e4"]],
        highlightSquares: ["e4"],
        trapAlert: null
      },
      {
        san: "e5",
        commentary: "Hitam membalas simetris.",
        arrows: [["e7", "e5"]],
        highlightSquares: ["e5"],
        trapAlert: null
      },
      {
        san: "Nf3",
        commentary: "Kuda menyerang pion e5.",
        arrows: [["g1", "f3"], ["f3", "e5"]],
        highlightSquares: ["e5"],
        trapAlert: null
      },
      {
        san: "Nc6",
        commentary: "Kuda menjaga pion e5.",
        arrows: [["b8", "c6"]],
        highlightSquares: ["e5"],
        trapAlert: null
      },
      {
        san: "d4",
        commentary: "Langkah Scotch Game! Putih tidak menunggu lama dan langsung meledakkan pusat di langkah ke-3.",
        arrows: [["d2", "d4"], ["d4", "e5"]],
        highlightSquares: ["d4", "e5"],
        trapAlert: null
      },
      {
        san: "exd4",
        commentary: "Hitam terpaksa memakan pion d4 karena jika dibiarkan putih akan mendominasi pusat.",
        arrows: [["e5", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "Nxd4",
        commentary: "Kuda putih memakan kembali di d4, menduduki pusat papan dengan megah.",
        arrows: [["f3", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "Bc5",
        commentary: "Variasi Klasik. Hitam langsung mengembangkan Gajah sambil menyerang Kuda d4 putih.",
        arrows: [["f8", "c5"], ["c5", "d4"]],
        highlightSquares: ["c5", "d4"],
        trapAlert: null
      },
      {
        san: "Be3",
        commentary: "Putih memperkuat Kuda d4 sekaligus mengancam taktik mematikan Nxc6 disusul Bxc5.",
        arrows: [["c1", "e3"], ["e3", "d4"]],
        highlightSquares: ["e3", "d4"],
        trapAlert: "Awas Taktik: Putih mengancam 8.Nxc6 bxc6 9.Bxc5 memenangkan perwira jika hitam tidak waspada."
      },
      {
        san: "Qf6",
        commentary: "Menteri hitam menambah perlindungan ke c5 dan menambah tekanan ketiga ke Kuda d4.",
        arrows: [["d8", "f6"], ["f6", "d4"]],
        highlightSquares: ["f6", "d4"],
        trapAlert: null
      },
      {
        san: "c3",
        commentary: "Putih memperkokoh Kuda d4 dengan pion c3.",
        arrows: [["c2", "c3"], ["c3", "d4"]],
        highlightSquares: ["c3", "d4"],
        trapAlert: null
      },
      {
        san: "Nge7",
        commentary: "Kuda hitam berkembang ke e7 agar tidak menghalangi diagonal Menteri di f6.",
        arrows: [["g8", "e7"]],
        highlightSquares: ["e7"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Pusat terbuka lebar di lajur d. Putih memiliki keunggulan ruang di lajur e dengan pion e4 melawan d6/d7.",
      keyPlans: [
        "Memanfaatkan perwira yang aktif di pusat (d4 dan e3) untuk mendikte arah permainan.",
        "Mengembangkan Gajah c4 dan melakukan rokade cepat.",
        "Melancarkan serangan f4-f5 jika posisi memungkinkan untuk menggilas sayap raja."
      ],
      piecePlacement: "Kuda di d4 dan c3. Gajah di c4 dan e3. Benteng di d1 dan e1.",
      endgameTraits: "Karena pusat terbuka sejak langkah ke-3, pertukaran perwira sering terjadi lebih cepat. Pemain yang menguasai lajur terbuka d dan memiliki raja lebih aktif akan unggul di babak akhir."
    },
    counters: [
      {
        counterName: "Mieses Variation (4...Nf6)",
        movesSan: "4...Nf6 5.Nxc6 bxc6 6.e5 Qe7!",
        whyItWorks: "Menyerang pion e4 putih seketika. Saat putih mendorong 6.e5, hitam memaku pion tersebut dengan 6...Qe7!",
        targetWeakness: "Pion e5 putih terpaku ke Raja di e1 sehingga tidak bisa memakan Kuda f6 hitam, memberi hitam inisiatif taktis."
      }
    ],
    quiz: [
      {
        question: "Setelah 1.e4 e5 2.Nf3 Nc6, apa langkah khas putih untuk membuka Scotch Game?",
        correctSan: "d4",
        hint: "Pion d dimajukan dua langkah untuk langsung membongkar pusat.",
        explanation: "3.d4 adalah langkah penentu Scotch Game, memicu pertukaran pion di pusat."
      }
    ]
  },
  {
    id: "english-opening",
    name: "English Opening",
    nameId: "Pembukaan Inggris",
    side: "white",
    difficulty: "Menengah",
    style: "Posisional / Solid",
    ecoCode: "A10 - A39",
    popularity: 90,
    winRate: { white: 42, draw: 38, black: 20 },
    summary: "Pembukaan flank (sayap) paling fleksibel di mana Putih mengontrol petak pusat d5 menggunakan pion sayap 1.c4 tanpa langsung menentukan nasib pion pusat d dan e.",
    moves: [
      {
        san: "c4",
        commentary: "Langkah pembuka Inggris. Mengontrol petak strategis d5 dari sayap dan memberi ruang manuver bagi Menteri di lajur c.",
        arrows: [["c2", "c4"]],
        highlightSquares: ["c4", "d5"],
        trapAlert: null
      },
      {
        san: "e5",
        commentary: "Reversed Sicilian! Hitam merespons seperti pemain putih di Sicilian Defense, menguasai petak d4.",
        arrows: [["e7", "e5"]],
        highlightSquares: ["e5", "d4"],
        trapAlert: null
      },
      {
        san: "Nc3",
        commentary: "Kuda berkembang dan memperkuat kontrol atas petak d5 dan e4.",
        arrows: [["b1", "c3"], ["c3", "d5"]],
        highlightSquares: ["c3", "d5"],
        trapAlert: null
      },
      {
        san: "Nf6",
        commentary: "Hitam mengembangkan perwira dan mengontrol d5 serta e4.",
        arrows: [["g8", "f6"]],
        highlightSquares: ["f6", "d5"],
        trapAlert: null
      },
      {
        san: "g3",
        commentary: "Menyiapkan Fianchetto Gajah ke g2 untuk memancarkan kontrol dahsyat di sepanjang diagonal a8-h1.",
        arrows: [["g2", "g3"]],
        highlightSquares: ["g3", "g2"],
        trapAlert: null
      },
      {
        san: "d5",
        commentary: "Hitam merebut ruang di pusat papan.",
        arrows: [["d7", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "cxd5",
        commentary: "Pertukaran pion sayap putih dengan pion pusat hitam, memberikan keuntungan struktural jangka panjang bagi putih.",
        arrows: [["c4", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "Nxd5",
        commentary: "Hitam memakan kembali dengan Kuda.",
        arrows: [["f6", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "Bg2",
        commentary: "Gajah fianchetto mendarat di g2 dan langsung menekan Kuda d5 hitam.",
        arrows: [["f1", "g2"], ["g2", "d5"]],
        highlightSquares: ["g2", "d5"],
        trapAlert: null
      },
      {
        san: "Nb6",
        commentary: "Kuda mundur ke b6 untuk menghindari tekanan gajah g2.",
        arrows: [["d5", "b6"]],
        highlightSquares: ["b6"],
        trapAlert: null
      },
      {
        san: "Nf3",
        commentary: "Putih mengembangkan Kuda kedua dan bersiap rokade pendek.",
        arrows: [["g1", "f3"]],
        highlightSquares: ["f3", "e5"],
        trapAlert: null
      },
      {
        san: "Nc6",
        commentary: "Hitam melindungi pion e5 dan mengembangkan perwira.",
        arrows: [["b8", "c6"]],
        highlightSquares: ["c6", "e5"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Putih menukar pion c4 dengan pion d5 hitam, sehingga putih memiliki 2 pion pusat (d & e) melawan 1 pion pusat hitam (e). Keuntungan pusat untuk putih.",
      keyPlans: [
        "Mengeksploitasi diagonal panjang h1-a8 menggunakan Gajah g2.",
        "Ekspansi sayap menteri dengan a3 dan b4.",
        "Mengontrol lajur semi-terbuka c dengan Benteng."
      ],
      piecePlacement: "Gajah di g2. Kuda di c3 dan f3. Benteng di c1 dan b1.",
      endgameTraits: "Keunggulan mayoritas pion pusat putih (2 vs 1) sering kali menjadi faktor pembeda kemenangan saat memasuki babak akhir."
    },
    counters: [
      {
        counterName: "Aglo-Scandinavian / Botvinnik System",
        movesSan: "1...c5 (Symmetrical Defense)",
        whyItWorks: "Membalas simetris dan meniru strategi putih untuk meniadakan keunggulan psikologis pembukaan sayap putih.",
        targetWeakness: "Membatasi potensi serangan putih dan mengarahkan permainan ke adu strategi murni yang sangat berimbang."
      }
    ],
    quiz: [
      {
        question: "Langkah pembuka apa yang menjadi ciri English Opening?",
        correctSan: "c4",
        hint: "Pion sayap c maju 2 langkah untuk menguasai petak pusat d5.",
        explanation: "1.c4 adalah English Opening, mengendalikan pusat d5 tanpa menyentuh pion e atau d."
      }
    ]
  },
  // BLACK REPERTOIRE
  {
    id: "sicilian-defense",
    name: "Sicilian Defense",
    nameId: "Pertahanan Sisilia (Najdorf / Open)",
    side: "black",
    difficulty: "Mahir",
    style: "Taktikal / Agresif",
    ecoCode: "B20 - B99",
    popularity: 99,
    winRate: { white: 37, draw: 34, black: 29 },
    summary: "Senjata paling mematikan dan paling populer untuk Hitam melawan 1.e4. Hitam langsung menciptakan asimetri posisi dengan 1...c5, mengincar pertarungan taktis tajam untuk memenangkan permainan, bukan sekadar remis.",
    moves: [
      {
        san: "e4",
        commentary: "Putih menguasai pusat dan membuka jalur perwira.",
        arrows: [["e2", "e4"]],
        highlightSquares: ["e4"],
        trapAlert: null
      },
      {
        san: "c5",
        commentary: "Langkah khas Sisilia! Hitam menantang petak d4 dari sayap c. Menghasilkan pertarungan asimetris di mana hitam berniat menukar pion sayap c dengan pion pusat d putih.",
        arrows: [["c7", "c5"], ["c5", "d4"]],
        highlightSquares: ["c5", "d4"],
        trapAlert: null
      },
      {
        san: "Nf3",
        commentary: "Putih mempersiapkan terobosan pusat d4 (Open Sicilian).",
        arrows: [["g1", "f3"], ["f3", "d4"]],
        highlightSquares: ["f3", "d4"],
        trapAlert: null
      },
      {
        san: "d6",
        commentary: "Hitam mengontrol petak e5 dan c5 serta membuka diagonal untuk Gajah terang c8.",
        arrows: [["d7", "d6"]],
        highlightSquares: ["d6", "e5"],
        trapAlert: null
      },
      {
        san: "d4",
        commentary: "Putih membuka pusat sesuai rencana.",
        arrows: [["d2", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "cxd4",
        commentary: "Pertukaran fundamental! Hitam menukar pion sayap c dengan pion pusat d putih. Hitam kini memiliki 2 pion pusat (e & d) melawan 1 pion pusat putih (e).",
        arrows: [["c5", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "Nxd4",
        commentary: "Kuda putih menduduki d4.",
        arrows: [["f3", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "Nf6",
        commentary: "Hitam mengembangkan Kuda menyerang pion e4 putih yang tidak terjaga.",
        arrows: [["g8", "f6"], ["f6", "e4"]],
        highlightSquares: ["f6", "e4"],
        trapAlert: null
      },
      {
        san: "Nc3",
        commentary: "Kuda putih melindungi e4 dan memperkuat kontrol pusat.",
        arrows: [["b1", "c3"], ["c3", "e4"]],
        highlightSquares: ["c3", "e4"],
        trapAlert: null
      },
      {
        san: "a6",
        commentary: "Langkah magis Variasi Najdorf! Langkah kecil dengan dampak raksasa: mencegah Kuda/Gajah putih melompat ke b5, sekaligus mempersiapkan ekspansi sayap menteri ...b5.",
        arrows: [["a7", "a6"]],
        highlightSquares: ["a6", "b5"],
        trapAlert: "Catatan Kunci: 5...a6 mengendalikan petak b5 secara mutlak. Variasi Najdorf adalah senjata favorit Garry Kasparov dan Bobby Fischer."
      },
      {
        san: "Be3",
        commentary: "English Attack setup. Putih bersiap melancarkan serangan badai pion f3, g4, h4 ke sayap raja hitam.",
        arrows: [["c1", "e3"]],
        highlightSquares: ["e3"],
        trapAlert: null
      },
      {
        san: "e5",
        commentary: "Hitam merebut ruang di pusat dan mengusir Kuda d4, menerima kelemahan petak d5 demi aktivitas perwira yang dinamis.",
        arrows: [["e7", "e5"], ["e5", "d4"]],
        highlightSquares: ["e5", "d5"],
        trapAlert: null
      },
      {
        san: "Nb3",
        commentary: "Kuda mundur ke b3 menghindari ancaman pion hitam.",
        arrows: [["d4", "b3"]],
        highlightSquares: ["b3"],
        trapAlert: null
      },
      {
        san: "Be6",
        commentary: "Gajah mengontrol petak d5 yang lemah dan menyelesaikan perkembangan penting.",
        arrows: [["c8", "e6"]],
        highlightSquares: ["e6", "d5"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Hitam memiliki keunggulan 2 pion pusat di d6 dan e5/e6 serta lajur c semi-terbuka. Putih memiliki petak pangkalan d5.",
      keyPlans: [
        "Counter-attack cepat di sayap menteri: mendorong ...b5, ...b4, dan menempatkan Benteng di lajur terbuka c.",
        "Mempersiapkan terobosan pusat pembebasan ...d5.",
        "Menghadapi serangan badai pion putih di sayap raja dengan pertahanan aktif dan serangan balik di pusat."
      ],
      piecePlacement: "Kuda hitam di f6 dan d7/c6. Gajah di e7 dan e6. Benteng di c8 menekan lajur c.",
      endgameTraits: "Di babak akhir, mayoritas pion pusat hitam (e & d) dan pion sayap menteri sering kali menggilas posisi putih jika hitam berhasil menahan serangan badai midgame."
    },
    counters: [
      {
        counterName: "Alapin Variation (2.c3)",
        movesSan: "1.e4 c5 2.c3",
        whyItWorks: "Putih menolak masuk ke komplikasi Open Sicilian dan langsung membangun pusat pion d4 yang solid dengan bantuan c3.",
        targetWeakness: "Menghilangkan pertarungan taktis liar khas Sisilia dan memaksa hitam bermain posisional melawan pusat kuat putih."
      },
      {
        counterName: "Grand Prix Attack",
        movesSan: "1.e4 c5 2.Nc3 Nc6 3.f4",
        whyItWorks: "Serangan sayap raja agresif sejak awal dengan dorongan pion f4 untuk mengancam Raja hitam sebelum hitam siap menyerang di sayap menteri.",
        targetWeakness: "Membidik langsung kelemahan sayap raja hitam tanpa harus membuka lajur c."
      }
    ],
    quiz: [
      {
        question: "Langkah apa yang dimainkan hitam pada langkah ke-1 untuk memulai Pertahanan Sisilia?",
        correctSan: "c5",
        hint: "Pion sayap menteri dimajukan dua petak untuk menantang d4.",
        explanation: "1...c5 adalah Pertahanan Sisilia, menciptakan ketidakseimbangan taktis melawan 1.e4."
      },
      {
        question: "Dalam Sisilia Najdorf setelah 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3, langkah pencegah apa yang dimainkan hitam?",
        correctSan: "a6",
        hint: "Pion a maju satu langkah untuk mencegah perwira putih hinggap di b5.",
        explanation: "5...a6 adalah langkah khas Najdorf yang melarang Nb5 atau Bb5."
      }
    ]
  },
  {
    id: "french-defense",
    name: "French Defense",
    nameId: "Pertahanan Prancis",
    side: "black",
    difficulty: "Menengah",
    style: "Posisional / Solid",
    ecoCode: "C00 - C19",
    popularity: 93,
    winRate: { white: 41, draw: 33, black: 26 },
    summary: "Pertahanan posisional yang sangat ulet dan berkarakter unik. Hitam membangun rantai pion kokoh di e6 dan d5, lalu melancarkan serangan gencar terhadap pangkal rantai pion putih di c5.",
    moves: [
      {
        san: "e4",
        commentary: "Langkah awal putih menguasai pusat.",
        arrows: [["e2", "e4"]],
        highlightSquares: ["e4"],
        trapAlert: null
      },
      {
        san: "e6",
        commentary: "Ciri khas Pertahanan Prancis! Mempersiapkan dorongan d5 yang dilindungi pion e6.",
        arrows: [["e7", "e6"]],
        highlightSquares: ["e6", "d5"],
        trapAlert: null
      },
      {
        san: "d4",
        commentary: "Putih merebut pusat penuh dengan menduduki d4 dan e4.",
        arrows: [["d2", "d4"]],
        highlightSquares: ["d4", "e4"],
        trapAlert: null
      },
      {
        san: "d5",
        commentary: "Hitam langsung menantang pion pusat e4 putih.",
        arrows: [["d7", "d5"], ["d5", "e4"]],
        highlightSquares: ["d5", "e4"],
        trapAlert: null
      },
      {
        san: "Nc3",
        commentary: "Variasi Utama (Paulsen/Winawer). Putih mempertahankan e4 secara aktif dengan perwira.",
        arrows: [["b1", "c3"], ["c3", "e4"]],
        highlightSquares: ["c3", "e4"],
        trapAlert: null
      },
      {
        san: "Bb4",
        commentary: "Variasi Winawer! Hitam memaku Kuda c3 terhadap Raja putih di e1, mengancam akan memakan pion e4.",
        arrows: [["f8", "b4"], ["b4", "c3"]],
        highlightSquares: ["b4", "c3"],
        trapAlert: null
      },
      {
        san: "e5",
        commentary: "Putih menutup pusat dan merebut ruang luas di sayap raja.",
        arrows: [["e4", "e5"]],
        highlightSquares: ["e5"],
        trapAlert: null
      },
      {
        san: "c5",
        commentary: "Prinsip Utama Prancis: Hancurkan pangkal rantai pion lawan! Hitam langsung menyerang pion d4 putih.",
        arrows: [["c7", "c5"], ["c5", "d4"]],
        highlightSquares: ["c5", "d4"],
        trapAlert: null
      },
      {
        san: "a3",
        commentary: "Putih memaksa Gajah hitam mengambil keputusan.",
        arrows: [["a2", "a3"], ["a3", "b4"]],
        highlightSquares: ["a3", "b4"],
        trapAlert: null
      },
      {
        san: "Bxc3+",
        commentary: "Hitam menukar Gajah dengan Kuda, merusak struktur pion sayap menteri putih.",
        arrows: [["b4", "c3"]],
        highlightSquares: ["c3"],
        trapAlert: null
      },
      {
        san: "bxc3",
        commentary: "Putih memiliki sepasang pion tumpuk di c3 dan c2, tetapi memiliki keunggulan sepasang Gajah.",
        arrows: [["b2", "c3"]],
        highlightSquares: ["c3"],
        trapAlert: null
      },
      {
        san: "Ne7",
        commentary: "Kuda hitam berkembang ke e7 untuk menuju f5 membantu serangan ke d4.",
        arrows: [["g8", "e7"]],
        highlightSquares: ["e7", "f5"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Rantai pion tertutup: Putih memiliki rantai c2-c3-d4-e5; Hitam memiliki rantai e6-d5. Putih dominan di sayap raja, Hitam dominan di sayap menteri.",
      keyPlans: [
        "Menyerang pangkal rantai pion d4 putih dengan ...Nc6, ...Qb6, dan ...Nf5.",
        "Mengaktifkan 'Gajah Buruk Prancis' (Gajah terang c8) melalui manuver ...Bd7-b5 atau membongkar dengan ...f6.",
        "Mengeksploitasi pion tumpuk c3/c4 putih di sayap menteri."
      ],
      piecePlacement: "Kuda di c6 dan f5. Menteri di b6 atau c7. Benteng di lajur c. Gajah c8 ditukar via b5.",
      endgameTraits: "Jika hitam berhasil menahan serangan sayap raja putih dan menukar menteri, kelemahan struktur pion putih di sayap menteri (pion c3 lemah) sering memberi hitam kemenangan mudah di babak akhir."
    },
    counters: [
      {
        counterName: "Tarrasch Variation (3.Nd2)",
        movesSan: "1.e4 e6 2.d4 d5 3.Nd2",
        whyItWorks: "Menghindari paku gajah di b4 (Winawer) karena Kuda di d2 dapat didukung oleh c3.",
        targetWeakness: "Membatasi opsi taktis hitam dan mempertahankan struktur pion putih yang rapi tanpa pion tumpuk."
      },
      {
        counterName: "Exchange Variation (3.exd5)",
        movesSan: "3.exd5 exd5",
        whyItWorks: "Membuka posisi sepenuhnya dan menghilangkan keunggulan rantai pion khas Prancis, sering kali memicu hasil remis.",
        targetWeakness: "Menetralisir rencana serangan counter hitam di sayap menteri."
      }
    ],
    quiz: [
      {
        question: "Langkah apa yang dimainkan hitam pada langkah pertama Pertahanan Prancis?",
        correctSan: "e6",
        hint: "Pion e dimajukan satu petak untuk menyiapkan d5.",
        explanation: "1...e6 mempersiapkan 2...d5 untuk menantang e4."
      }
    ]
  },
  {
    id: "caro-kann-defense",
    name: "Caro-Kann Defense",
    nameId: "Pertahanan Caro-Kann",
    side: "black",
    difficulty: "Pemula",
    style: "Posisional / Solid",
    ecoCode: "B10 - B19",
    popularity: 94,
    winRate: { white: 38, draw: 38, black: 24 },
    summary: "Pertahanan paling tangguh dan bebas masalah bagi Hitam melawan 1.e4. Berbeda dengan Pertahanan Prancis, Caro-Kann membiarkan Gajah terang c8 bebas berkembang ke luar rantai pion sebelum pintu pertahanan ditutup.",
    moves: [
      {
        san: "e4",
        commentary: "Langkah standar putih menguasai pusat.",
        arrows: [["e2", "e4"]],
        highlightSquares: ["e4"],
        trapAlert: null
      },
      {
        san: "c6",
        commentary: "Langkah deklarasi Caro-Kann! Mempersiapkan dorongan d5 yang kokoh dengan dukungan pion c6, tanpa mengurung gajah c8.",
        arrows: [["c7", "c6"]],
        highlightSquares: ["c6", "d5"],
        trapAlert: null
      },
      {
        san: "d4",
        commentary: "Putih menduduki petak pusat d4.",
        arrows: [["d2", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "d5",
        commentary: "Hitam menantang pusat e4 secara langsung.",
        arrows: [["d7", "d5"], ["d5", "e4"]],
        highlightSquares: ["d5", "e4"],
        trapAlert: null
      },
      {
        san: "Nc3",
        commentary: "Variasi Klasik. Putih menjaga pion e4 dengan Kuda.",
        arrows: [["b1", "c3"]],
        highlightSquares: ["c3", "e4"],
        trapAlert: null
      },
      {
        san: "dxe4",
        commentary: "Hitam melikuidasi pusat untuk mendapatkan kebebasan perwira.",
        arrows: [["d5", "e4"]],
        highlightSquares: ["e4"],
        trapAlert: null
      },
      {
        san: "Nxe4",
        commentary: "Kuda putih memakan kembali di e4.",
        arrows: [["c3", "e4"]],
        highlightSquares: ["e4"],
        trapAlert: null
      },
      {
        san: "Bf5",
        commentary: "Kunci Sukses Caro-Kann! Gajah terang hitam keluar dengan elegan ke f5 menyerang Kuda e4 sebelum rantai pion e6 ditutup.",
        arrows: [["c8", "f5"], ["f5", "e4"]],
        highlightSquares: ["f5", "e4"],
        trapAlert: null
      },
      {
        san: "Ng3",
        commentary: "Kuda putih menghindar sambil balik menyerang Gajah f5.",
        arrows: [["e4", "g3"], ["g3", "f5"]],
        highlightSquares: ["g3", "f5"],
        trapAlert: null
      },
      {
        san: "Bg6",
        commentary: "Gajah mundur aman ke g6 dan tetap aktif di diagonal.",
        arrows: [["f5", "g6"]],
        highlightSquares: ["g6"],
        trapAlert: null
      },
      {
        san: "h4",
        commentary: "Putih mencoba mengancam akan menjebak Gajah hitam dengan h5.",
        arrows: [["h2", "h4"], ["h4", "h5"]],
        highlightSquares: ["h4", "h5"],
        trapAlert: "Perangkap Terkenal: Jika hitam tidak memainkan 6...h6, langkah 7.h5 akan menjebak gajah hitam tanpa jalan keluar!"
      },
      {
        san: "h6",
        commentary: "Hitam menyediakan petak mundur darurat di h7 untuk Gajahnya.",
        arrows: [["h7", "h6"], ["h6", "h7"]],
        highlightSquares: ["h6", "h7"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Struktur pion Caro-Kann terkenal sangat kokoh dan minim kelemahan: pion hitam tersusun rapi c6-e6-f7-g7-h6.",
      keyPlans: [
        "Menyelesaikan perkembangan perwira dengan ...Nd7, ...Ngf6, dan ...e6.",
        "Menyiapkan terobosan pembebasan ...c5 pada saat yang tepat.",
        "Menetralisir inisiatif putih dan mengarahkan permainan menuju babak akhir yang menguntungkan struktur pion hitam."
      ],
      piecePlacement: "Gajah di g6 dan d6/e7. Kuda di d7 dan f6. Benteng di c8 atau d8.",
      endgameTraits: "Struktur pion Caro-Kann sering disebut sebagai 'struktur pion terbaik untuk babak akhir'. Hitam jarang memiliki pulau pion yang rusak, membuat persentase remis atau menang hitam di endgame sangat tinggi."
    },
    counters: [
      {
        counterName: "Panov-Botvinnik Attack (4.c4)",
        movesSan: "1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4",
        whyItWorks: "Putih membongkar pusat dengan cepat untuk menciptakan posisi terbuka dengan Isolani (IQP), memberi putih peluang serangan dinamis.",
        targetWeakness: "Memaksa hitam keluar dari zona nyaman pertahanan tenang dan menghadapi tekanan perwira agresif."
      },
      {
        counterName: "Advance Variation (3.e5)",
        movesSan: "3.e5 Bf5 4.h4",
        whyItWorks: "Merebut ruang luas dan langsung menekan gajah f5 hitam dengan manuver h4-g4.",
        targetWeakness: "Membatasi ruang gerak hitam dan menguji akurasi langkah hitam di sayap raja."
      }
    ],
    quiz: [
      {
        question: "Langkah pembuka apa yang menandai dimulainya Pertahanan Caro-Kann?",
        correctSan: "c6",
        hint: "Pion c maju satu petak untuk menyokong d5.",
        explanation: "1...c6 adalah langkah awal Caro-Kann."
      }
    ]
  },
  {
    id: "kings-indian-defense",
    name: "King's Indian Defense (KID)",
    nameId: "Pertahanan Hindia Raja",
    side: "black",
    difficulty: "Mahir",
    style: "Taktikal / Agresif",
    ecoCode: "E60 - E99",
    popularity: 96,
    winRate: { white: 41, draw: 31, black: 28 },
    summary: "Senjata tempur legendaris Bobby Fischer dan Garry Kasparov untuk menghancurkan 1.d4. Hitam sengaja membiarkan Putih menguasai pusat luas dengan pion c4, d4, e4, lalu melancarkan serangan balasan badai sayap raja yang mematikan.",
    moves: [
      {
        san: "d4",
        commentary: "Putih memulai dengan langkah tertutup standar.",
        arrows: [["d2", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "Nf6",
        commentary: "Hitam mengontrol petak e4 secara fleksibel.",
        arrows: [["g8", "f6"]],
        highlightSquares: ["f6", "e4"],
        trapAlert: null
      },
      {
        san: "c4",
        commentary: "Putih menambah kontrol ruang di sayap menteri dan pusat.",
        arrows: [["c2", "c4"]],
        highlightSquares: ["c4", "d5"],
        trapAlert: null
      },
      {
        san: "g6",
        commentary: "Hitam bersiap melakukan Fianchetto Gajah ke g7.",
        arrows: [["g7", "g6"]],
        highlightSquares: ["g6", "g7"],
        trapAlert: null
      },
      {
        san: "Nc3",
        commentary: "Putih menyiapkan dorongan pion e4.",
        arrows: [["b1", "c3"]],
        highlightSquares: ["c3", "e4"],
        trapAlert: null
      },
      {
        san: "Bg7",
        commentary: "Gajah naga mendarat di g7, memancarkan sinar kontrol di sepanjang diagonal panjang.",
        arrows: [["f8", "g7"]],
        highlightSquares: ["g7"],
        trapAlert: null
      },
      {
        san: "e4",
        commentary: "Putih membangun pusat trio pion idaman (c4, d4, e4).",
        arrows: [["e2", "e4"]],
        highlightSquares: ["c4", "d4", "e4"],
        trapAlert: null
      },
      {
        san: "d6",
        commentary: "Hitam menghentikan laju pion e5 dan mengontrol petak e5.",
        arrows: [["d7", "d6"]],
        highlightSquares: ["d6", "e5"],
        trapAlert: null
      },
      {
        san: "Nf3",
        commentary: "Putih mengembangkan Kuda sayap raja secara alami (Variasi Klasik).",
        arrows: [["g1", "f3"]],
        highlightSquares: ["f3"],
        trapAlert: null
      },
      {
        san: "O-O",
        commentary: "Hitam mengamankan Raja ke kastil sayap raja.",
        arrows: [["e8", "g8"]],
        highlightSquares: ["g8"],
        trapAlert: null
      },
      {
        san: "Be2",
        commentary: "Putih bersiap rokade pendek.",
        arrows: [["f1", "e2"]],
        highlightSquares: ["e2"],
        trapAlert: null
      },
      {
        san: "e5",
        commentary: "Langkah serangan pusat KID! Hitam menantang pusat d4 putih.",
        arrows: [["e7", "e5"], ["e5", "d4"]],
        highlightSquares: ["e5", "d4"],
        trapAlert: null
      },
      {
        san: "O-O",
        commentary: "Putih melakukan rokade.",
        arrows: [["e1", "g1"]],
        highlightSquares: ["g1"],
        trapAlert: null
      },
      {
        san: "Nc6",
        commentary: "Hitam menambah tekanan ke d4, memaksa putih menentukan sikap di pusat.",
        arrows: [["b8", "c6"], ["c6", "d4"]],
        highlightSquares: ["c6", "d4"],
        trapAlert: null
      },
      {
        san: "d5",
        commentary: "Putih mengunci pusat! Garis pertempuran resmi ditarik: Putih akan menyerang sayap menteri, Hitam akan menyerang Raja putih di sayap raja!",
        arrows: [["d4", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "Ne7",
        commentary: "Kuda mundur ke e7 dan siap dimanuver ke e8/d7 untuk membuka jalan bagi dorongan pion badai ...f5!",
        arrows: [["c6", "e7"]],
        highlightSquares: ["e7", "f5"],
        trapAlert: "Catatan Emas KID: Kunci kemenangan hitam ada pada dorongan pion ...f5 disusul ...f4 dan badai pion ...g5-g4 untuk memburu Raja putih!"
      }
    ],
    strategy: {
      pawnStructure: "Pusat terkunci rapat dengan rantai pion putih c4-d5-e4 melawan hitam d6-e5. Rantai pion putih mengarah ke sayap menteri, rantai pion hitam mengarah ke sayap raja.",
      keyPlans: [
        "Manuver Kuda f6 ke e8/d7 untuk membuka dorongan terobosan pion ...f5!",
        "Melanjutkan dengan dorongan ...f4, ...g5, ...h5, dan ...g4 untuk membongkar perisai Raja putih di sayap raja.",
        "Mengorbankan perwira di sayap raja jika diperlukan untuk menghasilkan skakmat langsung."
      ],
      piecePlacement: "Gajah di g7. Kuda di e7 dan f6/f4. Benteng di f8 dan g8. Menteri di e8 menuju h5.",
      endgameTraits: "Game King's Indian jarang sekali berakhir di babak akhir yang tenang; biasanya ditentukan oleh apakah serangan skakmat hitam berhasil sebelum ekspansi sayap menteri putih tembus. Namun jika masuk endgame, putih sering unggul ruang jika sayap menteri hancur."
    },
    counters: [
      {
        counterName: "Averbakh Variation (6.Bg5)",
        movesSan: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Be2 O-O 6.Bg5",
        whyItWorks: "Gajah mengontrol diagonal c1-h6 dan memaku petak e7/f6, membuat persiapan terobosan hitam ...e5 menjadi jauh lebih sulit.",
        targetWeakness: "Meredam rencana klasik hitam untuk mendorong ...e5 tanpa persiapan panjang."
      },
      {
        counterName: "Samisch Variation (5.f3)",
        movesSan: "5.f3 O-O 6.Be3",
        whyItWorks: "Putih memperkuat e4 dengan pion f3, bersiap rokade panjang di sayap menteri dan melancarkan serangan badai balik ke sayap raja hitam.",
        targetWeakness: "Menghilangkan peluang hitam untuk menyerang Raja putih di sayap raja karena Raja putih rokade ke sayap berlawanan."
      }
    ],
    quiz: [
      {
        question: "Setelah 1.d4 Nf6 2.c4, langkah pion apa yang dimainkan hitam untuk menyiapkan Fianchetto Gajah di KID?",
        correctSan: "g6",
        hint: "Pion g dimajukan satu petak untuk membuka jalan gajah ke g7.",
        explanation: "2...g6 adalah langkah esensial untuk menempatkan gajah di g7."
      }
    ]
  },
  {
    id: "scandinavian-defense",
    name: "Scandinavian Defense",
    nameId: "Pertahanan Skandinavia",
    side: "black",
    difficulty: "Pemula",
    style: "Universal / Praktis",
    ecoCode: "B01",
    popularity: 89,
    winRate: { white: 43, draw: 32, black: 25 },
    summary: "Pertahanan paling direct dan mudah dipelajari melawan 1.e4. Di langkah pertama Hitam langsung menantang pion pusat dengan 1...d5, memotong semua persiapan teori rumit Putih.",
    moves: [
      {
        san: "e4",
        commentary: "Langkah pembuka putih.",
        arrows: [["e2", "e4"]],
        highlightSquares: ["e4"],
        trapAlert: null
      },
      {
        san: "d5",
        commentary: "Langkah Skandinavia! Hitam langsung memaksa putih menentukan nasib pion pusatnya sejak langkah pertama.",
        arrows: [["d7", "d5"], ["d5", "e4"]],
        highlightSquares: ["d5", "e4"],
        trapAlert: null
      },
      {
        san: "exd5",
        commentary: "Putih memakan pion d5, langkah paling logis dan kritis.",
        arrows: [["e4", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "Qxd5",
        commentary: "Variasi Utama. Menteri hitam memakan kembali di d5.",
        arrows: [["d8", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "Nc3",
        commentary: "Putih mengembangkan Kuda sambil menyerang Menteri hitam, memenangkan 1 tempo.",
        arrows: [["b1", "c3"], ["c3", "d5"]],
        highlightSquares: ["c3", "d5"],
        trapAlert: null
      },
      {
        san: "Qa5",
        commentary: "Menteri mundur aman ke petak a5 di mana ia aktif dan sulit diusir lagi.",
        arrows: [["d5", "a5"]],
        highlightSquares: ["a5"],
        trapAlert: null
      },
      {
        san: "d4",
        commentary: "Putih menduduki pusat d4.",
        arrows: [["d2", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "Nf6",
        commentary: "Hitam mengembangkan Kuda dan mengontrol petak e4.",
        arrows: [["g8", "f6"]],
        highlightSquares: ["f6", "e4"],
        trapAlert: null
      },
      {
        san: "Nf3",
        commentary: "Putih mengembangkan Kuda sayap raja.",
        arrows: [["g1", "f3"]],
        highlightSquares: ["f3"],
        trapAlert: null
      },
      {
        san: "c6",
        commentary: "Langkah pelindung! Menyediakan jalan mundur untuk Menteri ke c7 atau d8 jika diserang, sekaligus mengontrol petak b5 dan d5.",
        arrows: [["c7", "c6"]],
        highlightSquares: ["c6"],
        trapAlert: null
      },
      {
        san: "Bc4",
        commentary: "Gajah putih berkembang membidik f7.",
        arrows: [["f1", "c4"]],
        highlightSquares: ["c4"],
        trapAlert: null
      },
      {
        san: "Bf5",
        commentary: "Gajah terang hitam keluar aktif sebelum rantai pion e6 ditutup.",
        arrows: [["c8", "f5"]],
        highlightSquares: ["f5"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Struktur mirip Caro-Kann di mana hitam memiliki pion solid di c6 dan e6, sedangkan putih memiliki keunggulan ruang di d4.",
      keyPlans: [
        "Menuntaskan perkembangan dengan ...e6, ...Nbd7, dan ...Be7.",
        "Rokade panjang di sayap menteri (...O-O-O) untuk menciptakan pertarungan saling serang sayap berlawanan.",
        "Menekan pion d4 putih yang maju sendirian di pusat."
      ],
      piecePlacement: "Menteri di a5/c7. Gajah di f5. Kuda di f6 dan d7. Benteng di d8.",
      endgameTraits: "Struktur pion hitam sangat bersih. Jika menteri ditukar, hitam sering memiliki peluang sangat seimbang bahkan sedikit lebih unggul di endgame karena ketiadaan titik lemah pion."
    },
    counters: [
      {
        counterName: "Modern 2...Nf6 (Portuguese / Icelandic Gambit)",
        movesSan: "2...Nf6 (tanpa 2...Qxd5)",
        whyItWorks: "Menghindari Menteri keluar terlalu awal dan mengarahkan permainan ke pertukaran taktis cepat.",
        targetWeakness: "Membatasi opsi putih untuk memenangkan tempo menyerang menteri di c3."
      }
    ],
    quiz: [
      {
        question: "Langkah balasan langsung apa yang dimainkan hitam pada langkah pertama Scandinavian Defense?",
        correctSan: "d5",
        hint: "Pion d dimajukan dua petak untuk langsung menantang e4.",
        explanation: "1...d5 adalah inti Scandinavian Defense."
      }
    ]
  },
  {
    id: "nimzo-indian-defense",
    name: "Nimzo-Indian Defense",
    nameId: "Pertahanan Nimzo-India",
    side: "black",
    difficulty: "Mahir",
    style: "Posisional / Solid",
    ecoCode: "E20 - E59",
    popularity: 94,
    winRate: { white: 39, draw: 38, black: 23 },
    summary: "Pertahanan paling dihormati di level Kejuaraan Dunia melawan 1.d4. Diciptakan oleh Aron Nimzowitsch, Hitam memaku Kuda c3 putih dengan Gajah b4 untuk mengontrol petak e4 tanpa terburu-buru menaruh pion di pusat.",
    moves: [
      {
        san: "d4",
        commentary: "Putih memulai dengan langkah tertutup.",
        arrows: [["d2", "d4"]],
        highlightSquares: ["d4"],
        trapAlert: null
      },
      {
        san: "Nf6",
        commentary: "Hitam mengontrol e4 dan d5 secara fleksibel.",
        arrows: [["g8", "f6"]],
        highlightSquares: ["f6", "e4"],
        trapAlert: null
      },
      {
        san: "c4",
        commentary: "Putih menambah kontrol ruang.",
        arrows: [["c2", "c4"]],
        highlightSquares: ["c4"],
        trapAlert: null
      },
      {
        san: "e6",
        commentary: "Membuka jalan bagi Gajah gelap f8.",
        arrows: [["e7", "e6"]],
        highlightSquares: ["e6"],
        trapAlert: null
      },
      {
        san: "Nc3",
        commentary: "Putih bersiap mendominasi pusat dengan e4.",
        arrows: [["b1", "c3"], ["c3", "e4"]],
        highlightSquares: ["c3", "e4"],
        trapAlert: null
      },
      {
        san: "Bb4",
        commentary: "Langkah Nimzo-Indian! Gajah memaku Kuda c3 terhadap Raja di e1, sepenuhnya melumpuhkan rencana putih untuk memainkan e4.",
        arrows: [["f8", "b4"], ["b4", "c3"]],
        highlightSquares: ["b4", "c3"],
        trapAlert: "Filosofi Nimzo: Kontrol pusat tidak harus dengan pion; perwira (Gajah b4 & Kuda f6) bisa mengontrol petak e4 secara mutlak."
      },
      {
        san: "e3",
        commentary: "Variasi Rubinstein. Langkah paling solid untuk Putih, memperkuat d4 dan membuka jalan bagi Gajah f1.",
        arrows: [["e2", "e3"]],
        highlightSquares: ["e3", "d4"],
        trapAlert: null
      },
      {
        san: "O-O",
        commentary: "Hitam menyelesaikan rokade cepat.",
        arrows: [["e8", "g8"]],
        highlightSquares: ["g8"],
        trapAlert: null
      },
      {
        san: "Bd3",
        commentary: "Gajah putih berkembang aktif mengontrol e4.",
        arrows: [["f1", "d3"]],
        highlightSquares: ["d3", "e4"],
        trapAlert: null
      },
      {
        san: "d5",
        commentary: "Hitam menancapkan pion di pusat setelah perwiranya siap bertempur.",
        arrows: [["d7", "d5"]],
        highlightSquares: ["d5"],
        trapAlert: null
      },
      {
        san: "Nf3",
        commentary: "Putih mengembangkan Kuda sayap raja.",
        arrows: [["g1", "f3"]],
        highlightSquares: ["f3"],
        trapAlert: null
      },
      {
        san: "c5",
        commentary: "Hitam membongkar pusat putih di c4 dan d4.",
        arrows: [["c7", "c5"]],
        highlightSquares: ["c5", "d4"],
        trapAlert: null
      }
    ],
    strategy: {
      pawnStructure: "Sering kali menghasilkan pertukaran ...Bxc3 bxc3 yang memberikan putih pion tumpuk di c3 dan c4. Hitam kemudian menargetkan pion c4 yang terisolasi.",
      keyPlans: [
        "Mengeksploitasi pion tumpuk putih c3/c4 menggunakan manuver ...Na5, ...Ba6, dan ...b6.",
        "Mengontrol petak penting e4 dengan Kuda.",
        "Membongkar pusat dengan ...c5 atau ...e5."
      ],
      piecePlacement: "Gajah di b4 (atau ditukar di c3), Kuda di e4 dan c6/a5. Gajah c8 berkembang via b6-a6.",
      endgameTraits: "Di babak akhir, pion tumpuk dan lemah c4 putih sering menjadi sasaran empuk bagi Kuda dan Benteng hitam. Kerapihan struktur pion hitam menjadi modal kemenangan jangka panjang."
    },
    counters: [
      {
        counterName: "Classical Variation (4.Qc2)",
        movesSan: "4.Qc2",
        whyItWorks: "Putih mencegah pion tumpuk karena jika hitam makan di c3, Menteri yang akan memakan kembali. Putih juga tetap mempertahankan sepasang Gajah.",
        targetWeakness: "Menghilangkan rencana strategis hitam untuk memberikan pion tumpuk kepada putih."
      }
    ],
    quiz: [
      {
        question: "Setelah 1.d4 Nf6 2.c4 e6 3.Nc3, langkah apa yang mendefinisikan Nimzo-Indian Defense?",
        correctSan: "Bb4",
        hint: "Gajah gelap memaku Kuda c3 terhadap raja putih.",
        explanation: "3...Bb4 adalah langkah khas Nimzo-Indian yang memaku Kuda c3 untuk menghentikan e4."
      }
    ]
  }
];

// Validate all openings with chess.js to ensure 100% legal moves and accurate FENs
console.log("Validating openings with chess.js...");
const validatedOpenings = rawOpenings.map(op => {
  const chess = new Chess();
  const processedMoves = op.moves.map((m, index) => {
    const moveRes = chess.move(m.san);
    if (!moveRes) {
      throw new Error(`Invalid move ${m.san} at ply ${index + 1} in opening ${op.id}`);
    }
    return {
      ply: index + 1,
      san: moveRes.san,
      from: moveRes.from,
      to: moveRes.to,
      fen: chess.fen(),
      commentary: m.commentary,
      arrows: m.arrows || [[moveRes.from, moveRes.to]],
      highlightSquares: m.highlightSquares || [moveRes.from, moveRes.to],
      trapAlert: m.trapAlert || null
    };
  });

  return {
    ...op,
    initialFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    finalFen: chess.fen(),
    totalPlies: processedMoves.length,
    moves: processedMoves
  };
});

console.log(`Successfully validated ${validatedOpenings.length} openings!`);

const outputContent = `// Dataset Pembukaan Catur Populer Indonesia Terverifikasi
// Dihasilkan secara otomatis dan divalidasi dengan chess.js

export const chessOpenings = ${JSON.stringify(validatedOpenings, null, 2)};
`;

const outputPath = path.join(process.cwd(), 'src', 'lib', 'data', 'openings.js');
fs.writeFileSync(outputPath, outputContent, 'utf8');
console.log(`Saved validated openings to ${outputPath}`);
