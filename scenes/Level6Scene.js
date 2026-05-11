import { BaseLevelScene } from './BaseLevelScene.js';
import { LEVELS } from '../data/levels.js';

export class Level6Scene extends BaseLevelScene {
  constructor() {
    super('level6', LEVELS.level6, 6);
  }
}