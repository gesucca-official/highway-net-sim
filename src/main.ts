import Phaser from 'phaser'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: []
}

export default new Phaser.Game(config)
