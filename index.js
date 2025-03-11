addListeners();

function addListeners() {
    let heartBreaker;
    let moveAndHide;
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
            moveAndHide = animaster().moveAndHide(block, 1000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide.reset();
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
    document.getElementById('testBlock').addEventListener('click', animaster()
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .buildHandler())
    document.getElementById('testBlock2').addEventListener('click', animaster()
    .addChangeColor(500)
    .buildHandler())
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
            return this.addMove(duration*2/5, {x:100, y: 20}).addFadeOut(duration*3/5).play(element);
        },
        resetMoveAndHide(element){
            resetFadeOut(element);
            resetMoveAndScale(element);
        },
        showAndHide(element, duration){
            this.addFadeIn(duration/3).addDelay(duration/3).addFadeOut(duration/3).play(element);
        },
        heartBeating(element) {
            return this.addScale(500, 1.4).addScale(500, 1).addDelay(10).play(element, cycled=true);
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
        addChangeColor(duration) {
            _steps.push({
                name: 'bgColor',
                duration: duration,
            });
            return this;
        },
        play(element, cycled = false) {
            let opacity;
            const cycleTime = _steps.reduce((sum, step) => sum + step.duration, 0);
            function a() {
                let currentTime = 0;
                _steps.forEach(step => {
                    setTimeout(() => {
                        switch (step.name) {
                            case 'move':
                                element.style.transitionDuration = `${step.duration}ms`;
                                element.style.transform = getTransform(step.params.translation, null);
                                break;
                            case 'fadeIn':
                                element.style.transitionDuration = `${step.duration}ms`;
                                element.classList.remove('hide');
                                element.classList.add('show');
                                opacity = 0
                                break;
                            case 'fadeOut':
                                element.style.transitionDuration = `${step.duration}ms`;
                                element.classList.remove('show');
                                element.classList.add('hide');
                                opacity = 1
                                break;
                            case 'bgColor':
                                element.style.transitionDuration =  `${step.duration}ms`;
                                element.style.backgroundColor = "black";
                                break;
                            case 'scale':
                                element.style.transitionDuration = `${step.duration}ms`;
                                element.style.transform = getTransform(null, step.params.ratio);
                                break;
                            case 'delay':
                                break;
                        }
                    }, currentTime);
                    currentTime += step.duration;
                });
            }
            if (!cycled) {
                a();
                return {
                    reset() {
                        element.style.transitionDuration = null;
                        element.style.transform = null;
                        element.style.opacity = opacity;
                    }
                };
            } else {
                a();
                const intervalId = setInterval(a, cycleTime);
                return {
                    stop() {
                        clearInterval(intervalId);
                    }
                };
        }},
        buildHandler(){
            return (element) => { this.play(element.target) };
        }
    }
}
