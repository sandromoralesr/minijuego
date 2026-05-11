import { BaseLevelScene } from './BaseLevelScene.js';
import { LEVELS } from '../data/levels.js';

export class Level2Scene extends BaseLevelScene {
  constructor() {
    super('level2', LEVELS.level2, 2);
  }
}