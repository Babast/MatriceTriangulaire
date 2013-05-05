var container;
var camera, scene, renderer, controls;  
var clock = new THREE.Clock();
var cubes= [];
var objectURL;
var buffer;
initDragDrop();
init();
animate();


function loadSample(url) {
    var contextClass = (window.AudioContext || 
  window.webkitAudioContext || 
  window.mozAudioContext || 
  window.oAudioContext || 
  window.msAudioContext);
if (contextClass) {
  // Web Audio API is available.
  var context = new contextClass();
} else {
  // Web Audio API is not available. Ask the user to use a supported browser.
}
   var request = new XMLHttpRequest();
request.open('GET', url, true);
request.responseType = 'arraybuffer';

// Decode asynchronously
request.onload = function() {
  context.decodeAudioData(request.response, function(theBuffer) {
    buffer = theBuffer;
  });
}
request.send();
}

function initDragDrop(){
    // DragAndDrop
    var holder = document.getElementById('holder');
    holder.ondragover = function () {
        this.className = 'hover'; 
        return false;
    };
    holder.ondragend = function () {
        this.className = ''; 
        return false; 
    };
    holder.ondrop = function (e) {
        this.className = '';
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        var reader = new FileReader(file);
        reader.onload = function (event) {
            // Load music ds player
            document.getElementById("holder").innerHTML = file.name;
            var player = document.getElementById("player");
            objectURL = window.URL.createObjectURL(file);
            player.src = objectURL;
            player.load();
            loadSample(objectURL);
        };
        reader.readAsDataURL(file);
        return false;
    }; 
}
    
function init() {
    // Scene
    renderer = new THREE.WebGLRenderer({ antialias: true, clearColor: 0x000000, clearAlpha: 1 });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 200, 500 );
        
    controls = new THREE.FirstPersonControls( camera );
    controls.movementSpeed = 50;
    controls.lookSpeed = 0.2;             
        
    scene = new THREE.Scene();
    scene.position.set( 0, 200, 0 );
    camera.lookAt(scene.position);

    controls.target.x = scene.position.x ;
    controls.target.y = scene.position.y ;
    controls.target.z = scene.position.z ;
        
    //Horizontal Grid
    var lineH_material = new THREE.LineBasicMaterial( { color: 0x303030 } );
    var geometry = new THREE.Geometry();
    var step = 10;
    for ( var i = 0; i <= 40; i ++ ) {
        geometry.vertices.push( new THREE.Vector3( - 200, 0, i * step - 200 ) );
        geometry.vertices.push( new THREE.Vector3(   200, 0, i * step - 200 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 200, 0, -200 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 200, 0,  200 ) );
    }
    var line = new THREE.Line( geometry, lineH_material, THREE.LinePieces );
    scene.add( line );
        
                                
    //Vertical Grid
    var lineV_material = new THREE.LineBasicMaterial( { color: 0x303030 } );
    var geometry = new THREE.Geometry();
    var step = 10;
    for ( var i = 0; i <= 40; i ++ ) {
        geometry.vertices.push( new THREE.Vector3( -200,  i * step , 0 ) );
        geometry.vertices.push( new THREE.Vector3(200, i * step , 0 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 200, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 200, 400, 0 ) );
    }
    var line = new THREE.Line( geometry, lineV_material, THREE.LinePieces );
    scene.add( line );
        
    //Triangle base
    var triangle_material = new THREE.LineBasicMaterial( { color: 0x909090 } );
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3(-200, 0 , 0) );
    geometry.vertices.push( new THREE.Vector3( 200, 400, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 200, 400, 0 ) );
    geometry.vertices.push( new THREE.Vector3(200, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3(200, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3(-200, 0, 0 ) );
    var line = new THREE.Line( geometry, triangle_material, THREE.LinePieces );
    scene.add( line );

    //Cube
    var geometry = new THREE.CubeGeometry( 50, 50, 50 );
    var texture = THREE.ImageUtils.loadTexture( 'img/crate.gif' );
    texture.anisotropy = renderer.getMaxAnisotropy();
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = 100;
    mesh.position.z = 100;
    scene.add( mesh );
    cubes.push( mesh );


    window.addEventListener( 'resize', onWindowResize, false );
}
    
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
    alert(buffer.length);
}
    
function animate() {
    requestAnimationFrame( animate );
    var timer = 0.0005 * Date.now();
    cubes[0].position.x = Math.cos( timer ) * 100;
    cubes[0].rotation.z = Math.sin( timer )*5;
    cubes[0].rotation.y = Math.cos( timer )*5;
    render();
}
    
function render() {
    controls.update( clock.getDelta() );
    renderer.render( scene, camera );
}
