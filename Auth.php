<?php 
 
namespace App\Controllers\Api; 
 
use CodeIgniter\RESTful\ResourceController; 
use App\Models\UserModel; 
 
class Auth extends ResourceController 
{ 
    protected $format = 'json'; 
 
    public function login() 
    { 
        // 1. Menerima data input dari request body JSON 
        $username = $this->request->getVar('username'); 
        $password = $this->request->getVar('password'); 
 
        $model = new UserModel(); 
         
        // 2. Cari user berdasarkan username atau email di database 
        $user = $model->where('username', $username) 
                      ->orWhere('useremail', $username) 
                      ->first(); 
 
        if ($user) { 
            // 3. Verifikasi password (sesuaikan dengan format enkripsi database Praktikum 4) 
            if ($password === $user['userpassword'] || password_verify($password, $user['userpassword'])) { 
                 
                // Jika sukses, kirim status data dan token respon 
                return $this->respond([ 
                    'status'   => 200, 
                    'error'    => null, 
                    'messages' => 'Login Berhasil', 
                    'data'     => [ 
                        'id'       => $user['id'], 
                        'username' => $user['username'], 
                        'token'    => base64_encode("TOKEN-SECRET-" . $user['username']) 
                    ] 
                ], 200); 
            }
        } 
        // 4. Jika gagal, kirim status error 401 (Unauthorized) 
        return $this->failUnauthorized('Username atau Password yang Anda masukkan salah.'); 
    } 
} 