var stage_dom = document.getElementById("stage");
var stage, sun, star, planets, player;

stage_dom.addEventListener('load', function() {
    stage = stage_dom.contentDocument;
    sun = stage.getElementsByClassName('sun')[0];
    star = stage.getElementsByClassName('star')[0];
    planets = stage.getElementsByClassName('planet');
    player = stage.getElementsByClassName('player')[0];

    player.jumping = 1;
    player.ground = sun;

    player.vector = getNormalsBetweenPoints(getBodyCenterPoint(player),getBodyCenterPoint(player.ground))[0];
    player.radius = player.r.baseVal.value;
    player.ground.radius = player.ground.r.baseVal.value;
    player.ground.height = player.radius + player.ground.radius;

    for (var i = 0; i < planets.length; i++) {
        var planet = planets[i];
        planet.speed = parseFloat(planet.getAttribute('speed'));
        TweenMax.to(planet, Math.abs(10 * planet.speed), {rotation: 360 * Math.sign(planet.speed), svgOrigin: "600px 600px", repeat: -1, ease: Linear.easeNone});
    }

    TweenMax.to(star, 2.618, {rotation: 360, scale: 0, svgOrigin:"600px 600px", repeat:-1, yoyo:true, ease:SteppedEase.config(10.472)});

    var jump = addEventListener('player_jump',playerStartJump);

    console.log(player);

    var game_loop = setInterval(gameFrame, 16.6666666667);

    function gameFrame() {
        playerPhysics();
    }

    function playerStartJump() {
        console.log('whee!');
    }

    function playerPhysics() {
        switch (player.jumping) {
            case 0:
                var gc = getBodyCenterPoint(player.ground);
                var p = setDistanceFromPoint(gc,player.vector,player.ground.height);
                TweenMax.set(player, {svgOrigin: gc.x + "px " + gc.y + "px", attr:{x: gc.x, y: gc.y}});
                return;
            case 1:
                TweenMax.set(player, {x: "+" + player.vector.x, y: "+" + player.vector.y});
                break;
            case -1:
                TweenMax.set(player, {cx: "-" + player.vector.x, y: "-" + player.vector.y});
                break;
            default:
                break;
        }

        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];

            var playerCenter = getBodyCenterPoint(player);

            var planetCenter = getBodyCenterPoint(planet);
            var d = getDistanceBetweenPoints(playerCenter, planetCenter);

            var groundCenter = getBodyCenterPoint(player.ground);

            var e = getDistanceBetweenPoints(playerCenter, groundCenter);

            if (d < e && player.ground != planet) {
                player.jumping = -1;

                player.ground = planet;
                groundCenter = getBodyCenterPoint(player.ground)
                player.vector = getNormalsBetweenPoints(playerCenter, groundCenter)[0];
                player.ground.radius = player.ground.r.baseVal.value;
                player.ground.height = player.radius + player.ground.radius;

                console.log('ground', player.ground);
            }

            if (d < player.ground.height) {
                player.jumping = 0;

                console.log('land', player.ground);
            }
        }


    }
});

function getBodyCenterPoint(body) {
    var bodyX = body.getBoundingClientRect().left;
    var bodyY = body.getBoundingClientRect().top;
    var bodyW = body.getBoundingClientRect().width;
    var bodyH = body.getBoundingClientRect().height;

    return {x: bodyX + bodyW/2, y: bodyY + bodyH/2};
}

function setDistanceFromPoint(p1, normal, distance) {
    var d = {x: normal.x * distance + p1.x, y: normal.y * distance + p1.y};
    return d;
}

function getNormalsBetweenPoints(p1, p2) {
    var d = getDistanceBetweenPoints(p1, p2);

    var p1N = {x: (p1.x - p2.x) / d, y: (p1.y - p2.y) / d};
    var p2N = {x: (p2.x - p1.x) / d, y: (p2.y - p1.y) / d};

    return [p1N, p2N];
}

function getDistanceBetweenPoints(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2));
}

stage_dom.setAttribute('data','/levels/level_1.svg');