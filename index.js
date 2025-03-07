addListeners();

function animaster() {
    const _steps = [];

    function move (element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale (element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);

    }

    function resetFadeIn(element) {
        animaster().fadeOut(element, 0);
    }

    function resetFadeOut(element) {
        animaster().fadeIn(element, 0);
    }
    function fadeIn (element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = '0s';
        element.style.transform = getTransform({x: 0, y: 0}, 1);
    }

    return {
        fadeIn,

        move,

        scale,

        fadeOut,

        moveAndHide: () => {
            let superElement;
            return {
                play: (element, duration) => {
                    superElement = element;
                    element.style.transitionDuration = `${duration * 0.4}ms`;
                    element.style.transform = getTransform({x: 100, y: 20}, null);
                    setTimeout(() => {
                        element.style.transitionDuration = `${duration * 0.6}ms`;
                        element.classList.remove('show');
                        element.classList.add('hide');
                    },duration * 0.4);
                },
                reset: () => {
                    superElement.style.transitionDuration = `0s`;
                    superElement.classList.remove('hide');
                    superElement.classList.add('show');
                    superElement.style.transform = getTransform({x: 0, y: 0}, null);

                }
            }
        },

        showAndHide: (element, duration) => {
            element.style.transitionDuration = `${duration / 3}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            setTimeout(() => {
                element.style.transitionDuration = `${duration / 3}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            },duration / 3 * 2)
        },

        heartBeating (element){
            let intervalId;
            return {
                start: () => intervalId = setInterval(() => {
                element.style.transitionDuration = `500ms`;
                element.style.transform = getTransform(null, 1.4);
                setTimeout(() => {
                    element.style.transitionDuration = `500ms`;
                    element.style.transform = getTransform(null,  1);
                }, 500)}, 1000),

                stop: () => {
                    clearInterval(intervalId);
                }
            }
        },

        addMove(duration, translation) {
            _steps.push({method: move, duration, args: [translation]});
            return this;
        },

        addScale(duration, scaleAmount){
            _steps.push({method: scale, duration, args: [scaleAmount]})
            return this;
        },

        addFadeIn(duration){
            _steps.push({method: fadeIn, duration, args: []})
            return this;
        },

        addFadeOut(duration){
            _steps.push({method: fadeOut, duration, args: []})
            return this;
        },

        play: (element) => {
            let duration = 0;
            for (const step of _steps){
                setTimeout(() => step.method(element, step.duration, ...step.args), duration)
                duration += step.duration;
            }

        }
    }
}



function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove( 1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale( 1000, 1.25).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut( 1000).play(block);
        });

    const moveAndHideFunc = animaster().moveAndHide();
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideFunc.play(block, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            moveAndHideFunc.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    const heartBeating = animaster().heartBeating(document.getElementById('heartBeatingBlock'));

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            heartBeating.start();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeating.stop();
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
