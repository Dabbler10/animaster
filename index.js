addListeners();

function addListeners() {
    let heartBreaker;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 500, {x: 100, y: 100});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block, 1000);
        });
    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
    });

    document.getElementById('heartPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBlock');
            heartBreaker = animaster().heartBeating(block);
        });
    document.getElementById('heartStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBlock');
            heartBreaker.stop();
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    const _steps = [];
    function getTransform(translation, scale) {
        let result = "";
        if (translation) {
            result += `translate(${translation.x}px, ${translation.y}px) `;
        }
        if (scale !== null && scale !== undefined) {
            result += `scale(${scale})`;
        }
        return result;
    }

    function resetFadeIn (element) {
        element.style.opacity = 0;
    };
    function resetFadeOut (element) {
        element.style.opacity = 1;
    };
    function resetMoveAndScale (element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    };
    return {
        move(element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },
        fadeIn(element, duration) {
            this.addFadeIn(duration).play(element);
        },
        fadeOut(element, duration) {
            this.addFadeOut(duration).play(element);
        },
        scale(element, duration, ratio) {
            this.addScale(duration, ratio).play(element);
        },
        moveAndHide(element, duration) {
            this.move(element, duration * 2/5, {x:100, y: 20});
            setTimeout(() => this.fadeOut(element, duration * 3/5), duration * 2/5);
        },
        resetMoveAndHide(element){
            // resetFadeIn(element);
            resetFadeOut(element);
            resetMoveAndScale(element);
        },
        showAndHide(element, duration){
            this.fadeIn(element, duration/3);
            setTimeout(() => this.fadeOut(element, duration/3), duration * 2/3);
        },
        heartBeating(element) {
            let timerIds = [];
            const self = this;

            function beat() {
                self.scale(element, 500, 1.4);
                const t1 = setTimeout(() => {
                    self.scale(element, 500, 1);
                    const t2 = setTimeout(() => {
                        beat();
                    }, 500);
                    timerIds.push(t2);
                }, 500);
                timerIds.push(t1);
            }

            beat();
            return {
                stop() {
                    timerIds.forEach(timerId => clearTimeout(timerId));
                    timerIds = [];
                }
            }
        },
        addMove(duration, translation) {
            _steps.push({
                name: 'move',
                duration: duration,
                params: { translation }
            });
            return this;
        },
        play(element) {
            let totalTime = 0;
            _steps.forEach(step => {
                setTimeout(() => {
                    switch (step.name) {
                        case 'move':
                            element.style.transitionDuration = `${step.duration}ms`;
                            element.style.transform = getTransform(step.params.translation, null);
                            break;
                        case 'fadeIn':
                            this.fadeIn(element, step.duration);
                            break;
                        case 'fadeOut':
                            this.fadeOut(element, step.duration);
                            break;
                        case 'scale':
                            this.scale(element, step.duration, step.params.ratio);
                            break;
                    }
                }, totalTime);
                totalTime += step.duration;
            });
            return this;
        }
    }
}
