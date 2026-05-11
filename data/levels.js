export const LEVELS = {
  level1: {
    letter: 'T',
    nextLevel: 'level2',

    platformScale: 2.0,
    ballScale: 1.45,
    ballSpeedMin: 260,
    ballSpeedMax: 330,
    obstacleScale: 0.82,

    pattern: [
      'xxxxx',
      '  x  ',
      '  x  ',
      '  x  ',
      '  x  ',
      '  x  ',
      '  x  '
    ]
  },

  level2: {
    letter: 'I',
    nextLevel: 'level3',

    platformScale: 1.85,
    ballScale: 1.38,
    ballSpeedMin: 310,
    ballSpeedMax: 390,
    obstacleScale: 0.80,

    pattern: [
      'xxxxx',
      '  x  ',
      '  x  ',
      '  x  ',
      '  x  ',
      '  x  ',
      'xxxxx'
    ]
  },

  level3: {
    letter: 'N',
    nextLevel: 'level4',

    platformScale: 1.65,
    ballScale: 1.32,
    ballSpeedMin: 360,
    ballSpeedMax: 460,
    obstacleScale: 0.78,

    pattern: [
      'x   x',
      'xx  x',
      'x x x',
      'x  xx',
      'x   x',
      'x   x',
      'x   x'
    ]
  },

  level4: {
    letter: 'B',
    nextLevel: 'level5',

    platformScale: 1.45,
    ballScale: 1.26,
    ballSpeedMin: 415,
    ballSpeedMax: 535,
    obstacleScale: 0.76,

    pattern: [
      'xxxx ',
      'x   x',
      'x   x',
      'xxxx ',
      'x   x',
      'x   x',
      'xxxx '
    ]
  },

  level5: {
    letter: 'E',
    nextLevel: 'level6',

    platformScale: 1.30,
    ballScale: 1.20,
    ballSpeedMin: 470,
    ballSpeedMax: 610,
    obstacleScale: 0.74,

    pattern: [
      'xxxxx',
      'x    ',
      'x    ',
      'xxxx ',
      'x    ',
      'x    ',
      'xxxxx'
    ]
  },

  level6: {
    letter: 'T',
    nextLevel: 'winScene',

    platformScale: 1.15,
    ballScale: 1.15,
    ballSpeedMin: 530,
    ballSpeedMax: 700,
    obstacleScale: 0.72,

    pattern: [
      'xxxxxxx',
      'xxxxxxx',
      '   x   ',
      '   x   ',
      '   x   ',
      '   x   ',
      '   x   '
    ]
  }
};