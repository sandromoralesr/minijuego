import { BaseLevelScene } from './BaseLevelScene.js';
import { LEVELS } from '../data/levels.js';

export class Level5Scene extends BaseLevelScene {
  constructor() {
    super('level5', LEVELS.level5, 5);
  }
}