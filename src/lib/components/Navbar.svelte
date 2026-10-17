<script>
  import { toggleMute, getMuteState, playMoveSound } from '../sound.js';

  let {
    activeSide = $bindable('all'),
    selectedOpening = null,
    onBackToList = () => {},
    onOpenGlossary = () => {}
  } = $props();

  let isMuted = $state(getMuteState());

  function handleMuteClick() {
    isMuted = toggleMute();
    if (!isMuted) {
      playMoveSound();
    }
  }
</script>

<header class="navbar">
  <div class="nav-container">
    <!-- Brand Logo -->
    <div class="brand-group">
      <button class="brand-btn" onclick={onBackToList} title="Kembali ke Beranda">
        <div class="logo-icon-box">
          <img src="/pieces/wN.svg" alt="CaturMaster Logo" class="brand-icon" />
        </div>
        <div class="brand-text">
          <span class="brand-title">CaturMaster<span class="brand-accent">.id</span></span>
          <span class="brand-subtitle">Akademi Pembukaan Catur Populer</span>
        </div>
      </button>

      {#if selectedOpening}
        <div class="breadcrumb-divider">/</div>
        <div class="active-opening-chip">
          <span class="badge {selectedOpening.side === 'white' ? 'badge-white' : 'badge-black'}">
            {selectedOpening.side === 'white' ? '♔ Putih' : '♚ Hitam'}
          </span>
          <span class="active-opening-name">{selectedOpening.name}</span>
        </div>
      {/if}
    </div>

    <!-- Center: Side Toggle (if on list view) -->
    {#if !selectedOpening}
      <div class="side-selector">
        <button
          type="button"
          class="side-btn {activeSide === 'all' ? 'active' : ''}"
          onclick={() => (activeSide = 'all')}
        >
          Semua (12)
        </button>
        <button
          type="button"
          class="side-btn white-btn {activeSide === 'white' ? 'active' : ''}"
          onclick={() => (activeSide = 'white')}
        >
          <span class="piece-symbol">♔</span> Sebagai Putih (6)
        </button>
        <button
          type="button"
          class="side-btn black-btn {activeSide === 'black' ? 'active' : ''}"
          onclick={() => (activeSide = 'black')}
        >
          <span class="piece-symbol">♚</span> Sebagai Hitam (6)
        </button>
      </div>
    {:else}
      <div class="nav-center-action">
        <button type="button" class="btn btn-secondary back-btn" onclick={onBackToList} title="Kembali ke Daftar Pembukaan">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span class="back-text">Daftar Pembukaan</span>
        </button>
      </div>
    {/if}

    <!-- Right Controls: Audio + Glosarium -->
    <div class="nav-actions">
      <button
        type="button"
        class="action-btn glossary-btn"
        onclick={onOpenGlossary}
        title="Buka Glosarium & Kamus Istilah Catur"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="9" y1="7" x2="15" y2="7" />
          <line x1="9" y1="11" x2="13" y2="11" />
        </svg>
        <span class="btn-label">Kamus Istilah</span>
      </button>

      <button
        type="button"
        class="action-btn audio-btn {isMuted ? 'muted' : ''}"
        onclick={handleMuteClick}
        title={isMuted ? 'Aktifkan Suara Bidak' : 'Matikan Suara (Mute)'}
        aria-label={isMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
      >
        {#if isMuted}
          <!-- Muted icon -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        {:else}
          <!-- Sound on icon -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</header>

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(11, 15, 23, 0.85);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border-subtle);
    padding: 12px 20px;
  }

  .nav-container {
    max-width: 1380px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .brand-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    padding: 0;
  }

  .logo-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 78, 59, 0.4));
    border: 1px solid rgba(16, 185, 129, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
  }

  .brand-icon {
    width: 28px;
    height: 28px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .brand-title {
    font-size: 1.18rem;
    font-weight: 800;
    color: var(--text-bright);
    letter-spacing: -0.02em;
    display: block;
  }

  .brand-accent {
    color: var(--accent-emerald);
  }

  .brand-subtitle {
    font-size: 0.73rem;
    color: var(--text-dim);
    font-weight: 500;
    display: block;
  }

  .breadcrumb-divider {
    color: var(--text-dim);
    font-size: 1.2rem;
  }

  .active-opening-chip {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .active-opening-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-bright);
  }

  /* Center side selector pills */
  .side-selector {
    display: flex;
    align-items: center;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-full);
    padding: 3px;
    gap: 2px;
  }

  .side-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .side-btn:hover {
    color: var(--text-bright);
  }

  .side-btn.active {
    background: var(--bg-surface-elevated);
    color: var(--text-bright);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .side-btn.white-btn.active {
    background: rgba(248, 250, 252, 0.15);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .side-btn.black-btn.active {
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .piece-symbol {
    font-size: 1rem;
    line-height: 1;
  }

  .back-btn {
    font-size: 0.88rem;
    padding: 7px 14px;
  }

  /* Right Action Buttons */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-radius: var(--radius-md);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.86rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .action-btn:hover {
    background: var(--bg-surface-elevated);
    color: var(--text-bright);
    border-color: var(--border-light);
  }

  .glossary-btn {
    color: var(--accent-emerald);
    border-color: rgba(16, 185, 129, 0.25);
  }

  .glossary-btn:hover {
    background: rgba(16, 185, 129, 0.15);
    border-color: var(--accent-emerald);
  }

  .audio-btn {
    padding: 8px 10px;
  }

  .audio-btn.muted {
    color: var(--accent-rose);
    border-color: rgba(244, 63, 94, 0.3);
  }

  @media (max-width: 900px) {
    .side-selector {
      display: none;
    }
    .brand-subtitle {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .navbar {
      padding: 10px 12px;
    }
    .btn-label {
      display: none;
    }
    .action-btn {
      padding: 8px 10px;
    }
    .active-opening-name {
      display: none;
    }
    .breadcrumb-divider {
      display: none;
    }
    .active-opening-chip {
      display: none;
    }
    .back-text {
      display: none;
    }
    .back-btn {
      padding: 8px 10px;
    }
  }
</style>
