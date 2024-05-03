/**
 * Load the animations for the player (mario)
 */
preloadMario = () => {
    animation_jump = loadAni('assets/animations/player_jump_1.png', 'assets/animations/player_jump_2.png')
    animation_jump.frameDelay = 20;
    animation_walk = loadAni('./assets/animations/player_walk_1.png', 3)
    animation_death = loadAni('./assets/animations/player_death_1.png', 2)
    animation_death.frameDelay = 40;
    animation_stand = loadAni('./assets/animations/player_walk_1.png')
}

class Player {
    /**
     * Set up the player (mario) sprite
     */
    constructor(x, y, scale) {

    }

    loseLife() {
    }

    /**
     * Update the player's position and animations
     */
    update() {
    }
}

