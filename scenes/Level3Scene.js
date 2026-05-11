import { BaseLevelScene } from './BaseLevelScene.js';
import { LEVELS } from '../data/levels.js';

export class Level3Scene extends BaseLevelScene {
  constructor() {
    super('level3', LEVELS.level3, 3);
  }
}