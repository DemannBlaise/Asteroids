//We want our canvas that which are drawing on to take the full height and length of our browser window

/*We are first pulling in the canvas element using document.querySelector()
this will give us access to the elements of our documents. We want the canvas element. 
querySelector takes one arg.
*/

//creating the background
const canvas = document.querySelector('canvas')
//canvas context
//We want to start drawing using the canvas context.

const ctx = canvas.getContext('2d');
//This is expand the canvas width to be the full with of the inner Window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//change color

// creating the player class
class Player{
    constructor({position, velocity}){
        // position on our screen
        this.position = position // hold an {x,y} object
        this.velocity = velocity // the speed of our player
        this.rotation = 0
    }
    draw(){
       
        ctx.save();

        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(this.rotation)
        ctx.translate(-this.position.x, -this.position.y)
        //color of our spaceship
        ctx.fillStyle = 'fuchsia'
        ctx.fill();

        //ctx.fillStyle = 'blue';
        // ctx.fillRect(this.position.x, this.position.y, 50,50)
        ctx.beginPath();
        // spaceship measurements
        ctx.moveTo(this.position.x+50, this.position.y)
        // this set of code draws a triangle in the middle of our screen
        ctx.lineTo(this.position.x-15, this.position.y-15)
        ctx.lineTo(this.position.x-15, this.position.y+15)
        ctx.closePath()
        // sets the color of our triangle
        ctx.strokeStyle = 'fuchsia';
        ctx.stroke();
        ctx.restore();

    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
// a class projectiles that takes a position an velocity object as the argument to the constructor.
class Projectile{

    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity

        // a radius of the projectile
        this.radius = 7 // maybe can mark this into a variable to change size
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.fillStyle = 'white'
        ctx.fill() 
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
const player = new Player({
    position: {x:Math.floor(canvas.width/2), y:Math.floor(canvas.height/2)},
    velocity: {x:0, y:0}
});

//player.update();
//console.log(player)

// moving the player 
//to listen for key events

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    f: {
        pressed: false
    }
}
// global constants to help us ind
const SPEED = 5;
const ROTATIONAL_SPEED = .05;
const FRICTION = 0.97;

const projectiles = [];
const PROJECTILE_SPEED = 2; 

const asteroids = [];
const ASTEROID_SPEED = [];
const SMALLEST_ASTEROID = 12; //12 PIXELS
//this is our animating function to help us move our player frame by frame across a canvas
function animateMove(){
    window.requestAnimationFrame(animateMove)

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    
    //updating things out from the back of the array rather than the front so it's easier to remove projectile objects
    for(let i = projectiles.length - 1; i >=0; i--){
        //select one projectile and render it out on the screen
        const projectile = projectiles[i];
        projectile.update();
        //garbarge collection for projectiles. 
        if(projectile.position.x + projectile.radius < 0 || 
            projectile.position.x - projectile.radius > canvas.width || 
            projectile.position.y - projectile.radius > canvas.height || 
            projectile.position.y + projectile.radius > 0){
            projectiles.splice(i, 1);
        }
    }
  //asteroids management
    for(let i = asteroids.length - 1; i >=0; i--){
        //select one projectile and render it out on the screen
        const asteroid = asteroids[i];
        asteroid.update();
        //garbarge collection for projectiles. 
        
    }
    if(keys.w.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED
        player.velocity.y = Math.sin(player.rotation) * SPEED
    }else if(!keys.w.pressed){
        player.velocity.x *= FRICTION
        player.velocity.y *= FRICTION 
    }
    if(keys.s.pressed){
        player.velocity.x = -Math.cos(player.rotation)
        player.velocity.y = -Math.sin(player.rotation)
    } 

    if(keys.f.pressed) player.rotation += ROTATIONAL_SPEED;
    else if(keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;
    
}

animateMove()
//addEventListener takes in 2 args, the type of event and a callback function
//This will move our player from moving when a key is being pushed down
window.addEventListener('keydown', (eventObj)=>{
    switch(eventObj.code){
        case 'KeyW':
            console.log('W is pressed');
            keys.w.pressed = true;
            break
        case 'KeyA':
            console.log('A is pressed');
            keys.a.pressed = true;
            break
        case 'KeyS':
            console.log('S is pressed');
            keys.s.pressed = true;
            break
        case 'KeyF':
            console.log('F is pressed');
            keys.f.pressed = true;
            break
        
        case 'Space':
            projectiles.push(
                new Projectile({
                  position: {
                    x: player.position.x + Math.cos(player.rotation) * 53, // 30 pixels from the center of our player
                    y: player.position.y + Math.sin(player.rotation) * 53
                },
                  velocity: {
                    x: Math.cos(player.rotation)* PROJECTILE_SPEED,
                    y: Math.sin(player.rotation) * PROJECTILE_SPEED,
                }
            }))
            break
    }
})
//keyup
// Listens to when a key is no longer being pressed
//This will help us stop our player from moving when a key is no longer being pressed
window.addEventListener('keyup', (eventObj)=>{
    switch(eventObj.code){
        case 'KeyW':
            console.log('W is pressed');
            keys.w.pressed = false;
            break
        case 'KeyA':
            console.log('A is pressed');
            keys.a.pressed = false;
            break
        case 'KeyS':
            console.log('S is pressed');
            keys.s.pressed = false;
            break
        case 'KeyF':
            console.log('F is pressed');
            keys.f.pressed = false;
            break
    }
})

//shooting projectiles from our spaceship. 

/*Where should these spaw relative to our ship?
Spacechip Center? 
should come from the tip of our spaceship*/

/**/

//TODO:Spawn Asteroids
class Asteroid{
    constructor({position, velocity, radius}) {
        this.position = position
        this.velocity = velocity
        // a radius of the projectile
        this.radius = radius // this makes sure the radius of an asteroid is never less than 12
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, 
            false)
        ctx.closePath()
        ctx.strokeStyle = 'white' 
        ctx.stroke();
      
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
const asteroid = new Asteroid({
    position: {x:Math.floor(canvas.width/2), y:Math.floor(canvas.height/2)},
    velocity: {x:0, y:0}
});



//Set interval takes 2 args, 
window. setInterval(()=>{
    const index = Math.floor(Math.random * 4);
    let px,py;
    let vx,vy;
    let radius = 50  * Math.random() + SMALLEST_ASTEROID;
    switch(index){
        case 0: // left side of the screen
            px = 0 - radius; // right side of our playing and pushing 
            py = Math.random() * canvas.height;
            vx = 1;
            vy = 0;
        break;

        case 1: // bottom side of the screen
            px = Math.random() * canvas.width; // right side of our playing and pushing 
            py = canvas.height + radius;
            vx = 0;
            vy = -1;
        break;

        case 2: // right side of the screen
            px = canvas.width + radius; // right side of our playing and pushing 
            py = Math.random() * canvas.height;
            vx = -1;
            vy = 0;
            break;

        case 3: // top side of the screen
            px = Math.random() * canvas.width; // right side of our playing and pushing 
            py = 0 - radius;
            vx = 0;
            vy = 1;
        break;
        
    }
    //array to pushes our asteroids object
    asteroids.push(new Asteroid({
        position:{
            x:px,
            y:py,
        }, 
        velocity:{
            x: vx, 
            y: vy,
        }, 
        radius
    })
    )
}, 2000)
//TODO: Hit Asteroids

//TODO: Game over