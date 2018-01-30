var date = new Date();
// var now = date.getMinutes() * 1000 * 60 + date.getSeconds() * 1000 + date.getMilliseconds();

var frametime = 32;

var clock = {
    nextFrame: performance.now()
};

var config = {
    drawCollision: true,
    logVelocity: false
}

var input = new Set();
var keyups = new Set();


document.addEventListener( 'keydown', (event) => {
    // console.log( 'add', event.code );
    input.add( event.code );

});

document.addEventListener( 'keyup', (event) => {
    // console.log('remove', event.code);
    keyups.add( event.code );
});

var jumpInterval = 1500;
var nextJump = performance.now();
var grounded = true;

var dude = {

    x: 400,
    y: 100,
    sx: 200,
    sy: 200,
    img: new Image(),
    type: 'player',
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
        if( other.type === 'terrain' ) {
            // overlap x
            this.physics.vx = 0;
            this.physics.vy = 0;
        }
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
    type: 'terrain',
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




    // get input
    dude.physics.vx = 0;
    input.forEach( key => {
        switch (key) {
            case 'KeyD':
                dude.physics.vx += 10;
                break;
            case 'KeyA':
                dude.physics.vx -= 10;
                break;
            case 'Space':
                console.log( 'jump' );
                if( grounded ) {
                    dude.physics.vy = -35;
                    grounded = false;
                }
            default:
                break;
        }
    });

    keyups.forEach( key => {
        input.delete( key );
    });
    keyups.clear();



    // scripting
    // if( time > nextJump && grounded ) {
    //     console.log( true );
    //     dude.physics.vy = -35;
    //     grounded = false;
    // }


    
    
    
    if (time > clock.nextFrame) {
        // collision
        entities.forEach(function (entity, i) {
            if (!entity.collision) {
                return;
            }
            entities.forEach(function (other, o) {
                if (o === i || !other.collision) {
                    return;
                }
                if (entity.x < other.x + other.collision.x &&
                    entity.x + entity.collision.x > other.x &&
                    entity.y < other.y + other.collision.y &&
                    entity.y + entity.collision.y > other.y) {
    
                    entity.onCollide(other);
                }
            });
        });
        // physics
        entities.forEach( function( entity ) {
            if( !entity.physics ) {
                return;
            }
            entity.physics.vy += 1.5;
            entity.x += entity.physics.vx;
            entity.y += entity.physics.vy;
            if( entity.y >= 500 ) {
                entity.y = 500;
                entity.physics.vy = Math.min( 0, entity.physics.vy );
                if( !grounded ) {
                    grounded = true;
                }
            }
            if( config.logVelocity ) {
                console.log( entity.id, 'x: ', entity.x, 'y: ', entity.y, 'vx: ', entity.physics.vx, 'vy: ', entity.physics.vy );
            }
        });
        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, 1280, 720);
        
        clock.nextFrame = clock.nextFrame + frametime;
        // rendering
        entities.forEach( function( entity ) {
            if( config.drawCollision && entity.collision ) {
                ctx.strokeStyle = '#62f442';
                ctx.strokeRect( entity.x, entity.y, entity.collision.x, entity.collision.y );
                ctx.restore();
            }
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
