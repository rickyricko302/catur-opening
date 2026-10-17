<script>
  import { chessOpenings } from '../data/openings.js';

  let {
    activeSide = 'all',
    onSelectOpening = () => {}
  } = $props();

  let searchQuery = $state('');
  let selectedStyle = $state('all');
  let selectedDifficulty = $state('all');

  const styles = [
    { id: 'all', label: 'Semua Gaya' },
    { id: 'Taktikal / Agresif', label: '⚔️ Taktikal / Agresif' },
    { id: 'Posisional / Solid', label: '🛡️ Posisional / Solid' },
    { id: 'Universal / Fleksibel', label: '✨ Universal / Fleksibel' },
    { id: 'Universal / Praktis', label: '🎯 Praktis / Pemula' }
  ];

  let filteredOpenings = $derived(
    chessOpenings.filter(op => {
      // Filter by side
      if (activeSide !== 'all' && op.side !== activeSide) return false;

      // Filter by style
      if (selectedStyle !== 'all') {
        if (!op.style.includes(selectedStyle.replace(/^[^\w]+/, '').trim())) return false;
      }

      // Filter by difficulty
      if (selectedDifficulty !== 'all' && op.difficulty !== selectedDifficulty) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = op.name.toLowerCase().includes(q);
        const matchesNameId = op.nameId.toLowerCase().includes(q);
        const matchesEco = op.ecoCode.toLowerCase().includes(q);
        const matchesSummary = op.summary.toLowerCase().includes(q);
        if (!matchesName && !matchesNameId && !matchesEco && !matchesSummary) return false;
      }

      return true;
    })
  );

  function getFirstFewMoves(moves) {
    return moves.slice(0, 6).map((m, idx) => {
      const moveNum = Math.floor(idx / 2) + 1;
      return idx % 2 === 0 ? `${moveNum}.${m.san}` : m.san;
    }).join(' ');
  }
</script>

<div class="openings-view">
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-badge">
      <span class="badge badge-emerald">🏆 100% Bahasa Indonesia</span>
      <span class="badge badge-white">Ditenagai Svelte 5 & chess.js</span>
    </div>
    <h1 class="hero-title">
      Kuasai Pembukaan Catur Populer dengan <span class="gradient-text">Pemahaman Strategis</span>
    </h1>
    <p class="hero-description">
      Bukan sekadar menghafal langkah buta. Pelajari maksud tersembunyi setiap langkah, antisipasi jebakan taktis, kuasai transisi babak tengah (midgame) ke babak akhir (endgame), dan temukan senjata counter terbaiknya.
    </p>

    <!-- Side Switcher Tabs on Hero for Mobile & Quick Access -->
    <div class="hero-side-tabs">
      <button
        type="button"
        class="hero-tab {activeSide === 'all' ? 'active' : ''}"
        onclick={() => (activeSide = 'all')}
      >
        Semua Pembukaan ({chessOpenings.length})
      </button>
      <button
        type="button"
        class="hero-tab {activeSide === 'white' ? 'active white-tab' : ''}"
        onclick={() => (activeSide = 'white')}
      >
        ♔ Bermain Sebagai Putih (6)
      </button>
      <button
        type="button"
        class="hero-tab {activeSide === 'black' ? 'active black-tab' : ''}"
        onclick={() => (activeSide = 'black')}
      >
        ♚ Bermain Sebagai Hitam (6)
      </button>
    </div>
  </section>

  <!-- Filter & Search Controls -->
  <section class="filter-controls-container">
    <div class="search-bar-wrapper">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Cari nama pembukaan (misal: Ruy Lopez, Sisilia, London, C60)..."
        bind:value={searchQuery}
        class="search-text-input"
      />
      {#if searchQuery}
        <button type="button" class="clear-search-btn" onclick={() => (searchQuery = '')}>×</button>
      {/if}
    </div>

    <!-- Style Filter Buttons -->
    <div class="style-filters">
      {#each styles as style}
        <button
          type="button"
          class="style-btn {selectedStyle === style.id ? 'active' : ''}"
          onclick={() => (selectedStyle = style.id)}
        >
          {style.label}
        </button>
      {/each}
    </div>
  </section>

  <!-- Opening Cards Grid -->
  <section class="cards-section">
    <div class="cards-header">
      <h2 class="section-title">
        Katalog Pembukaan
        <span class="count-badge">{filteredOpenings.length} Pilihan</span>
      </h2>
    </div>

    {#if filteredOpenings.length === 0}
      <div class="no-results-box">
        <img src="/pieces/bK.svg" alt="Empty" class="no-results-img" />
        <h3>Tidak ada pembukaan yang cocok</h3>
        <p>Coba gunakan kata kunci pencarian lain atau setel filter kembali ke semua.</p>
        <button
          type="button"
          class="btn btn-secondary"
          onclick={() => {
            searchQuery = '';
            selectedStyle = 'all';
            activeSide = 'all';
          }}
        >
          Reset Filter
        </button>
      </div>
    {:else}
      <div class="openings-grid">
        {#each filteredOpenings as op}
          <div
            class="opening-card {op.side}"
            onclick={() => onSelectOpening(op)}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === 'Enter' && onSelectOpening(op)}
          >
            <!-- Card Header -->
            <div class="card-head">
              <div class="side-indicator">
                <span class="badge {op.side === 'white' ? 'badge-white' : 'badge-black'}">
                  {op.side === 'white' ? '♔ Putih' : '♚ Hitam'}
                </span>
                <span class="badge badge-emerald">{op.ecoCode}</span>
              </div>
              <span class="badge badge-amber">{op.difficulty}</span>
            </div>

            <!-- Card Titles -->
            <div class="card-main">
              <h3 class="card-title">{op.name}</h3>
              <h4 class="card-subtitle">{op.nameId}</h4>
              <p class="card-desc">{op.summary}</p>
            </div>

            <!-- Notation Preview -->
            <div class="moves-preview">
              <span class="moves-label">Langkah Kunci:</span>
              <code class="moves-code">{getFirstFewMoves(op.moves)}...</code>
            </div>

            <!-- Win Rate Bar -->
            <div class="winrate-section">
              <div class="winrate-label">
                <span>Statistik Hasil Master:</span>
                <span class="winrate-stat">W: {op.winRate.white}% | D: {op.winRate.draw}% | B: {op.winRate.black}%</span>
              </div>
              <div class="winrate-bar">
                <div class="bar-segment bar-white" style="width: {op.winRate.white}%" title="Menang Putih: {op.winRate.white}%"></div>
                <div class="bar-segment bar-draw" style="width: {op.winRate.draw}%" title="Remis: {op.winRate.draw}%"></div>
                <div class="bar-segment bar-black" style="width: {op.winRate.black}%" title="Menang Hitam: {op.winRate.black}%"></div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="card-footer">
              <span class="style-tag">⚡ {op.style}</span>
              <span class="explore-cta">
                Buka Simulasi
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .openings-view {
    max-width: 1380px;
    margin: 0 auto;
    padding: 32px 20px 80px;
  }

  /* Hero Section */
  .hero-section {
    text-align: center;
    max-width: 860px;
    margin: 0 auto 40px;
    padding: 20px 10px;
  }

  .hero-badge {
    display: inline-flex;
    gap: 8px;
    margin-bottom: 18px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero-title {
    font-size: 2.75rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 18px;
    line-height: 1.18;
  }

  .gradient-text {
    background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-description {
    font-size: 1.12rem;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 28px;
  }

  .hero-side-tabs {
    display: inline-flex;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-full);
    padding: 4px;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero-tab {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.92rem;
    font-weight: 600;
    padding: 8px 18px;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .hero-tab:hover {
    color: var(--text-bright);
  }

  .hero-tab.active {
    background: var(--bg-surface-elevated);
    color: var(--text-bright);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .hero-tab.white-tab.active {
    background: rgba(255, 255, 255, 0.16);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.25);
  }

  .hero-tab.black-tab.active {
    background: rgba(16, 185, 129, 0.22);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.35);
  }

  /* Filter Controls */
  .filter-controls-container {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 16px 20px;
    margin-bottom: 36px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .search-bar-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    color: var(--text-dim);
    pointer-events: none;
  }

  .search-text-input {
    width: 100%;
    background: var(--bg-primary);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    color: var(--text-bright);
    font-family: inherit;
    font-size: 0.95rem;
    padding: 12px 40px 12px 48px;
    outline: none;
    transition: all var(--transition-fast);
  }

  .search-text-input:focus {
    border-color: var(--accent-emerald);
    box-shadow: 0 0 0 3px var(--accent-emerald-glow);
  }

  .clear-search-btn {
    position: absolute;
    right: 14px;
    background: transparent;
    border: none;
    color: var(--text-dim);
    font-size: 1.3rem;
    cursor: pointer;
  }

  .style-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .style-btn {
    background: var(--bg-primary);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .style-btn:hover {
    color: var(--text-bright);
    border-color: var(--border-light);
  }

  .style-btn.active {
    background: rgba(16, 185, 129, 0.18);
    color: #34d399;
    border-color: var(--accent-emerald);
  }

  /* Grid of Cards */
  .cards-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
  }

  .section-title {
    font-size: 1.45rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .count-badge {
    font-size: 0.82rem;
    font-weight: 600;
    background: var(--bg-surface-elevated);
    color: var(--accent-emerald);
    padding: 3px 10px;
    border-radius: var(--radius-full);
    border: 1px solid rgba(16, 185, 129, 0.25);
  }

  .openings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }

  .opening-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
  }

  .opening-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: transparent;
    transition: background var(--transition-fast);
  }

  .opening-card.white:hover::before {
    background: linear-gradient(90deg, #f8fafc, #94a3b8);
  }

  .opening-card.black:hover::before {
    background: linear-gradient(90deg, #10b981, #059669);
  }

  .opening-card:hover {
    transform: translateY(-4px);
    border-color: var(--border-light);
    box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.6);
    background: var(--bg-surface-elevated);
  }

  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .side-indicator {
    display: flex;
    gap: 6px;
  }

  .card-main {
    margin-bottom: 16px;
  }

  .card-title {
    font-size: 1.32rem;
    font-weight: 700;
    color: var(--text-bright);
    margin-bottom: 2px;
  }

  .card-subtitle {
    font-size: 0.92rem;
    font-weight: 500;
    color: var(--accent-emerald);
    margin-bottom: 10px;
  }

  .card-desc {
    font-size: 0.86rem;
    color: var(--text-muted);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .moves-preview {
    background: rgba(9, 13, 22, 0.6);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .moves-label {
    font-size: 0.72rem;
    color: var(--text-dim);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .moves-code {
    font-family: var(--font-mono);
    font-size: 0.84rem;
    color: #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .winrate-section {
    margin-bottom: 18px;
  }

  .winrate-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.74rem;
    color: var(--text-dim);
    margin-bottom: 6px;
  }

  .winrate-stat {
    font-family: var(--font-mono);
    color: var(--text-muted);
  }

  .winrate-bar {
    display: flex;
    height: 6px;
    border-radius: var(--radius-full);
    overflow: hidden;
    background: #0f172a;
  }

  .bar-white {
    background: #e2e8f0;
  }

  .bar-draw {
    background: #64748b;
  }

  .bar-black {
    background: #059669;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid var(--border-subtle);
  }

  .style-tag {
    font-size: 0.78rem;
    color: var(--text-dim);
    font-weight: 500;
  }

  .explore-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.86rem;
    font-weight: 700;
    color: var(--accent-emerald);
    transition: gap var(--transition-fast);
  }

  .opening-card:hover .explore-cta {
    gap: 9px;
  }

  .no-results-box {
    padding: 60px 20px;
    text-align: center;
    background: var(--bg-surface);
    border-radius: var(--radius-lg);
    border: 1px dashed var(--border-light);
  }

  .no-results-img {
    width: 64px;
    height: 64px;
    opacity: 0.4;
    margin-bottom: 16px;
  }

  .no-results-box h3 {
    margin-bottom: 8px;
  }

  .no-results-box p {
    color: var(--text-muted);
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
    .openings-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
