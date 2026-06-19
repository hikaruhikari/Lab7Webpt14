const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// 1. Lokasi API REST End Point (Menyesuaikan port backend CI4 lu)
const apiUrl = 'http://localhost:8080';

// 2. Definisikan mapping rute URL ke Komponen (Gabungan Praktikum 12 + Meta Auth Praktikum 13)
const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About, meta: { requiresAuth: true } }, // <-- Ditambahkan meta sesuai Tugas No.3!
    { path: '/login', component: Login }, // <-- Ditambahkan komponen Login baru
    { 
        path: '/artikel', 
        component: Artikel, 
        meta: { requiresAuth: true } // <-- Hanya boleh diakses jika user sudah login
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 3. Navigation Guards (Pencegat Akses Rute - Praktikum 13)
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    
    // Jika rute tujuan membutuhkan autentikasi dan user belum login
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        alert('Akses Ditolak! Anda harus login terlebih dahulu.');
        next('/login'); // Belokkan paksa ke halaman login
    } else {
        next(); // Izinkan akses menuju rute tujuan
    }
});

// 4. Inisialisasi Root Instance dengan State Navigasi Global (Praktikum 13)
const app = createApp({
    data() {
        return {
            isLoggedIn: false // Mengontrol menu login/logout secara global
        }
    },
    mounted() {
        // Cek status login saat aplikasi pertama kali dimuat oleh browser
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    },
    methods: {
        logout() {
            if (confirm('Apakah Anda yakin ingin keluar aplikasi?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userToken');
                this.isLoggedIn = false;
                this.$router.push('/');
            }
        }
    }
});

app.use(router);
app.mount('#app');