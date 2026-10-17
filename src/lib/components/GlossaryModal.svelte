<script>
  import { chessGlossary } from '../data/glossary.js';

  let { isOpen = false, onClose = () => {} } = $props();

  let searchQuery = $state('');
  let activeCategory = $state('Semua');

  const categories = ['Semua', 'Strategi Midgame', 'Struktur Pion', 'Taktik', 'Endgame', 'Pembukaan'];

  let filteredGlossary = $derived(
    chessGlossary.filter(item => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.example.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === 'Semua' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
  );

  function handleKeydown(event) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <!-- Backdrop -->
  <div class="modal-backdrop" onclick={onClose} role="presentation"></div>

  <!-- Modal Dialog -->
  <div class="modal-wrapper" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-title-group">
          <div class="modal-icon-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <h2 id="modal-title" class="modal-title">Kamus & Glosarium Istilah Catur</h2>
            <p class="modal-subtitle">Panduan istilah strategi catur dalam Bahasa Indonesia</p>
          </div>
        </div>

        <button type="button" class="close-btn" onclick={onClose} aria-label="Tutup dialog">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Search & Filter Category -->
      <div class="modal-filter-bar">
        <div class="search-input-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cari istilah (contoh: Carlsbad, Fianchetto, Outpost)..."
            bind:value={searchQuery}
            class="search-input"
          />
          {#if searchQuery}
            <button type="button" class="clear-btn" onclick={() => (searchQuery = '')}>×</button>
          {/if}
        </div>

        <div class="category-pills">
          {#each categories as cat}
            <button
              type="button"
              class="cat-pill {activeCategory === cat ? 'active' : ''}"
              onclick={() => (activeCategory = cat)}
            >
              {cat}
            </button>
          {/each}
        </div>
      </div>

      <!-- Glossary List -->
      <div class="glossary-items-container">
        {#if filteredGlossary.length === 0}
          <div class="empty-state">
            <p>Tidak ditemukan istilah yang cocok dengan "{searchQuery}".</p>
          </div>
        {:else}
          <div class="glossary-grid">
            {#each filteredGlossary as item}
              <div class="glossary-card">
                <div class="card-top">
                  <h3 class="term-title">{item.term}</h3>
                  <span class="badge badge-emerald">{item.category}</span>
                </div>
                <p class="term-definition">{item.definition}</p>
                {#if item.example}
                  <div class="term-example">
                    <span class="example-label">Contoh Praktis:</span>
                    <span class="example-text">{item.example}</span>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <span class="terms-count">Menampilkan {filteredGlossary.length} dari {chessGlossary.length} istilah</span>
        <button type="button" class="btn btn-primary" onclick={onClose}>Mengerti, Tutup</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    z-index: 99;
    animation: fadeIn 0.2s ease;
  }

  .modal-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 100;
    pointer-events: none;
  }

  .modal-content {
    pointer-events: auto;
    width: 100%;
    max-width: 760px;
    max-height: 85vh;
    background: #111827;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.85);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes modalEnter {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(12px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .modal-title-group {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .modal-icon-badge {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: var(--accent-emerald);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .modal-subtitle {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--text-dim);
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .close-btn:hover {
    background: var(--bg-surface-elevated);
    color: var(--text-bright);
  }

  .modal-filter-bar {
    padding: 16px 24px;
    background: #0f172a;
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .search-input-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input-box svg {
    position: absolute;
    left: 14px;
    color: var(--text-dim);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    background: #172033;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    color: var(--text-bright);
    font-family: inherit;
    font-size: 0.92rem;
    padding: 10px 36px 10px 42px;
    outline: none;
    transition: border-color var(--transition-fast);
  }

  .search-input:focus {
    border-color: var(--accent-emerald);
    box-shadow: 0 0 0 3px var(--accent-emerald-glow);
  }

  .clear-btn {
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    color: var(--text-dim);
    font-size: 1.2rem;
    cursor: pointer;
  }

  .category-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cat-pill {
    background: #1e293b;
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .cat-pill:hover {
    color: var(--text-bright);
    border-color: var(--border-light);
  }

  .cat-pill.active {
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
    border-color: var(--accent-emerald);
  }

  .glossary-items-container {
    padding: 20px 24px;
    overflow-y: auto;
    flex: 1;
  }

  .glossary-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .glossary-card {
    background: #172033;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 16px;
    transition: transform var(--transition-fast), border-color var(--transition-fast);
  }

  .glossary-card:hover {
    border-color: var(--border-light);
    transform: translateY(-1px);
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
  }

  .term-title {
    font-size: 1.08rem;
    color: #f8fafc;
  }

  .term-definition {
    font-size: 0.88rem;
    color: var(--text-muted);
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .term-example {
    background: rgba(15, 23, 42, 0.6);
    border-left: 3px solid var(--accent-emerald);
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 0.82rem;
  }

  .example-label {
    font-weight: 700;
    color: var(--text-bright);
    margin-right: 6px;
  }

  .example-text {
    color: #cbd5e1;
  }

  .empty-state {
    padding: 40px;
    text-align: center;
    color: var(--text-dim);
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0f172a;
  }

  .terms-count {
    font-size: 0.82rem;
    color: var(--text-dim);
  }
</style>
