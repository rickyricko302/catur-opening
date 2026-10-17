<script>
  import { onMount } from 'svelte';
  import Navbar from './lib/components/Navbar.svelte';
  import OpeningList from './lib/components/OpeningList.svelte';
  import OpeningStudio from './lib/components/OpeningStudio.svelte';
  import GlossaryModal from './lib/components/GlossaryModal.svelte';
  import { chessOpenings } from './lib/data/openings.js';

  // Application State using Svelte 5 Runes
  let activeSide = $state('all'); // 'all' | 'white' | 'black'
  let selectedOpening = $state(null);
  let isGlossaryOpen = $state(false);

  function handleSelectOpening(opening) {
    selectedOpening = opening;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBackToList() {
    selectedOpening = null;
  }

  function handleOpenGlossary() {
    isGlossaryOpen = true;
  }

  function handleCloseGlossary() {
    isGlossaryOpen = false;
  }
</script>

<div class="app-layout">
  <!-- Navbar -->
  <Navbar
    bind:activeSide
    {selectedOpening}
    onBackToList={handleBackToList}
    onOpenGlossary={handleOpenGlossary}
  />

  <!-- Main View Container -->
  <main class="main-content">
    {#if selectedOpening}
      <OpeningStudio
        opening={selectedOpening}
        allOpenings={chessOpenings}
        onSelectOtherOpening={handleSelectOpening}
        onBackToList={handleBackToList}
      />
    {:else}
      <OpeningList
        bind:activeSide
        onSelectOpening={handleSelectOpening}
      />
    {/if}
  </main>

  <!-- Global Footer -->
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <div class="footer-logo">
          <img src="/pieces/wN.svg" alt="CaturMaster Logo" class="footer-icon" />
          <span class="footer-title">CaturMaster<span class="accent-dot">.id</span></span>
        </div>
        <p class="footer-tagline">
          Platform pembelajaran pembukaan catur paling komprehensif dalam Bahasa Indonesia. Memahami ide strategis di balik langkah, dari pembukaan, babak tengah, hingga akhir permainan.
        </p>
      </div>

      <div class="footer-links-group">
        <h4 class="footer-col-title">Pembukaan Populer</h4>
        <ul class="footer-links-list">
          {#each chessOpenings.slice(0, 5) as op}
            <li>
              <button
                type="button"
                class="footer-link-btn"
                onclick={() => handleSelectOpening(op)}
              >
                {op.name} ({op.nameId})
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <div class="footer-links-group">
        <h4 class="footer-col-title">Pusat Belajar</h4>
        <ul class="footer-links-list">
          <li>
            <button
              type="button"
              class="footer-link-btn"
              onclick={() => {
                activeSide = 'white';
                selectedOpening = null;
              }}
            >
              ♔ Repertoar Putih (1.e4, 1.d4, 1.c4)
            </button>
          </li>
          <li>
            <button
              type="button"
              class="footer-link-btn"
              onclick={() => {
                activeSide = 'black';
                selectedOpening = null;
              }}
            >
              ♚ Repertoar Hitam (Sisilia, Prancis, Caro-Kann, KID)
            </button>
          </li>
          <li>
            <button
              type="button"
              class="footer-link-btn"
              onclick={handleOpenGlossary}
            >
              📖 Glosarium & Kamus Istilah Catur
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 CaturMaster.id — Dibangun dengan Svelte 5, chess.js & Cinta untuk Komunitas Catur Indonesia.</p>
    </div>
  </footer>

  <!-- Glossary Modal -->
  <GlossaryModal
    isOpen={isGlossaryOpen}
    onClose={handleCloseGlossary}
  />
</div>

<style>
  .app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-primary);
  }

  .main-content {
    flex: 1;
  }

  /* Footer */
  .app-footer {
    background: #080c14;
    border-top: 1px solid var(--border-subtle);
    padding: 60px 20px 30px;
    margin-top: 40px;
  }

  .footer-container {
    max-width: 1380px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .footer-icon {
    width: 32px;
    height: 32px;
  }

  .footer-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-bright);
  }

  .accent-dot {
    color: var(--accent-emerald);
  }

  .footer-tagline {
    font-size: 0.9rem;
    color: var(--text-dim);
    line-height: 1.6;
    max-width: 480px;
  }

  .footer-col-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-bright);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .footer-links-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-link-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.88rem;
    cursor: pointer;
    padding: 0;
    text-align: left;
    transition: color var(--transition-fast);
  }

  .footer-link-btn:hover {
    color: var(--accent-emerald);
  }

  .footer-bottom {
    max-width: 1380px;
    margin: 0 auto;
    padding-top: 24px;
    border-top: 1px solid var(--border-subtle);
    text-align: center;
    font-size: 0.82rem;
    color: var(--text-dim);
  }

  @media (max-width: 900px) {
    .footer-container {
      grid-template-columns: 1fr;
      gap: 30px;
    }
  }
</style>
