var date = new Date();
// var now = date.getMinutes() * 1000 * 60 + date.getSeconds() * 1000 + date.getMilliseconds();

var frametime = 32;

var clock = {
    nextFrame: performance.now()
};

var config = {
    drawCollision: true,
    logVelocity: true
}

var jumpInterval = 1500;
var nextJump = performance.now();
var grounded = true;

var dude = {

    x: 400,
    y: 500,
    sx: 200,
    sy: 200,
    img: new Image(),
    
    physics: {
        // vx: 25,
        vx: 0,
        vy: 0,
    },
    collision: {
        x: 200,
        y: 200,
        physics: this.physics,
    },
    onCollide: function( other ) {
        this.physics.vx *= -1;
        this.physics.vy = -15;
    },
    render: {
        animations: {
            // 'running': [[0, 0, 300, 300], [300, 0, 300, 300]]
            'running': [[0, 0, 300, 300]]
        },
        currentAnimation: 'running',
        currentFrame: 0,
    },
};

var wall = {
    x: 1100,
    y: 400,
    collision: {
        x: 20,
        y: 900,
    },
    onCollide: other => { }
}

var entities = [dude, wall];
entities.forEach( function( x, i ) { x.id = i });

function init() {
    dude.img.src = 'img/anim.png';
    window.requestAnimationFrame( draw );
}

function draw( time ) {
    date = new Date();

    if( time > clock.nextFrame ) {
        clock.nextFrame = time + frametime;

        var ctx = document.getElementById( 'canvas' ).getContext( '2d' );
        ctx.save();
        ctx.clearRect( 0, 0, 1280, 720 );

        // get input

        // scripting
        if( time > nextJump && grounded ) {
            console.log( true );
            dude.physics.vy = -35;
            grounded = false;
        }


        // physics
        entities.forEach( function( entity ) {
            if( !entity.physics ) {
                return;
            }
            entity.physics.vy += 1.5;
            entity.x += entity.physics.vx;
            entity.y += entity.physics.vy;
            if( entity.y >= 400 ) {
                entity.y = 400;
                entity.physics.vy = 0;
                if( !grounded ) {
                    grounded = true;
                    nextJump = performance.now() + jumpInterval;
                }
            }
            if( config.logVelocity ) {
                console.log( entity.id, 'x: ', entity.x, 'y: ', entity.y, 'vx: ', entity.physics.vx, 'vy: ', entity.physics.vy );
            }
        });


        // collision
        entities.forEach( function( entity, i ) {
            if( !entity.collision ) {
                return;
            }
            entities.forEach( function( other, o ) {
                if( o === i || !other.collision ) {
                    return;
                }
                if( entity.x < other.x + other.collision.x &&
                    entity.x + entity.collision.x > other.x &&
                    entity.y < other.y + other.collision.y &&
                    entity.y + entity.collision.y > other.y ) {
                    
                    entity.onCollide( other );
                }
            });
            if( config.drawCollision ) {
                ctx.strokeStyle = '#62f442';
                ctx.strokeRect( entity.x, entity.y, entity.collision.x, entity.collision.y );
                ctx.restore();
            }
        });


        // rendering
        entities.forEach( function( entity ) {
            if( !entity.render ) {
                return;
            }
            var render = entity.render;
            frame = render.animations[render.currentAnimation][ render.currentFrame ];
            render.currentFrame = (render.currentFrame + 1) % render.animations[render.currentAnimation].length;
            ctx.drawImage( entity.img, frame[0], frame[1], frame[2], frame[3], entity.x, entity.y, entity.sx, entity.sy );
        });
    }
    window.requestAnimationFrame( draw );
}
