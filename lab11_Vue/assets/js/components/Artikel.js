const Artikel = {
    template: `
        <div>
            <h1>Daftar Artikel</h1>
            <table> 
                <thead> 
                    <tr> 
                        <th>ID</th> 
                        <th>Judul</th> 
                        <th>Status</th> 
                        <th>Aksi</th> 
                    </tr> 
                </thead> 
                <tbody> 
                    <tr v-for="(row, index) in artikel" :key="row.id"> 
                        <td class="center-text" v-text="row.id"></td> 
                        <td v-text="row.judul"></td> 
                        <td v-text="statusText(row.status)"></td> 
                        <td class="center-text"> 
                            <a href="#" @click.prevent="edit(row)">Edit</a> 
                            <a href="#" @click.prevent="hapus(index, row.id)">Hapus</a> 
                        </td> 
                    </tr> 
                </tbody> 
            </table>
            <button id=\"btn-tambah\" @click=\"tambah\">Tambah Data</button> 

            <div class=\"modal\" v-if=\"showForm\"> 
                <div class=\"modal-content\"> 
                    <span class=\"close\" @click=\"showForm = false\">&times;</span> 
                    <form id=\"form-data\" @submit.prevent=\"saveData\"> 
                        <h3 id=\"form-title\">{{ formTitle }}</h3> 
                        <div><input type=\"text\" name=\"judul\" id=\"judul\" v-model=\"formData.judul\" placeholder=\"Judul\" required></div> 
                        <div><textarea name=\"isi\" id=\"isi\" rows=\"10\" v-model=\"formData.isi\"></textarea></div> 
                        <div> 
                            <select name=\"status\" id=\"status\" v-model=\"formData.status\"> 
                                <option v-for=\"option in statusOptions\" :value=\"option.value\"> 
                                    {{ option.text }} 
                                </option> 
                            </select> 
                        </div> 
                        <input type=\"hidden\" id=\"id\" v-model=\"formData.id\"> 
                        <button type=\"submit\" id=\"btnSimpan\">Simpan</button> 
                        <button type=\"button\" @click=\"showForm = false\">Batal</button> 
                    </form> 
                </div> 
            </div>
        </div>
    `,
    data() { 
        return { 
            artikel: '', 
            formData: { id: null, judul: '', isi: '', status: 0 }, 
            showForm: false, 
            formTitle: 'Tambah Data', 
            statusOptions: [ 
                {text: 'Draft', value: 0}, 
                {text: 'Publish', value: 1}, 
            ], 
        } 
    }, 
    mounted() { 
        this.loadData() 
    }, 
    methods: { 
        loadData() { 
            axios.get('http://localhost:8080/post') 
            .then(response => { 
                this.artikel = response.data.data 
            }) 
            .catch(error => console.log(error)) 
        }, 
        tambah() { 
            this.showForm = true 
            this.formTitle = 'Tambah Data' 
            this.formData = { id: null, judul: '', isi: '', status: 0 } 
        }, 
        hapus(index, id) { 
            if (confirm("Apakah anda yakin menghapus data ini?")) { 
                axios.delete('http://localhost:8080/post/' + id) 
                .then(response => { 
                    this.artikel.splice(index, 1); 
                }) 
                .catch(error => console.log(error)) 
            } 
        }, 
        edit(data) { 
            this.showForm = true; 
            this.formTitle = 'Ubah Data' 
            this.formData = {  
                id: data.id, 
                judul: data.judul, 
                isi: data.isi, 
                status: data.status 
             }; 
        }, 
        saveData() { 
            const params = new URLSearchParams();
            params.append('judul', this.formData.judul);
            params.append('isi', this.formData.isi);
            params.append('status', this.formData.status);

            if (this.formData.id) { 
                axios.put('http://localhost:8080/post/' + this.formData.id, params) 
                .then(response => { this.loadData() }) 
                .catch(error => console.log(error)) 
            } else { 
                axios.post('http://localhost:8080/post', params) 
                .then(response => { this.loadData() }) 
                .catch(error => console.log(error)) 
            } 
 
            this.formData = { id: null, judul: '', isi: '', status: 0 }; 
            this.showForm = false; 
        },
        statusText(status) { 
            return status == 1 ? 'Publish' : 'Draft'; 
        }
    }
}