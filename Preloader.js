export default class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('Preloader');

        this.loadText;
    }

    preload ()
    {
    // Ensure we load assets from the local assets folder explicitly
    // (avoid using setBaseURL / setPath which may be set elsewhere)
        this.loadText = this.add.text(400, 360, 'Loading ...', { fontFamily: 'Arial', fontSize: 64, color: '#e3f2ed' });

        this.loadText.setOrigin(0.5);
        this.loadText.setStroke('#203c5b', 6);
        this.loadText.setShadow(2, 2, '#2d2d2d', 4, true, false);

    // Load images/atlas using explicit local paths
    this.load.image('background', 'assets/games/emoji-match/background.png');
    this.load.image('logo', 'assets/games/emoji-match/logo.png');
    this.load.atlas('emojis', 'assets/games/emoji-match/emojis.png', 'assets/games/emoji-match/emojis.json');

    // Audio (explicit local paths)
    this.load.audio('music', [ 'assets/games/emoji-match/sounds/music.ogg' ]);
    this.load.audio('countdown', [ 'assets/games/emoji-match/sounds/countdown.ogg' ]);
    this.load.audio('match', [ 'assets/games/emoji-match/sounds/match.ogg' ]);
    }

    create ()
    {
        if (this.sound.locked)
        {
            this.loadText.setText('Click to Start');

            this.input.once('pointerdown', () => {

                this.scene.start('MainMenu');

            });
        }
        else
        {
            this.scene.start('MainMenu');
        }
    }
}