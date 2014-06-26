// Licensed to Pioneers in Engineering under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Pioneers in Engineering licenses
// this file to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
//  with the License.  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License

/*/============================
Ammo.js wrappers
============================/*/

const window = require('tenshi/common/window')();
let {Ammo} = window;


// TODO(ericnguyen): adjust friction/damping to reflect reality

// creates a box physic, returns box
function createBoxPhysics(width, height, depth, mass, iniX, iniY, iniZ, physicsWorld)
{
    var nMass = mass;
    var startTransform = new Ammo.btTransform();
    startTransform.setIdentity();
    startTransform.setOrigin(new Ammo.btVector3(iniX, iniY, iniZ)); // Set initial position

    var localInertia = new Ammo.btVector3(0, 0, 0); // physics fills this later

    var boxShape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, height/2, depth/2));
    boxShape.calculateLocalInertia(nMass, localInertia);

    var motionState = new Ammo.btDefaultMotionState(startTransform);
    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, boxShape, localInertia);
        rbInfo.set_m_linearDamping(0.5); // friction seems to be off, no damping = infinite sliding
        rbInfo.set_m_angularDamping(0.2);
    var boxAmmo = new Ammo.btRigidBody(rbInfo);

    if(physicsWorld)
        physicsWorld.addRigidBody(boxAmmo);

    // getCollisionShape() is what raycaster returns, needs reference back to this object
    boxAmmo.getCollisionShape().parent = boxAmmo;

    return boxAmmo;
}

// creates a cylinder physics, returns it
function createCylinderPhysics(radius, height, mass, iniX, iniY, iniZ, physicsWorld)
{
    var nMass = mass;
    var startTransform = new Ammo.btTransform();
    startTransform.setIdentity();
    startTransform.setOrigin(new Ammo.btVector3(iniX, iniY, iniZ)); // Set initial position

    var localInertia = new Ammo.btVector3(0, 0, 0);

    var cylShape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, height/2, radius));
    cylShape.calculateLocalInertia(nMass, localInertia);

    var motionState = new Ammo.btDefaultMotionState(startTransform);
    var rbInfo = new Ammo.btRigidBodyConstructionInfo(nMass, motionState, cylShape, localInertia);
        rbInfo.set_m_angularDamping(0.5);
        rbInfo.set_m_linearDamping(0.5);
    var cylAmmo = new Ammo.btRigidBody(rbInfo);

    if(physicsWorld)
        physicsWorld.addRigidBody(cylAmmo);

    // getCollisionShape() is what raycaster returns, needs reference back to this object
    cylAmmo.getCollisionShape().parent = cylAmmo;

    return cylAmmo;
}

function transformObject(obj, transform)
{
    obj.setActivationState(1);
    obj.setWorldTransform(transform);
}

function translateObject(obj, vector)
{
    var objTransform = obj.getCenterOfMassTransform(),
        newTransform = translateTransform(objTransform, vector);

    obj.setActivationState(1);
    obj.setWorldTransform(newTransform);
}

function setPositionObject(obj, vector)
{
    var objTransform = obj.getCenterOfMassTransform(),
        newTransform = replacePositionOfTransform(objTransform, vector);

    obj.setActivationState(1);
    obj.setWorldTransform(newTransform);
}

function rotateObjectEuler(obj, vector)
{
    var objTransform = obj.getCenterOfMassTransform(),
        newVector = addVector(vector, quatToEuler(objTransform.getRotation())),
        newTransform = replaceQuaternionOfTransform(objTransform,
                              eulerToQuat(newVector.x(), newVector.y(), newVector.z()));

    obj.setActivationState(1);
    obj.setWorldTransform(newTransform);
}

function rotateObject(obj, quat)
{
    var objTransform = obj.getCenterOfMassTransform(),
        newTransform = rotateTransform(objTransform, quat);

    obj.setActivationState(1);
    obj.setWorldTransform(newTransform);

    printOut(strQuat(newTransform.getRotation()));
}

function setRotationObject(obj, quat)
{
    var objTransform = obj.getCenterOfMassTransform(),
        newTransform = replaceQuaternionOfTransform(objTransform, quat);

    obj.setActivationState(1);
    obj.setWorldTransform(newTransform);
}

exports.createBoxPhysics = createBoxPhysics;
exports.createCylinderPhysics = createCylinderPhysics;
