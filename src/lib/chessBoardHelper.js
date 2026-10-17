// Helper fungsi untuk Papan Catur Svelte

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

// Parse FEN string ke representasi grid 8x8
export function parseFen(fen) {
  if (!fen) fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const parts = fen.split(' ');
  const rows = parts[0].split('/');
  const board = [];

  for (let r = 0; r < 8; r++) {
    const rowStr = rows[r];
    const rowArray = [];
    let fileIdx = 0;

    for (let c = 0; c < rowStr.length; c++) {
      const char = rowStr[c];
      if (char >= '1' && char <= '8') {
        const emptyCount = parseInt(char, 10);
        for (let i = 0; i < emptyCount; i++) {
          rowArray.push(null);
          fileIdx++;
        }
      } else {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const type = char.toUpperCase();
        rowArray.push({
          color,
          type,
          asset: `/pieces/${color}${type}.svg`,
          raw: char
        });
        fileIdx++;
      }
    }
    board.push(rowArray);
  }

  return {
    board,
    turn: parts[1] || 'w',
    castling: parts[2] || '-',
    enPassant: parts[3] || '-',
    halfMoves: parseInt(parts[4] || '0', 10),
    fullMoves: parseInt(parts[5] || '1', 10)
  };
}

// Konversi nama petak (misal 'e4') ke koordinat SVG viewBox 0 0 800 800
export function squareToSvgCenter(square, orientation = 'white') {
  if (!square || square.length < 2) return { x: 0, y: 0 };
  const fileChar = square[0].toLowerCase();
  const rankNum = parseInt(square[1], 10);
  const fileIdx = FILES.indexOf(fileChar);
  if (fileIdx === -1 || rankNum < 1 || rankNum > 8) return { x: 0, y: 0 };

  let col = fileIdx;
  let row = 8 - rankNum;

  if (orientation === 'black') {
    col = 7 - fileIdx;
    row = rankNum - 1;
  }

  return {
    x: col * 100 + 50,
    y: row * 100 + 50
  };
}

// Menghitung path panah yang proporsional dan tidak menabrak pusat bidak
export function calculateArrowPath(fromSquare, toSquare, orientation = 'white') {
  const p1 = squareToSvgCenter(fromSquare, orientation);
  const p2 = squareToSvgCenter(toSquare, orientation);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return '';

  const shortenStart = 24;
  const shortenEnd = 30;

  const startX = p1.x + (dx / dist) * shortenStart;
  const startY = p1.y + (dy / dist) * shortenStart;
  const endX = p2.x - (dx / dist) * shortenEnd;
  const endY = p2.y - (dy / dist) * shortenEnd;

  return `M ${startX} ${startY} L ${endX} ${endY}`;
}
