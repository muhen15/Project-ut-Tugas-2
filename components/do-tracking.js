Vue.component('do-tracking', {
    template: '#tpl-do-tracking',

    props: ['tracking', 'paket', 'pengirimanList'],

    data() {
        return {
            menu: 'list',
            keyword: '',
            nomorDoTerpilih: '',
            hasilCari: null,

            progressBaru: '',
            editIndex: null,
            editText: '',

            // EDIT STATE
            isEdit: false,
            editNoDO: null,

            // FORM
            form: {
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: null,
                tanggalKirim: new Date().toISOString().substr(0, 10)
            }
        };
    },

    computed: {
        listDoTerfilter() {
            if (!this.keyword) return this.tracking || {};

            const query = this.keyword.toLowerCase();
            const hasilFilter = {};

            if (this.tracking) {
                Object.keys(this.tracking).forEach(key => {
                    const item = this.tracking[key];

                    if (
                        key.toLowerCase().includes(query) ||
                        (item.nim && item.nim.toLowerCase().includes(query)) ||
                        (item.nama && item.nama.toLowerCase().includes(query))
                    ) {
                        hasilFilter[key] = item;
                    }
                });
            }

            return hasilFilter;
        }
    },

    methods: {

        // =========================
        // GENERATE NO DO
        // =========================
        generateNomorDO() {
            const year = new Date().getFullYear();
            let last = 0;

            if (this.tracking) {
                Object.keys(this.tracking).forEach(k => {
                    const match = k.match(/DO\d{4}-(\d+)/);
                    if (match) last = Math.max(last, parseInt(match[1]));
                });
            }

            return `DO${year}-${String(last + 1).padStart(3, '0')}`;
        },

        // =========================
        // FORMAT TANGGAL
        // =========================
        konversiTanggalInput(dateString) {
            if (!dateString) return '-';
            const opsi = { day: '2-digit', month: 'long', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('id-ID', opsi);
        },

// =========================
        // SIMPAN (ADD + EDIT) - BYPASS DROPDOWN BUG
        // =========================
        simpanDO() {
            // 1. Ambil elemen select paket langsung dari DOM jika form.paket terbaca kosong
            if (!this.form.paket) {
                const selectElement = document.querySelector('select[v-model="form.paket"]') || document.querySelector('select');
                if (selectElement && selectElement.value && selectElement.value !== "null") {
                    this.form.paket = selectElement.value;
                }
            }

            // 2. Cari data paket berdasarkan kode paket yang ada
            let paketTerpilih = this.paket ? this.paket.find(p => p.kode === this.form.paket) : null;

            // Jika masih tidak ketemu, kita cari berdasarkan teks detail yang muncul di layar
            if (!paketTerpilih && this.paket) {
                // Mencari paket yang kodenya terkandung di dalam pilihan internal browser
                paketTerpilih = this.paket.find(p => this.form.paket && (this.form.paket.includes(p.kode) || p.kode.includes(this.form.paket)));
            }

            // 3. Eksekusi Pengecekan Validasi Mandiri
            if (!this.form.nim) {
                alert('NIM masih kosong atau tidak terbaca!');
                return;
            }
            if (!this.form.nama) {
                alert('Nama masih kosong atau tidak terbaca!');
                return;
            }
            if (!this.form.ekspedisi) {
                alert('Ekspedisi masih kosong atau tidak terbaca!');
                return;
            }
            if (!this.form.tanggalKirim) {
                alert('Tanggal Kirim masih kosong atau tidak terbaca!');
                return;
            }
            if (!this.form.paket && !paketTerpilih) {
                alert('Paket Bahan Ajar masih kosong atau tidak terbaca!');
                return;
            }

            // Jika form.paket kosong tapi paketTerpilih aman, isi nilainya agar tidak error di database
            if (!this.form.paket && paketTerpilih) {
                this.form.paket = paketTerpilih.kode;
            }

            // =========================
            // MODE EDIT
            // =========================
            if (this.isEdit && this.editNoDO) {
                const old = this.tracking[this.editNoDO];
                if (!old) {
                    alert('Data DO tidak ditemukan!');
                    return;
                }

                const updated = {
                    ...old,
                    nim: this.form.nim,
                    nama: this.form.nama,
                    ekspedisi: this.form.ekspedisi,
                    paket: this.form.paket,
                    namaPaket: paketTerpilih ? paketTerpilih.nama : '',
                    total: paketTerpilih ? paketTerpilih.harga : 0,
                    tanggalKirim: this.form.tanggalKirim
                };

                this.$set(this.tracking, this.editNoDO, updated);
                alert('Data berhasil diupdate!');
            }

            // =========================
            // MODE TAMBAH
            // =========================
            else {
                const noDO = this.generateNomorDO();

                this.$set(this.tracking, noDO, {
                    nim: this.form.nim,
                    nama: this.form.nama,
                    ekspedisi: this.form.ekspedisi,
                    paket: this.form.paket,
                    namaPaket: paketTerpilih ? paketTerpilih.nama : '',
                    total: paketTerpilih ? paketTerpilih.harga : 0,
                    tanggalKirim: this.konversiTanggalInput(this.form.tanggalKirim),
                    status: 'Diproses',
                    perjalanan: [
                        {
                            waktu: new Date().toLocaleString('id-ID'),
                            keterangan: 'Order berhasil dibuat'
                        }
                    ]
                });

                alert('DO berhasil dibuat!');
            }

            // =========================
            // RESET STATE
            // =========================
            this.isEdit = false;
            this.editNoDO = null;

            this.form = {
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: '', // Menggunakan string kosong agar deteksi reaktivitas HTML aman
                tanggalKirim: new Date().toISOString().substr(0, 10)
            };
            
            // Pindahkan kembali menu ke list setelah berhasil menambah data
            this.menu = 'list';
        },

        // =========================
        // OPEN DETAIL
        // =========================
        bukaDetailLog(noDO) {
            this.nomorDoTerpilih = noDO;
            this.hasilCari = this.tracking[noDO];
            this.menu = 'detail';
        },

        // =========================
        // EDIT DO (ISI FORM)
        // =========================
        editDO(noDO) {

            const data = this.tracking[noDO];
            if (!data) return;

            this.form = {
                nim: data.nim,
                nama: data.nama,
                ekspedisi: data.ekspedisi,
                paket: data.paket,
                tanggalKirim: data.tanggalKirim || new Date().toISOString().substr(0, 10)
            };

            this.editNoDO = noDO;
            this.isEdit = true;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // =========================
        // HAPUS DO
        // =========================
        hapusDO(noDO) {
            if (confirm('Hapus Delivery Order ini?')) {
                this.$delete(this.tracking, noDO);
            }
        },

        // =========================
        // PROGRESS
        // =========================
        tambahProgress() {
            if (!this.progressBaru) return;

            this.hasilCari.perjalanan.push({
                waktu: new Date().toLocaleString('id-ID'),
                keterangan: this.progressBaru
            });

            this.progressBaru = '';
        },

        mulaiEditProgress(index, keterangan) {
            this.editIndex = index;
            this.editText = keterangan;
        },

        simpanEditProgress(index) {
            if (!this.editText) return;
            this.hasilCari.perjalanan[index].keterangan = this.editText;
            this.editIndex = null;
        },

        hapusProgress(index) {
            if (confirm('Hapus log riwayat perjalanan ini?')) {
                this.hasilCari.perjalanan.splice(index, 1);
            }
        }
    }
});