<script>
  import { onMount, onDestroy } from 'svelte';
  import { Chess } from 'chess.js';
  import Chessboard from './Chessboard.svelte';
  import {
    playMoveSound,
    playCaptureSound,
    playCheckSound,
    playSuccessSound,
    playErrorSound
  } from '../sound.js';

  let {
    opening,
    allOpenings = [],
    onSelectOtherOpening = () => {},
    onBackToList = () => {}
  } = $props();

  // Active Tab state
  let activeTab = $state('moves'); // 'moves' | 'midgame' | 'endgame' | 'counter' | 'quiz'

  function handleTabSelect(tab, e) {
    activeTab = tab;
    if (tab === 'quiz') {
      resetQuiz();
    }
    if (e?.currentTarget?.scrollIntoView) {
      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Board Navigation State
  let currentPly = $state(0); // 0 = initial position, 1..totalPlies
  let isAutoPlaying = $state(false);
  let autoPlaySpeed = $state(2200); // ms per step
  let autoPlayTimer = null;

  // Board Orientation (default to opening side)
  let orientation = $state('white');

  $effect(() => {
    // Sync state when opening changes
    const _ = opening.id;
    orientation = opening.side === 'black' ? 'black' : 'white';
    currentPly = 0;
    quizStepIdx = 0;
    quizFeedback = null;
    quizScore = 0;
    quizCompleted = false;
    selectedSquare = null;
    legalDests = [];
    isAutoPlaying = false;
  });

  // Interactive Quiz / Guess the Move state
  let quizStepIdx = $state(0);
  let quizScore = $state(0);
  let quizFeedback = $state(null); // { status: 'correct' | 'wrong', message: '', explanation: '' }
  let quizShowHint = $state(false);
  let quizCompleted = $state(false);

  // Board click-to-move interactive state for Quiz
  let selectedSquare = $state(null);
  let legalDests = $state([]);

  // Compute current FEN and visual metadata
  let currentFen = $derived(
    currentPly === 0 ? opening.initialFen : opening.moves[currentPly - 1]?.fen || opening.initialFen
  );

  let currentMoveData = $derived(
    currentPly === 0 ? null : opening.moves[currentPly - 1]
  );

  let activeArrows = $derived(
    currentMoveData?.arrows || []
  );

  let activeHighlights = $derived(
    currentMoveData?.highlightSquares || []
  );

  // Sound trigger on step change
  function triggerStepSound(moveObj) {
    if (!moveObj) {
      playMoveSound();
      return;
    }
    if (moveObj.san.includes('#') || moveObj.san.includes('+')) {
      playCheckSound();
    } else if (moveObj.san.includes('x')) {
      playCaptureSound();
    } else {
      playMoveSound();
    }
  }

  // Navigation functions
  function goToPly(targetPly) {
    if (targetPly < 0) targetPly = 0;
    if (targetPly > opening.moves.length) targetPly = opening.moves.length;
    if (targetPly === currentPly) return;

    currentPly = targetPly;
    const moveObj = currentPly > 0 ? opening.moves[currentPly - 1] : null;
    triggerStepSound(moveObj);
  }

  function nextMove() {
    if (currentPly < opening.moves.length) {
      goToPly(currentPly + 1);
    } else if (isAutoPlaying) {
      stopAutoPlay();
    }
  }

  function prevMove() {
    if (currentPly > 0) {
      goToPly(currentPly - 1);
    }
  }

  function resetBoard() {
    stopAutoPlay();
    goToPly(0);
  }

  function goToEnd() {
    goToPly(opening.moves.length);
  }

  function toggleFlip() {
    orientation = orientation === 'white' ? 'black' : 'white';
  }

  // Auto-play loop
  function toggleAutoPlay() {
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  function startAutoPlay() {
    if (currentPly >= opening.moves.length) {
      currentPly = 0;
    }
    isAutoPlaying = true;
    runAutoPlayStep();
  }

  function runAutoPlayStep() {
    clearTimeout(autoPlayTimer);
    if (!isAutoPlaying) return;

    if (currentPly < opening.moves.length) {
      nextMove();
      autoPlayTimer = setTimeout(runAutoPlayStep, autoPlaySpeed);
    } else {
      stopAutoPlay();
    }
  }

  function stopAutoPlay() {
    isAutoPlaying = false;
    clearTimeout(autoPlayTimer);
  }

  // Switch to another opening
  function changeOpening(op) {
    stopAutoPlay();
    currentPly = 0;
    quizStepIdx = 0;
    quizFeedback = null;
    quizScore = 0;
    quizCompleted = false;
    orientation = op.side === 'black' ? 'black' : 'white';
    onSelectOtherOpening(op);
  }

  // Copy FEN to clipboard
  let fenCopied = $state(false);
  function copyFen() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentFen);
      fenCopied = true;
      setTimeout(() => (fenCopied = false), 2000);
    }
  }

  // Interactive Quiz Mode logic
  function resetQuiz() {
    quizStepIdx = 0;
    quizScore = 0;
    quizFeedback = null;
    quizShowHint = false;
    quizCompleted = false;
    selectedSquare = null;
    legalDests = [];
    currentPly = 0;
  }

  let currentQuiz = $derived(
    opening.quiz && opening.quiz[quizStepIdx] ? opening.quiz[quizStepIdx] : null
  );

  function checkQuizAnswer(attemptSan) {
    if (!currentQuiz) return;

    if (attemptSan.toLowerCase() === currentQuiz.correctSan.toLowerCase()) {
      playSuccessSound();
      quizScore += 1;
      quizFeedback = {
        status: 'correct',
        message: 'Langkah Tepat!',
        explanation: currentQuiz.explanation
      };

      // Advance quiz after delay or allow user to see
      setTimeout(() => {
        if (quizStepIdx + 1 < opening.quiz.length) {
          quizStepIdx += 1;
          quizFeedback = null;
          quizShowHint = false;
        } else {
          quizCompleted = true;
        }
      }, 2000);
    } else {
      playErrorSound();
      quizFeedback = {
        status: 'wrong',
        message: 'Langkah Kurang Akurat',
        explanation: `Langkah yang Anda coba bukan langkah utama teori ini. Coba lagi atau buka petunjuk!`
      };
    }
  }

  // Handle board square click in Quiz mode
  function handleSquareClick(square) {
    if (activeTab !== 'quiz' || !currentQuiz || quizCompleted) return;

    if (!selectedSquare) {
      selectedSquare = square;
      // Calculate legal destinations using chess.js
      try {
        const chess = new Chess(currentFen);
        const moves = chess.moves({ square, verbose: true });
        legalDests = moves.map(m => m.to);
      } catch (err) {
        legalDests = [];
      }
    } else {
      if (selectedSquare === square) {
        // Deselect
        selectedSquare = null;
        legalDests = [];
        return;
      }

      // Check if moving to square
      try {
        const chess = new Chess(currentFen);
        const move = chess.move({ from: selectedSquare, to: square, promotion: 'q' });
        if (move) {
          checkQuizAnswer(move.san);
        }
      } catch (e) {
        // invalid
      }
      selectedSquare = null;
      legalDests = [];
    }
  }

  // Lifecycle cleanup
  onDestroy(() => {
    stopAutoPlay();
  });
</script>

<div class="studio-container">
  <!-- Studio Header -->
  <div class="studio-header">
    <div class="header-left">
      <button type="button" class="back-link-btn" onclick={onBackToList}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Kembali ke Katalog
      </button>

      <div class="title-cluster">
        <h1 class="opening-title">{opening.name}</h1>
        <div class="meta-pills">
          <span class="badge {opening.side === 'white' ? 'badge-white' : 'badge-black'}">
            {opening.side === 'white' ? '♔ Sisi Putih' : '♚ Sisi Hitam'}
          </span>
          <span class="badge badge-emerald">{opening.ecoCode}</span>
          <span class="badge badge-amber">{opening.difficulty}</span>
          <span class="badge badge-purple">{opening.style}</span>
        </div>
      </div>
    </div>

    <!-- Quick Switcher Dropdown to other openings -->
    <div class="header-right">
      <div class="quick-switcher">
        <label for="opening-select" class="switcher-label">Ganti Pembukaan:</label>
        <select
          id="opening-select"
          class="opening-dropdown"
          value={opening.id}
          onchange={(e) => {
            const found = allOpenings.find(o => o.id === e.target.value);
            if (found) changeOpening(found);
          }}
        >
          <optgroup label="Sebagai Pemain Putih">
            {#each allOpenings.filter(o => o.side === 'white') as op}
              <option value={op.id}>{op.name} ({op.nameId})</option>
            {/each}
          </optgroup>
          <optgroup label="Sebagai Pemain Hitam">
            {#each allOpenings.filter(o => o.side === 'black') as op}
              <option value={op.id}>{op.name} ({op.nameId})</option>
            {/each}
          </optgroup>
        </select>
      </div>
    </div>
  </div>

  <!-- Main 2-Column Grid -->
  <div class="studio-main-grid">
    <!-- Left Column: Interactive Chessboard & Move Bar -->
    <div class="board-column">
      <div class="board-card">
        <Chessboard
          fen={currentFen}
          {orientation}
          arrows={activeTab === 'moves' ? activeArrows : []}
          highlightSquares={activeTab === 'moves' ? activeHighlights : []}
          {selectedSquare}
          {legalDests}
          interactive={activeTab === 'quiz'}
          onSquareClick={handleSquareClick}
        />

        <!-- Controls Toolbar -->
        <div class="board-controls-toolbar">
          <div class="primary-controls">
            <button
              type="button"
              class="ctrl-btn"
              onclick={resetBoard}
              title="Kembali ke Posisi Awal (Reset)"
              disabled={currentPly === 0}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              class="ctrl-btn"
              onclick={prevMove}
              title="Langkah Sebelumnya (Panah Kiri)"
              disabled={currentPly === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <!-- Auto-play toggle button -->
            <button
              type="button"
              class="ctrl-btn play-btn {isAutoPlaying ? 'active' : ''}"
              onclick={toggleAutoPlay}
              title={isAutoPlaying ? 'Jeda Simulasi' : 'Putar Langkah Otomatis'}
            >
              {#if isAutoPlaying}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                  <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                </svg>
                <span>Jeda</span>
              {:else}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Putar</span>
              {/if}
            </button>

            <button
              type="button"
              class="ctrl-btn"
              onclick={nextMove}
              title="Langkah Berikutnya (Panah Kanan)"
              disabled={currentPly >= opening.moves.length}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <button
              type="button"
              class="ctrl-btn"
              onclick={goToEnd}
              title="Lompat ke Langkah Akhir Teori"
              disabled={currentPly >= opening.moves.length}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="secondary-controls">
            <!-- Flip board button -->
            <button
              type="button"
              class="util-btn"
              onclick={toggleFlip}
              title="Balik Posisi Papan Catur"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
              <span>Balik ({orientation === 'white' ? 'Putih' : 'Hitam'})</span>
            </button>

            <!-- Copy FEN -->
            <button
              type="button"
              class="util-btn"
              onclick={copyFen}
              title="Salin FEN posisi saat ini ke clipboard"
            >
              {#if fenCopied}
                <span class="copied-badge">Tersalin!</span>
              {:else}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Salin FEN</span>
              {/if}
            </button>
          </div>
        </div>

        <!-- Horizontal Move Timeline Chips -->
        <div class="move-timeline-wrapper">
          <div class="timeline-label">Urutan Langkah:</div>
          <div class="move-chips-scroll">
            <button
              type="button"
              class="move-chip start-chip {currentPly === 0 ? 'active' : ''}"
              onclick={() => goToPly(0)}
            >
              Mulai
            </button>
            {#each opening.moves as m, idx}
              {@const ply = idx + 1}
              {@const moveNum = Math.floor(idx / 2) + 1}
              {@const isWhiteMove = idx % 2 === 0}
              <button
                type="button"
                class="move-chip {currentPly === ply ? 'active' : ''} {isWhiteMove ? 'chip-white' : 'chip-black'}"
                onclick={() => goToPly(ply)}
              >
                {#if isWhiteMove}
                  <span class="chip-num">{moveNum}.</span>
                {/if}
                <span class="chip-san">{m.san}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Multi-tab Strategy & Study Panel -->
    <div class="study-panel-column">
      <div class="study-card">
        <!-- Tab Navigation Bar -->
        <div class="study-tabs-wrapper">
          <div class="study-tabs-nav" role="tablist" aria-label="Menu Pembelajaran Pembukaan">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'moves'}
              class="tab-btn {activeTab === 'moves' ? 'active' : ''}"
              onclick={(e) => handleTabSelect('moves', e)}
            >
              <span class="tab-icon">📖</span>
              <span class="tab-title">Panduan Langkah</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'midgame'}
              class="tab-btn {activeTab === 'midgame' ? 'active' : ''}"
              onclick={(e) => handleTabSelect('midgame', e)}
            >
              <span class="tab-icon">⚔️</span>
              <span class="tab-title">Midgame Masterplan</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'endgame'}
              class="tab-btn {activeTab === 'endgame' ? 'active' : ''}"
              onclick={(e) => handleTabSelect('endgame', e)}
            >
              <span class="tab-icon">👑</span>
              <span class="tab-title">Transisi Endgame</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'counter'}
              class="tab-btn {activeTab === 'counter' ? 'active' : ''}"
              onclick={(e) => handleTabSelect('counter', e)}
            >
              <span class="tab-icon">🛡️</span>
              <span class="tab-title">Senjata Counter</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'quiz'}
              class="tab-btn {activeTab === 'quiz' ? 'active' : ''}"
              onclick={(e) => handleTabSelect('quiz', e)}
            >
              <span class="tab-icon">🎯</span>
              <span class="tab-title">Uji Tebak Langkah</span>
            </button>
          </div>
        </div>

        <!-- Tab Contents -->
        <div class="tab-content-area">
          <!-- TAB 1: PANDUAN LANGKAH (Step-by-step move guide) -->
          {#if activeTab === 'moves'}
            <div class="tab-pane animate-fade-in">
              <div class="current-move-header">
                {#if currentPly === 0}
                  <div class="move-indicator-box">
                    <span class="ply-badge">Posisi Awal</span>
                    <h2 class="san-display">Posisi Memulai Catur</h2>
                  </div>
                  <p class="step-summary">
                    {opening.summary}
                  </p>
                  <div class="start-hint-box">
                    <span>💡 Klik tombol <strong>"▶ Langkah Berikutnya"</strong> atau tombol <strong>"Putar"</strong> di bawah papan untuk melihat analisis langkah demi langkah.</span>
                  </div>
                {:else}
                  {@const moveNum = Math.floor((currentPly - 1) / 2) + 1}
                  {@const isWhite = (currentPly - 1) % 2 === 0}
                  <div class="move-indicator-box">
                    <span class="ply-badge">Langkah ke-{moveNum} ({isWhite ? 'Putih' : 'Hitam'})</span>
                    <h2 class="san-display">
                      <span class="notation-symbol">{isWhite ? '♔' : '♚'}</span>
                      {moveNum}{isWhite ? '.' : '...'}{currentMoveData.san}
                    </h2>
                  </div>

                  <!-- Strategic Commentary Box -->
                  <div class="commentary-card">
                    <div class="commentary-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>Maksud & Ide Strategis:</span>
                    </div>
                    <p class="commentary-text">
                      {currentMoveData.commentary}
                    </p>
                  </div>

                  <!-- Tactical Key Squares & Arrow Indicators -->
                  {#if currentMoveData.highlightSquares && currentMoveData.highlightSquares.length > 0}
                    <div class="key-squares-strip">
                      <span class="strip-label">Petak Kunci:</span>
                      <div class="square-tags">
                        {#each currentMoveData.highlightSquares as sq}
                          <span class="square-tag">⚑ {sq.toUpperCase()}</span>
                        {/each}
                      </div>
                    </div>
                  {/if}

                  <!-- Trap / Warning Alert (if any) -->
                  {#if currentMoveData.trapAlert}
                    <div class="trap-alert-box">
                      <div class="trap-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span>Peringatan Taktis & Jebakan:</span>
                      </div>
                      <p class="trap-desc">{currentMoveData.trapAlert}</p>
                    </div>
                  {/if}
                {/if}
              </div>

              <!-- Quick Step Navigator Bar inside tab -->
              <div class="mini-step-nav">
                <button
                  type="button"
                  class="btn btn-secondary step-nav-btn step-prev-btn"
                  onclick={prevMove}
                  disabled={currentPly === 0}
                >
                  ◀ Sebelumnya
                </button>
                <span class="step-progress-text">
                  Langkah {currentPly} dari {opening.moves.length}
                </span>
                <button
                  type="button"
                  class="btn btn-primary step-nav-btn step-next-btn"
                  onclick={nextMove}
                  disabled={currentPly >= opening.moves.length}
                >
                  Selanjutnya ▶
                </button>
              </div>
            </div>

          <!-- TAB 2: MIDGAME STRATEGY -->
          {:else if activeTab === 'midgame'}
            <div class="tab-pane animate-fade-in">
              <div class="section-badge-header">
                <span class="badge badge-amber">Babak Tengah (Middlegame)</span>
                <h3 class="pane-title">Peta Jalan Strategis Babak Tengah</h3>
              </div>

              <!-- Pawn Structure Deep-Dive -->
              <div class="strategy-section-box">
                <div class="box-icon-title">
                  <div class="icon-circle amber">♟</div>
                  <h4>Analisis Struktur Pion (Pawn Structure)</h4>
                </div>
                <p class="box-text">{opening.strategy.pawnStructure}</p>
              </div>

              <!-- Master Plans Checklist -->
              <div class="strategy-section-box">
                <div class="box-icon-title">
                  <div class="icon-circle emerald">🎯</div>
                  <h4>Rencana Utama & Terobosan Pion (Pawn Breaks)</h4>
                </div>
                <ul class="plans-list">
                  {#each opening.strategy.keyPlans as plan}
                    <li class="plan-item">
                      <span class="check-bullet">✓</span>
                      <span>{plan}</span>
                    </li>
                  {/each}
                </ul>
              </div>

              <!-- Piece Placement Guide -->
              <div class="strategy-section-box">
                <div class="box-icon-title">
                  <div class="icon-circle purple">♞</div>
                  <h4>Penempatan Ideal Perwira (Piece Placement)</h4>
                </div>
                <p class="box-text">{opening.strategy.piecePlacement}</p>
              </div>
            </div>

          <!-- TAB 3: ENDGAME TRANSITION -->
          {:else if activeTab === 'endgame'}
            <div class="tab-pane animate-fade-in">
              <div class="section-badge-header">
                <span class="badge badge-purple">Babak Akhir (Endgame)</span>
                <h3 class="pane-title">Karakteristik & Transisi Babak Akhir</h3>
              </div>

              <div class="strategy-section-box highlight-box">
                <div class="box-icon-title">
                  <div class="icon-circle emerald">👑</div>
                  <h4>Karakteristik Posisi Menuju Babak Akhir</h4>
                </div>
                <p class="box-text">{opening.strategy.endgameTraits}</p>
              </div>

              <div class="strategy-section-box">
                <div class="box-icon-title">
                  <div class="icon-circle amber">⚖️</div>
                  <h4>Prinsip Pertukaran Perwira</h4>
                </div>
                <div class="exchange-principles">
                  <div class="principle-card">
                    <span class="principle-badge keep">Pertahankan</span>
                    <p>Pertahankan perwira aktif yang memiliki jangkauan diagonal atau petak outpost kokoh.</p>
                  </div>
                  <div class="principle-card">
                    <span class="principle-badge trade">Tukarkan</span>
                    <p>Tukarkan perwira pasif Anda dengan perwira penyerang terbaik lawan untuk meredakan tekanan.</p>
                  </div>
                </div>
              </div>
            </div>

          <!-- TAB 4: COUNTER OPENING MATRIX -->
          {:else if activeTab === 'counter'}
            <div class="tab-pane animate-fade-in">
              <div class="section-badge-header">
                <span class="badge badge-emerald">Matriks Tandingan (Counter)</span>
                <h3 class="pane-title">Bagaimana Menghadapi {opening.name}?</h3>
              </div>
              <p class="counter-intro">
                Jika lawan memainkan <strong>{opening.name}</strong>, berikut adalah sistem tandingan paling ampuh dan teruji di level master untuk meredam inisiatif mereka:
              </p>

              <div class="counter-cards-list">
                {#each opening.counters as cnt}
                  <div class="counter-weapon-card">
                    <div class="counter-card-header">
                      <div class="counter-name-group">
                        <span class="weapon-icon">⚔️</span>
                        <h4 class="counter-name">{cnt.counterName}</h4>
                      </div>
                      <code class="counter-moves-tag">{cnt.movesSan}</code>
                    </div>

                    <div class="counter-body">
                      <div class="counter-field">
                        <span class="field-title">Mengapa Efektif?</span>
                        <p class="field-content">{cnt.whyItWorks}</p>
                      </div>

                      <div class="counter-field weakness-field">
                        <span class="field-title">Titik Lemah yang Dieksploitasi:</span>
                        <p class="field-content">{cnt.targetWeakness}</p>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

          <!-- TAB 5: GUESS THE MOVE / QUIZ -->
          {:else if activeTab === 'quiz'}
            <div class="tab-pane animate-fade-in">
              <div class="section-badge-header">
                <span class="badge badge-emerald">Latihan Interaktif</span>
                <h3 class="pane-title">Uji Pemahaman Langkah</h3>
              </div>

              {#if quizCompleted}
                <div class="quiz-completion-card">
                  <div class="trophy-icon">🏆</div>
                  <h3>Luar Biasa! Latihan Selesai</h3>
                  <p>Anda telah menyelesaikan semua pertanyaan uji langkah untuk pembukaan <strong>{opening.name}</strong>!</p>
                  <div class="final-score-display">
                    Skor Anda: <span class="score-num">{quizScore} / {opening.quiz.length}</span>
                  </div>
                  <button type="button" class="btn btn-primary" onclick={resetQuiz}>
                    Ulangi Latihan
                  </button>
                </div>
              {:else if currentQuiz}
                <div class="quiz-active-card">
                  <div class="quiz-progress-bar">
                    <span class="quiz-progress-label">Pertanyaan {quizStepIdx + 1} dari {opening.quiz.length}</span>
                    <span class="quiz-score-badge">Skor: {quizScore}</span>
                  </div>

                  <div class="quiz-question-box">
                    <span class="question-badge">Tantangan:</span>
                    <p class="quiz-question-text">{currentQuiz.question}</p>
                  </div>

                  <div class="quiz-instructions">
                    <span>💡 Anda bisa <strong>melangkah langsung di papan catur</strong> (klik bidak lalu petak tujuan) atau pilih salah satu opsi di bawah:</span>
                  </div>

                  <!-- Multiple Choice Options helper -->
                  <div class="quiz-choices-grid">
                    <button
                      type="button"
                      class="quiz-choice-btn"
                      onclick={() => checkQuizAnswer(currentQuiz.correctSan)}
                    >
                      {currentQuiz.correctSan}
                    </button>
                    <!-- Distractor 1 -->
                    <button
                      type="button"
                      class="quiz-choice-btn"
                      onclick={() => checkQuizAnswer('a3')}
                    >
                      a3
                    </button>
                    <!-- Distractor 2 -->
                    <button
                      type="button"
                      class="quiz-choice-btn"
                      onclick={() => checkQuizAnswer('h3')}
                    >
                      h3
                    </button>
                  </div>

                  <!-- Hint accordion -->
                  <div class="quiz-hint-section">
                    {#if !quizShowHint}
                      <button
                        type="button"
                        class="hint-toggle-btn"
                        onclick={() => (quizShowHint = true)}
                      >
                        🔍 Butuh Bantuan? Lihat Petunjuk
                      </button>
                    {:else}
                      <div class="hint-content-box">
                        <span class="hint-title">Petunjuk:</span>
                        <p>{currentQuiz.hint}</p>
                      </div>
                    {/if}
                  </div>

                  <!-- Feedback Banner -->
                  {#if quizFeedback}
                    <div class="quiz-feedback-box {quizFeedback.status}">
                      <div class="feedback-title">
                        {#if quizFeedback.status === 'correct'}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        {:else}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        {/if}
                        <span>{quizFeedback.message}</span>
                      </div>
                      <p class="feedback-desc">{quizFeedback.explanation}</p>
                    </div>
                  {/if}
                </div>
              {:else}
                <div class="empty-quiz-box">
                  <p>Kuis untuk pembukaan ini sedang dalam proses penyusunan.</p>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .studio-container {
    max-width: 1420px;
    margin: 0 auto;
    padding: 24px 20px 80px;
    width: 100%;
    box-sizing: border-box;
  }

  /* Header */
  .studio-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    min-width: 0;
  }

  .header-left {
    flex: 1 1 320px;
    min-width: 0;
  }

  .header-right {
    flex: 0 1 auto;
    min-width: 0;
  }

  .back-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 10px;
    transition: color var(--transition-fast);
  }

  .back-link-btn:hover {
    color: var(--accent-emerald);
  }

  .opening-title {
    font-size: 2.1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
    word-break: break-word;
  }

  .meta-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .quick-switcher {
    max-width: 100%;
  }

  .switcher-label {
    display: block;
    font-size: 0.78rem;
    color: var(--text-dim);
    margin-bottom: 4px;
    font-weight: 600;
  }

  .opening-dropdown {
    background: var(--bg-surface);
    color: var(--text-bright);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 8px 14px;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    transition: border-color var(--transition-fast);
    max-width: 100%;
  }

  .opening-dropdown:focus {
    border-color: var(--accent-emerald);
  }

  /* Studio Main Grid */
  .studio-main-grid {
    display: grid;
    grid-template-columns: minmax(0, 520px) minmax(0, 1fr);
    gap: 24px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  @media (max-width: 1080px) {
    .studio-main-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  /* Left Column: Board Card */
  .board-column {
    min-width: 0;
    width: 100%;
  }

  .board-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 16px;
    box-shadow: var(--shadow-md);
    width: 100%;
    box-sizing: border-box;
  }

  .board-controls-toolbar {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .primary-controls {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .ctrl-btn {
    background: var(--bg-surface-elevated);
    border: 1px solid var(--border-subtle);
    color: var(--text-main);
    height: 38px;
    min-width: 38px;
    padding: 0 10px;
    border-radius: var(--radius-md);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.88rem;
    font-weight: 600;
    gap: 6px;
    transition: all var(--transition-fast);
  }

  .ctrl-btn:hover:not(:disabled) {
    background: var(--bg-surface-hover);
    color: var(--text-bright);
    border-color: var(--border-light);
  }

  .ctrl-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .play-btn {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.35);
    color: #34d399;
  }

  .play-btn:hover:not(:disabled) {
    background: rgba(16, 185, 129, 0.25);
  }

  .play-btn.active {
    background: rgba(245, 158, 11, 0.2);
    border-color: var(--accent-amber);
    color: #fbbf24;
  }

  .secondary-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .util-btn {
    background: transparent;
    border: 1px solid var(--border-subtle);
    color: var(--text-dim);
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .util-btn:hover {
    color: var(--text-bright);
    border-color: var(--border-light);
    background: var(--bg-surface-elevated);
  }

  .copied-badge {
    color: var(--accent-emerald);
    font-weight: 700;
  }

  /* Move timeline chips */
  .move-timeline-wrapper {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
    min-width: 0;
  }

  .timeline-label {
    font-size: 0.74rem;
    color: var(--text-dim);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  .move-chips-scroll {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }

  .move-chip {
    background: var(--bg-primary);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    transition: all var(--transition-fast);
  }

  .move-chip:hover {
    border-color: var(--border-light);
    color: var(--text-bright);
  }

  .move-chip.active {
    background: var(--accent-emerald);
    color: #ffffff;
    border-color: var(--accent-emerald-dark);
    font-weight: 700;
    box-shadow: 0 2px 8px var(--accent-emerald-glow);
  }

  .chip-num {
    opacity: 0.6;
    font-size: 0.75rem;
  }

  /* ========================================================= */
  /* Right Column: Study Panel (Responsive Card Sebelah Kanan) */
  /* ========================================================= */
  .study-panel-column {
    min-width: 0;
    width: 100%;
    container-type: inline-size;
    container-name: study;
  }

  .study-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
  }

  /* Tab Navigation Bar */
  .study-tabs-wrapper {
    position: relative;
    background: #0b1120;
    border-bottom: 1px solid var(--border-subtle);
    width: 100%;
    overflow: hidden;
  }

  .study-tabs-wrapper::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 1px;
    width: 28px;
    background: linear-gradient(to right, transparent, #0b1120);
    pointer-events: none;
    opacity: 0.85;
  }

  .study-tabs-nav {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    gap: 4px;
    padding: 6px 8px 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
  }

  .study-tabs-nav::-webkit-scrollbar {
    height: 4px;
  }

  .study-tabs-nav::-webkit-scrollbar-track {
    background: transparent;
  }

  .study-tabs-nav::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.16);
    border-radius: var(--radius-full);
  }

  .tab-btn {
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.88rem;
    font-weight: 600;
    padding: 12px 14px;
    cursor: pointer;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 8px 8px 0 0;
    transition: all var(--transition-fast);
    user-select: none;
  }

  .tab-btn:hover {
    color: var(--text-bright);
    background: rgba(255, 255, 255, 0.04);
  }

  .tab-btn.active {
    color: var(--accent-emerald);
    border-bottom-color: var(--accent-emerald);
    background: rgba(16, 185, 129, 0.08);
  }

  .tab-icon {
    font-size: 1rem;
    line-height: 1;
  }

  .tab-title {
    line-height: 1.2;
  }

  .tab-content-area {
    padding: 24px;
    min-height: 480px;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  /* Tab 1: Moves Guide */
  .current-move-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
    min-width: 0;
  }

  .move-indicator-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .ply-badge {
    font-size: 0.78rem;
    color: var(--accent-emerald);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .san-display {
    font-size: 2.1rem;
    font-family: var(--font-mono);
    color: var(--text-bright);
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    word-break: break-word;
  }

  .notation-symbol {
    font-size: 2rem;
    line-height: 1;
  }

  .step-summary {
    font-size: 1rem;
    color: var(--text-muted);
    line-height: 1.6;
    word-break: break-word;
  }

  .start-hint-box {
    background: rgba(16, 185, 129, 0.1);
    border: 1px dashed rgba(16, 185, 129, 0.3);
    border-radius: var(--radius-md);
    padding: 14px 16px;
    color: #a7f3d0;
    font-size: 0.92rem;
    word-break: break-word;
  }

  .commentary-card {
    background: #0f172a;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 18px;
    word-break: break-word;
  }

  .commentary-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--accent-emerald);
    font-size: 0.88rem;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .commentary-text {
    font-size: 1rem;
    color: #f1f5f9;
    line-height: 1.65;
    word-break: break-word;
  }

  .key-squares-strip {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .strip-label {
    font-size: 0.82rem;
    color: var(--text-dim);
    font-weight: 600;
  }

  .square-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .square-tag {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
    padding: 3px 8px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .trap-alert-box {
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid rgba(244, 63, 94, 0.3);
    border-radius: var(--radius-md);
    padding: 14px 16px;
    word-break: break-word;
  }

  .trap-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fb7185;
    font-size: 0.88rem;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .trap-desc {
    font-size: 0.9rem;
    color: #fecdd3;
    line-height: 1.5;
    word-break: break-word;
  }

  .mini-step-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 18px;
    border-top: 1px solid var(--border-subtle);
    gap: 12px;
  }

  .step-progress-text {
    font-size: 0.86rem;
    color: var(--text-dim);
    font-weight: 600;
    white-space: nowrap;
  }

  /* Tabs 2, 3, 4: Strategy Sections */
  .section-badge-header {
    margin-bottom: 20px;
    min-width: 0;
  }

  .pane-title {
    font-size: 1.35rem;
    font-weight: 700;
    margin-top: 6px;
    word-break: break-word;
  }

  .strategy-section-box {
    background: #0f172a;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 18px;
    margin-bottom: 16px;
    word-break: break-word;
  }

  .box-icon-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .box-icon-title h4 {
    font-size: 1.05rem;
    word-break: break-word;
  }

  .icon-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .icon-circle.amber {
    background: rgba(245, 158, 11, 0.15);
    color: var(--accent-amber);
  }

  .icon-circle.emerald {
    background: rgba(16, 185, 129, 0.15);
    color: var(--accent-emerald);
  }

  .icon-circle.purple {
    background: rgba(168, 85, 247, 0.15);
    color: var(--accent-purple);
  }

  .box-text {
    font-size: 0.94rem;
    color: var(--text-muted);
    line-height: 1.6;
    word-break: break-word;
  }

  .plans-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .plan-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.94rem;
    color: var(--text-muted);
    line-height: 1.5;
    word-break: break-word;
  }

  .check-bullet {
    color: var(--accent-emerald);
    font-weight: 800;
    flex-shrink: 0;
  }

  .exchange-principles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-top: 10px;
  }

  .principle-card {
    background: #172033;
    padding: 12px;
    border-radius: var(--radius-sm);
    font-size: 0.86rem;
    color: var(--text-muted);
    word-break: break-word;
  }

  .principle-badge {
    display: inline-block;
    font-size: 0.74rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .principle-badge.keep {
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
  }

  .principle-badge.trade {
    background: rgba(244, 63, 94, 0.2);
    color: #fb7185;
  }

  /* Tab 4: Counter Matrix */
  .counter-intro {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-bottom: 20px;
    line-height: 1.6;
    word-break: break-word;
  }

  .counter-cards-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .counter-weapon-card {
    background: #0f172a;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 18px;
    transition: border-color var(--transition-fast);
    word-break: break-word;
  }

  .counter-weapon-card:hover {
    border-color: var(--border-light);
  }

  .counter-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .counter-name-group {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1 1 180px;
  }

  .weapon-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .counter-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-bright);
    word-break: break-word;
  }

  .counter-moves-tag {
    background: var(--bg-surface-elevated);
    color: var(--accent-amber);
    padding: 4px 10px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    max-width: 100%;
    word-break: break-word;
    white-space: normal;
    line-height: 1.4;
    display: inline-block;
  }

  .counter-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    word-break: break-word;
  }

  .counter-field {
    font-size: 0.9rem;
    line-height: 1.5;
    word-break: break-word;
  }

  .field-title {
    font-weight: 700;
    color: var(--text-bright);
    display: block;
    margin-bottom: 3px;
    font-size: 0.84rem;
  }

  .field-content {
    color: var(--text-muted);
    word-break: break-word;
  }

  .weakness-field {
    background: rgba(244, 63, 94, 0.08);
    border-left: 3px solid #f43f5e;
    padding: 10px 12px;
    border-radius: 4px;
    word-break: break-word;
  }

  .weakness-field .field-title {
    color: #fb7185;
  }

  /* Tab 5: Quiz */
  .quiz-progress-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .quiz-progress-label {
    font-size: 0.82rem;
    color: var(--text-dim);
    font-weight: 600;
  }

  .quiz-score-badge {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    font-weight: 700;
    font-size: 0.82rem;
    padding: 3px 10px;
    border-radius: var(--radius-full);
  }

  .quiz-question-box {
    background: #0f172a;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 18px;
    margin-bottom: 16px;
    word-break: break-word;
  }

  .question-badge {
    display: inline-block;
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--accent-emerald);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
  }

  .quiz-question-text {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-bright);
    line-height: 1.45;
    word-break: break-word;
  }

  .quiz-instructions {
    font-size: 0.86rem;
    color: var(--text-dim);
    margin-bottom: 14px;
    word-break: break-word;
  }

  .quiz-choices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 10px;
    margin-bottom: 16px;
  }

  .quiz-choice-btn {
    background: var(--bg-surface-elevated);
    border: 1px solid var(--border-subtle);
    color: var(--text-bright);
    font-family: var(--font-mono);
    font-size: 1.15rem;
    font-weight: 700;
    padding: 12px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
  }

  .quiz-choice-btn:hover {
    background: var(--accent-emerald);
    color: #ffffff;
    border-color: var(--accent-emerald-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--accent-emerald-glow);
  }

  .quiz-hint-section {
    margin-bottom: 16px;
  }

  .hint-toggle-btn {
    background: transparent;
    border: none;
    color: var(--accent-amber);
    font-family: inherit;
    font-size: 0.86rem;
    font-weight: 600;
    cursor: pointer;
  }

  .hint-toggle-btn:hover {
    text-decoration: underline;
  }

  .hint-content-box {
    background: rgba(245, 158, 11, 0.1);
    border-left: 3px solid var(--accent-amber);
    border-radius: 4px;
    padding: 10px 14px;
    font-size: 0.88rem;
    color: #fde68a;
    line-height: 1.5;
    word-break: break-word;
  }

  .hint-title {
    font-weight: 700;
    color: #fbbf24;
    display: block;
    margin-bottom: 2px;
  }

  .quiz-feedback-box {
    padding: 14px 16px;
    border-radius: var(--radius-md);
    animation: fadeIn 0.2s ease;
    word-break: break-word;
  }

  .quiz-feedback-box.correct {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid var(--accent-emerald);
    color: #a7f3d0;
  }

  .quiz-feedback-box.wrong {
    background: rgba(244, 63, 94, 0.15);
    border: 1px solid #f43f5e;
    color: #fecdd3;
  }

  .feedback-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 4px;
  }

  .feedback-desc {
    font-size: 0.88rem;
    line-height: 1.5;
    word-break: break-word;
  }

  .quiz-completion-card {
    text-align: center;
    padding: 40px 20px;
    background: #0f172a;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    word-break: break-word;
  }

  .trophy-icon {
    font-size: 3.5rem;
    margin-bottom: 12px;
  }

  .quiz-completion-card h3 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  .quiz-completion-card p {
    color: var(--text-muted);
    margin-bottom: 20px;
    max-width: 440px;
    margin-left: auto;
    margin-right: auto;
    word-break: break-word;
  }

  .final-score-display {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 24px;
    color: var(--text-bright);
  }

  .score-num {
    color: var(--accent-emerald);
    font-weight: 800;
    font-size: 1.4rem;
  }

  /* ========================================================= */
  /* Container Queries for size-aware card adaptation          */
  /* ========================================================= */
  @container study (max-width: 560px) {
    .tab-btn {
      padding: 10px 11px;
      font-size: 0.82rem;
      gap: 6px;
    }

    .tab-icon {
      font-size: 0.92rem;
    }

    .tab-content-area {
      padding: 18px 14px;
      min-height: 380px;
    }

    .san-display {
      font-size: 1.65rem;
    }

    .commentary-card {
      padding: 14px;
    }

    .mini-step-nav {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .step-progress-text {
      grid-column: 1 / -1;
      text-align: center;
      order: -1;
      font-size: 0.82rem;
      margin-bottom: 2px;
    }

    .mini-step-nav .btn {
      width: 100%;
      padding: 9px 10px;
      font-size: 0.86rem;
      text-align: center;
    }

    .strategy-section-box {
      padding: 14px 12px;
    }

    .counter-weapon-card {
      padding: 14px 12px;
    }

    .quiz-question-box {
      padding: 14px;
    }

    .quiz-question-text {
      font-size: 1.05rem;
    }

    .quiz-completion-card {
      padding: 28px 16px;
    }
  }

  @container study (max-width: 400px) {
    .tab-content-area {
      padding: 14px 10px;
    }

    .san-display {
      font-size: 1.45rem;
    }

    .counter-card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .counter-moves-tag {
      font-size: 0.76rem;
    }

    .quiz-choices-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }

  /* ========================================================= */
  /* Viewport Media Queries                                    */
  /* ========================================================= */
  @media (max-width: 640px) {
    .studio-container {
      padding: 16px 12px 60px;
    }

    .opening-title {
      font-size: 1.6rem;
    }

    .header-right {
      width: 100%;
    }

    .quick-switcher {
      width: 100%;
    }

    .opening-dropdown {
      width: 100%;
    }

    .board-card {
      padding: 12px;
    }

    .board-controls-toolbar {
      justify-content: center;
    }

    .primary-controls,
    .secondary-controls {
      justify-content: center;
      width: 100%;
    }

    .tab-content-area {
      padding: 16px 12px;
    }

    .san-display {
      font-size: 1.6rem;
    }

    .exchange-principles {
      grid-template-columns: 1fr;
    }

    .mini-step-nav {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .step-progress-text {
      grid-column: 1 / -1;
      text-align: center;
      order: -1;
    }

    .mini-step-nav .btn {
      width: 100%;
      padding: 9px 10px;
      font-size: 0.86rem;
    }
  }
</style>
