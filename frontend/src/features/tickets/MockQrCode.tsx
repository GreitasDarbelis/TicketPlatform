import { Box } from '@mui/material';

type MockQrCodeProps = {
  value: string;
};

const QR_GRID_SIZE = 21;

function isFinderPatternCell(x: number, y: number, originX: number, originY: number): boolean {
  const relativeX = x - originX;
  const relativeY = y - originY;

  if (relativeX < 0 || relativeX > 6 || relativeY < 0 || relativeY > 6) {
    return false;
  }

  const isOuterRing =
    relativeX === 0 || relativeX === 6 || relativeY === 0 || relativeY === 6;
  const isInnerSquare =
    relativeX >= 2 && relativeX <= 4 && relativeY >= 2 && relativeY <= 4;

  return isOuterRing || isInnerSquare;
}

function createSeed(value: string): number {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function shouldFillCell(seed: number, x: number, y: number): boolean {
  if (
    isFinderPatternCell(x, y, 0, 0) ||
    isFinderPatternCell(x, y, QR_GRID_SIZE - 7, 0) ||
    isFinderPatternCell(x, y, 0, QR_GRID_SIZE - 7)
  ) {
    return true;
  }

  if (
    (x <= 7 && y <= 7) ||
    (x >= QR_GRID_SIZE - 8 && y <= 7) ||
    (x <= 7 && y >= QR_GRID_SIZE - 8)
  ) {
    return false;
  }

  const mixedSeed = Math.imul(seed ^ Math.imul(x + 5, 374761393), (y + 11) * 668265263);

  return ((mixedSeed >>> 0) & 3) !== 0;
}

export function MockQrCode({ value }: MockQrCodeProps) {
  const seed = createSeed(value);
  const cells = [];

  for (let y = 0; y < QR_GRID_SIZE; y += 1) {
    for (let x = 0; x < QR_GRID_SIZE; x += 1) {
      if (shouldFillCell(seed, x, y)) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000000" />);
      }
    }
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        p: 1.1,
        border: '6px solid',
        borderColor: 'primary.light',
        borderRadius: '14px',
        bgcolor: 'background.paper',
      }}
    >
      <svg
        aria-label={`QR code for ticket ${value}`}
        role="img"
        viewBox={`0 0 ${QR_GRID_SIZE} ${QR_GRID_SIZE}`}
        width="360"
        height="360"
        style={{ display: 'block', maxWidth: 'min(58vw, 360px)', height: 'auto' }}
      >
        <rect width={QR_GRID_SIZE} height={QR_GRID_SIZE} fill="#ffffff" />
        {cells}
      </svg>
    </Box>
  );
}
