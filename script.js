// 1. إعداد المشهد والكاميرا والريندر
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. إنشاء النوت بوك (شكل مبدئي بأبعاد حقيقية)
// نستخدم BoxGeometry عشان نعمل الشكل الأساسي (الغلاف)
const geometry = new THREE.BoxGeometry(2.5, 3.5, 0.4);

// المادة (Material) - بنعملها بلون الجلد الأخضر بتاع صورتك
const material = new THREE.MeshStandardMaterial({ 
    color: 0x1b5e5e, // اللون الأخضر الغامق (نفس لون المنتج)
    roughness: 0.6,  // خشونة عالية شوية عشان تعطي إحساس الجلد
    metalness: 0.1   // لمعة خفيفة جداً
});

const notebook = new THREE.Mesh(geometry, material);
scene.add(notebook);

// 3. إضافة الرباط (الشريط البينك) اللي في المنتج
const bandGeometry = new THREE.TorusGeometry(1.3, 0.05, 16, 100);
const bandMaterial = new THREE.MeshStandardMaterial({ color: 0xe8a0a0 }); // لون بينك فاتح
const band = new THREE.Mesh(bandGeometry, bandMaterial);
band.rotation.x = Math.PI / 2;
band.position.y = 0.2;
band.scale.y = 1.4;
notebook.add(band); // نضيفه كجزء من النوت بوك

// 4. الإضاءة (عشان تفاصيل الـ 3D تبان)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // إضاءة محيطة خفيفة
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // إضاءة رئيسية
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const rimLight = new THREE.PointLight(0xd4af37, 2, 10); // إضاءة ذهبية من الخلف (زي التعليقة)
rimLight.position.set(-5, 0, -5);
scene.add(rimLight);

camera.position.z = 7;

// 5. حركة الماوس (عشان المنتج يلف مع حركة العميل)
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// 6. حلقة الأنيميشن (بتشتغل 60 مرة في الثانية)
function animate() {
    requestAnimationFrame(animate);
    
    // نستخدم GSAP عشان الحركة تكون ناعمة جداً
    gsap.to(notebook.rotation, {
        y: mouseX * 0.8,   // يلف يمين وشمال
        x: -mouseY * 0.4,  // يميل فوق وتحت
        duration: 1.5,
        ease: "power2.out"
    });

    // حركة طفو خفيفة (Floating) عشان المنتج ميبقاش ثابت
    notebook.position.y = Math.sin(Date.now() * 0.002) * 0.1;

    renderer.render(scene, camera);
}

animate();

// 7. تجاوب مع تغيير حجم الشاشة
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
