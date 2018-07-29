"use strict";

function BouncingArrow(
    posX, posY, vX, vY,
    aAllObjs, aObstacle, aDestroyable,
    master
) {
    Arrow.call(
        this,
        posX, posY, vX, vY, Arrow.eAssets.eBouncingArrowTexture,
        aAllObjs, aObstacle, aDestroyable,
        master
    );

    this.getRigidBody().setMass(0.1);

    this.mBounceCount = 30;

    //particles
    this.mGenerateParticles = 1;
    this.mParticles = new ParticleGameObjectSet();
}
gEngine.Core.inheritPrototype(BouncingArrow, Arrow);

BouncingArrow.prototype.update = function () {
    Arrow.prototype.update.call(this);

    if (this.mGenerateParticles === 1) {
        var p = this.createParticle(this.getXform().getXPos(), this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
    gEngine.ParticleSystem.update(this.mParticles);
};

BouncingArrow.prototype.draw = function (aCamera) {
    this.mParticles.draw(aCamera);
    Arrow.prototype.draw.call(this, aCamera);
};

BouncingArrow.prototype.createParticle = function (atX, atY) {
    var life = 30 + Math.random() * 200;
    var p = new ParticleGameObject("assets/particles/Particle2.png", atX, atY, life);
    p.getRenderable().setColor([0, 0, 1, 1]);

    // size of the particle
    var r = 3.5 + Math.random() * 2.5;
    p.getXform().setSize(r, r);

    // final color
    var fr = 3.5 + Math.random();
    var fg = 0.4 + 0.1 * Math.random();
    var fb = 0.3 + 0.1 * Math.random();
    p.setFinalColor([fr, fg, fb, 0.6]);

    // velocity on the particle
    var fx = 10 * Math.random() - 20 * Math.random();
    var fy = 10 * Math.random();
    p.getParticle().setVelocity([fx, fy]);

    // size delta
    p.setSizeDelta(0.98);

    return p;
};

BouncingArrow.prototype.effectOnObstacle = function (obj) {
    var v = this.getRigidBody().getVelocity();
    if (Math.abs(v[0]) > Math.abs(v[1]))
        this.getRigidBody().setVelocity(-v[0] * 1.2, v[1] * 1.2);
    else if (Math.abs(v[0]) <= Math.abs(v[1]))
        this.getRigidBody().setVelocity(v[0] * 1.2, -v[1] * 1.2);
    this.mBounceCount--;
    if (this.mBounceCount === 0) {
        this.mCurrentState = Arrow.eArrowState.eMiss;
        this.mAllObjs.removeFromSet(this);
    }
};