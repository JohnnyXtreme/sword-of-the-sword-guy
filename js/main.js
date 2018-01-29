var date = new Date();
var now = date.getMinutes() * 1000 * 60 + date.getSeconds() * 1000 + date.getMilliseconds();

var frametime = 30;

var clock = {
    nextFrame: now + frametime
};

var dude = {
    img: new Image(),
    animations: {
        'running': [[0, 0, 300, 300], [300, 0, 300, 300]]
    },
    currentFrame: 0
};

function init() {
    dude.img.src = 'img/anim.png';
    window.requestAnimationFrame( draw );
}

function draw() {
    date = new Date();
    var time = date.getMinutes() * 1000 * 60 + date.getSeconds() * 1000 + date.getMilliseconds();
    if( time > clock.nextFrame ) {
        clock.nextFrame = time + frametime;

        var ctx = document.getElementById( 'canvas' ).getContext( '2d' );
        ctx.clearRect( 0, 0, 1280, 720 );

        frame = dude.animations.running[ dude.currentFrame ];
        dude.currentFrame = (dude.currentFrame + 1) % dude.animations.running.length;

        ctx.drawImage( dude.img, frame[0], frame[1], frame[2], frame[3], 600, 300, 300, 300 );
    }
    window.requestAnimationFrame( draw );
}
