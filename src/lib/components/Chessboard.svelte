<script>
  import { parseFen, squareToSvgCenter, calculateArrowPath, FILES, RANKS } from '../chessBoardHelper.js';

  let {
    fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    orientation = 'white',
    arrows = [],
    highlightSquares = [],
    selectedSquare = null,
    legalDests = [],
    interactive = false,
    onSquareClick = () => {}
  } = $props();

  // Parse FEN
  let parsed = $derived(parseFen(fen));

  // Rows and Cols based on orientation
  let displayFiles = $derived(orientation === 'white' ? FILES : [...FILES].reverse());
  let displayRanks = $derived(orientation === 'white' ? RANKS : [...RANKS].reverse());

  // Helper to get piece at square name e.g. 'e4'
  function getPieceAt(squareName) {
    if (!squareName || squareName.length < 2) return null;
    const fileChar = squareName[0].toLowerCase();
    const rankNum = parseInt(squareName[1], 10);
    const fileIdx = FILES.indexOf(fileChar);
    const rankIdx = 8 - rankNum; // 0 is rank 8, 7 is rank 1
    if (rankIdx < 0 || rankIdx > 7 || fileIdx < 0 || fileIdx > 7) return null;
    return parsed.board[rankIdx]?.[fileIdx] || null;
  }

  function handleCellClick(squareName) {
    if (interactive) {
      onSquareClick(squareName);
    }
  }
</script>

<div class="chessboard-wrapper select-none">
  <div class="chessboard-container">
    <div class="board-grid">
      {#each displayRanks as rank, rIdx}
        {#each displayFiles as file, fIdx}
          {@const squareName = `${file}${rank}`}
          {@const isLight = (FILES.indexOf(file) + rank) % 2 !== 0}
          {@const piece = getPieceAt(squareName)}
          {@const isSelected = selectedSquare === squareName}
          {@const isHighlighted = highlightSquares.includes(squareName)}
          {@const isLegalDest = legalDests.includes(squareName)}
          
          <button
            type="button"
            class="square {isLight ? 'light' : 'dark'} {isSelected ? 'selected' : ''} {isHighlighted ? 'highlighted' : ''} {isLegalDest ? 'legal-dest' : ''}"
            onclick={() => handleCellClick(squareName)}
            data-square={squareName}
            aria-label="{squareName} {piece ? `${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}` : 'Empty'}"
          >
            <!-- Rank Coordinate label on first column -->
            {#if fIdx === 0}
              <span class="coord rank-coord">{rank}</span>
            {/if}

            <!-- File Coordinate label on bottom row -->
            {#if rIdx === 7}
              <span class="coord file-coord">{file}</span>
            {/if}

            <!-- Legal move target dot indicator -->
            {#if isLegalDest}
              {#if piece}
                <div class="capture-ring"></div>
              {:else}
                <div class="legal-dot"></div>
              {/if}
            {/if}

            <!-- Piece Image -->
            {#if piece}
              <img
                src={piece.asset}
                alt="{piece.color === 'w' ? 'White' : 'Black'} {piece.type}"
                class="piece-img {isSelected ? 'piece-selected' : ''}"
                draggable="false"
              />
            {/if}
          </button>
        {/each}
      {/each}
    </div>

    <!-- SVG Overlay for Tactical Arrows -->
    {#if arrows && arrows.length > 0}
      <svg class="arrows-overlay" viewBox="0 0 800 800" pointer-events="none">
        <defs>
          <marker
            id="arrowhead-green"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
          </marker>
          <marker
            id="arrowhead-amber"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
          </marker>
        </defs>

        {#each arrows as [from, to], i}
          {@const pathData = calculateArrowPath(from, to, orientation)}
          {#if pathData}
            <path
              d={pathData}
              stroke={i === 0 ? '#10b981' : '#f59e0b'}
              stroke-width="16"
              stroke-linecap="round"
              stroke-opacity="0.85"
              fill="none"
              marker-end="url(#arrowhead-{i === 0 ? 'green' : 'amber'})"
              class="tactical-arrow"
            />
          {/if}
        {/each}
      </svg>
    {/if}
  </div>
</div>

<style>
  .chessboard-wrapper {
    width: 100%;
    max-width: 540px;
    margin: 0 auto;
    position: relative;
    border-radius: 12px;
    padding: 10px;
    background: linear-gradient(145deg, #1e293b, #0f172a);
    box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .chessboard-container {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.4);
  }

  .board-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    width: 100%;
    height: 100%;
  }

  .square {
    position: relative;
    padding: 0;
    margin: 0;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    transition: background-color 0.15s ease, transform 0.1s ease;
  }

  .square.light {
    background-color: #ebecd0;
    color: #779952;
  }

  .square.dark {
    background-color: #779952;
    color: #ebecd0;
  }

  .square.highlighted.light {
    background-color: #f7ec74;
  }

  .square.highlighted.dark {
    background-color: #baca44;
  }

  .square.selected {
    background-color: #f6f059 !important;
  }

  .square:hover {
    filter: brightness(1.05);
  }

  .coord {
    position: absolute;
    font-size: 0.72rem;
    font-weight: 700;
    font-family: inherit;
    line-height: 1;
    pointer-events: none;
    opacity: 0.95;
    z-index: 2;
  }

  .rank-coord {
    top: 4px;
    left: 4px;
  }

  .file-coord {
    bottom: 4px;
    right: 4px;
  }

  .piece-img {
    width: 86%;
    height: 86%;
    object-fit: contain;
    z-index: 3;
    pointer-events: none;
    filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.25));
    transition: transform 0.12s ease;
  }

  .piece-selected {
    transform: scale(1.08) translateY(-2px);
    filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.4));
  }

  .legal-dot {
    position: absolute;
    width: 28%;
    height: 28%;
    border-radius: 50%;
    background-color: rgba(20, 83, 45, 0.55);
    z-index: 4;
    pointer-events: none;
    transition: transform 0.15s ease;
  }

  .capture-ring {
    position: absolute;
    width: 88%;
    height: 88%;
    border-radius: 50%;
    border: 5px solid rgba(239, 68, 68, 0.65);
    z-index: 4;
    pointer-events: none;
    box-sizing: border-box;
  }

  .arrows-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    pointer-events: none;
  }

  .tactical-arrow {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45));
    animation: fadeInArrow 0.25s ease-out;
  }

  @keyframes fadeInArrow {
    from {
      opacity: 0;
      stroke-dashoffset: 60;
    }
    to {
      opacity: 0.85;
      stroke-dashoffset: 0;
    }
  }

  @media (max-width: 640px) {
    .chessboard-wrapper {
      padding: 6px;
      border-radius: 8px;
    }
    .coord {
      font-size: 0.6rem;
    }
  }
</style>
