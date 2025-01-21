import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";

const container = document.querySelector('.three-bg');
const loader = new THREE.TextureLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

let geometry, material, mesh;

// 배경 PlaneGeometry 생성
function createPlaneGeometry() {
    const aspectCanvas = window.innerWidth / window.innerHeight;
    const aspectImage = material.map.image.width / material.map.image.height;

    let width, height;
    if (aspectCanvas > aspectImage) {
        // 캔버스가 더 넓을 경우 이미지의 높이를 기준으로 채움
        width = 10 * aspectCanvas;
        height = 10;
    } else {
        // 캔버스가 더 높을 경우 이미지의 너비를 기준으로 채움
        width = 10;
        height = 10 / aspectCanvas;
    }

    geometry = new THREE.PlaneGeometry(width, height, 15, 9);
}

// 텍스처 로드 및 설정
function setupBackground() {
    const texture = loader.load(
        './assets/images/main/bg_main.jpg',
        () => {
            createPlaneGeometry(); // 텍스처 로드 후 PlaneGeometry 생성

            // 기존 Mesh가 있으면 제거
            if (mesh) {
                scene.remove(mesh);
                mesh.geometry.dispose();
                mesh.material.dispose();
            }

            // 새 Mesh 생성
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // 애니메이션 시작
            animate();
        }
    );

    material = new THREE.MeshBasicMaterial({
        map: texture,
    });
}

// 카메라 초기 위치 설정
camera.position.z = 4;

// 창 크기 변경 처리
function onWindowResize() {
    if (!material || !material.map || !material.map.image) return; // 텍스처가 아직 로드되지 않았다면 무시

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Geometry 업데이트
    createPlaneGeometry();
    if (mesh) {
        mesh.geometry.dispose();
        mesh.geometry = geometry;
    }
}

// 애니메이션 루프
const clock = new THREE.Clock();
function animate() {
    if (!geometry || !geometry.attributes || !geometry.attributes.position) return; // geometry가 없으면 애니메이션 실행 안 함

    const time = clock.getElapsedTime();

    for (let i = 0; i < geometry.attributes.position.count; i++) {
        const x = geometry.attributes.position.getX(i);
        const animl = 0.25 * Math.sin(x + time * 0.7);

        geometry.attributes.position.setZ(i, animl);
    }

    geometry.computeVertexNormals();
    geometry.attributes.position.needsUpdate = true;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// 이벤트 리스너 등록
window.addEventListener('resize', onWindowResize);

// 초기화
setupBackground();
