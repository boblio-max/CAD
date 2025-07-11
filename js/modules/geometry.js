import { scene } from './viewer.js';

let currentMesh;
let isWireframe = false;

function createModel(params, detailSegments) {
    if (currentMesh) {
        scene.remove(currentMesh);
        currentMesh.geometry.dispose();
        currentMesh.material.dispose();
    }
    
    let geometry;

    switch (params.shape) {
        case 'gear':
            geometry = createGearGeometry(params.diameter / 2, params.teeth, params.thickness || 10, params.hole || 0);
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(params.radius, detailSegments, detailSegments / 2);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(params.diameter / 2, params.diameter / 2, params.height, detailSegments);
            break;
        case 'cube':
            geometry = new THREE.BoxGeometry(params.size, params.size, params.size);
            break;
        default:
            geometry = new THREE.BoxGeometry(20, 20, 20); // Fallback
    }

    const material = new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        metalness: 0.2,
        roughness: 0.5,
        wireframe: isWireframe,
    });

    currentMesh = new THREE.Mesh(geometry, material);
    currentMesh.castShadow = true;
    currentMesh.receiveShadow = true;
    
    // Center geometry for better viewing
    const box = new THREE.Box3().setFromObject(currentMesh);
    box.getCenter(currentMesh.position).multiplyScalar(-1);

    scene.add(currentMesh);
}

function createGearGeometry(outerRadius, numTeeth, thickness, holeRadius) {
    const shape = new THREE.Shape();
    const innerRadius = outerRadius * 0.9;
    const rootRadius = outerRadius * 0.8;
    
    for (let i = 0; i < numTeeth; i++) {
        const t = i / numTeeth;
        const alpha = t * Math.PI * 2;
        const angle = (Math.PI * 2) / numTeeth;

        const p0 = new THREE.Vector2(Math.cos(alpha) * rootRadius, Math.sin(alpha) * rootRadius);
        const p1 = new THREE.Vector2(Math.cos(alpha + angle * 0.25) * innerRadius, Math.sin(alpha + angle * 0.25) * innerRadius);
        const p2 = new THREE.Vector2(Math.cos(alpha + angle * 0.5) * innerRadius, Math.sin(alpha + angle * 0.5) * innerRadius);
        const p3 = new THREE.Vector2(Math.cos(alpha + angle * 0.75) * rootRadius, Math.sin(alpha + angle * 0.75) * rootRadius);

        if (i === 0) shape.moveTo(p0.x, p0.y);
        else shape.lineTo(p0.x, p0.y);
        shape.lineTo(p1.x, p1.y);
        shape.lineTo(p2.x, p2.y);
        shape.lineTo(p3.x, p3.y);
    }

    if (holeRadius > 0) {
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
        shape.holes.push(holePath);
    }

    const extrudeSettings = {
        steps: 2,
        depth: thickness,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(-Math.PI / 2); // Orient correctly
    return geometry;
}

function toggleWireframe() {
    if (!currentMesh) return;
    isWireframe = !isWireframe;
    currentMesh.material.wireframe = isWireframe;
    return isWireframe;
}

export { createModel, toggleWireframe };
