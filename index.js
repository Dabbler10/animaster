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
            this.addMove(duration*2/5, {x:100, y: 20}).addFadeOut(duration*3/5).play(element);
        },
        resetMoveAndHide(element){
            resetFadeOut(element);
            resetMoveAndScale(element);
        },
        showAndHide(element, duration){
            this.addFadeIn(duration/3).addDelay(duration/3).addFadeOut(duration/3).play(element);
        },
        heartBeating(element) {
            this.addScale(500, 1.4).addScale(500, 1).addDelay(10).play(element, cycled=true);
        },
        addMove(duration, translation) {
            _steps.push({
                name: 'move',
                duration: duration,
                params: { translation }
            });
            return this;
        },
        addScale(duration, ratio) {
            _steps.push({
                name: 'scale',
                duration: duration,
                params: { ratio }
            });
            return this;
        },
        addFadeIn(duration) {
            _steps.push({
                name: 'fadeIn',
                duration: duration,
            });
            return this;
        },
        addFadeOut(duration) {
            _steps.push({
                name: 'fadeOut',
                duration: duration,
            });
            return this;
        },
        addDelay(duration) {
            _steps.push({
                name: 'delay',
                duration: duration,
            });
            return this;
        },
        play(element, cycled=false) {
            let totalTime = 0;
            function a() {
                _steps.forEach(step => {
                    setTimeout(() => {
                        switch (step.name) {
                            case 'move':
                                element.style.transitionDuration = `${step.duration}ms`;
                                element.style.transform = getTransform(step.params.translation, null);
                                break;
                            case 'fadeIn':
                                element.style.transitionDuration =  `${step.duration}ms`;
                                element.classList.remove('hide');
                                element.classList.add('show');
                                break;
                            case 'fadeOut':
                                element.style.transitionDuration =  `${step.duration}ms`;
                                element.classList.remove('show');
                                element.classList.add('hide');
                                break;
                            case 'scale':
                                element.style.transitionDuration =  `${step.duration}ms`;
                                element.style.transform = getTransform(null, step.params.ratio);
                                break;
                            case 'delay':
                                break;
                        }
                    }, totalTime);
                    totalTime += step.duration;
                });
                return this;
            }
            if (!cycled) {
                a();
            }
            else {
                setInterval(a, 0);
            }
        }   
    }
}
