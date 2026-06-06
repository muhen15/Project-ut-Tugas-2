Vue.component('ba-stock-table', {
    template: '#tpl-stock',

    props: {
        stok: {
            type: Array,
            default: () => []
        },
        upbjjList: {
            type: Array,
            default: () => []
        },
        kategoriList: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            selectedUpbjj: '',
            selectedKategori: '',
            filterReorder: '',

            isEdit: false,
            editIndex: -1,

            formBaru: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: '',
                qty: '',
                safety: '',
                catatan: ''
            }
        };
    },
    
    computed: {
        filteredStock() {
            return this.stok.filter(item => {
                // 1. Filter UPBJJ
                const matchUpbjj = !this.selectedUpbjj || item.upbjj === this.selectedUpbjj;
                
                // 2. Filter Kategori
                const matchKategori = !this.selectedKategori || item.kategori === this.selectedKategori;
                
                // 3. Filter Kondisi Stok (Fixed Logis)
                let matchStatus = true;
                if (this.filterReorder === 'kosong') {
                    matchStatus = item.qty === 0;
                } else if (this.filterReorder === 'menipis') {
                    matchStatus = item.qty > 0 && item.qty < item.safety;
                } else if (this.filterReorder === 'aman') {
                    matchStatus = item.qty >= item.safety;
                }

                return matchUpbjj && matchKategori && matchStatus;
            });
        } // <-- TANDA KOMA DI SINI DIHAPUS JIKA HANYA ADA 1 FUNGSI COMPUTED
    }, // <-- FIX: WAJIB ADA TANDA KOMA DI SINI UNTUK MENYAMBUNG KE METHODS

    methods: {
        formatRupiah(value) {
            if (!value) return 'Rp 0';
            return 'Rp ' + Number(value).toLocaleString('id-ID');
        },

        formatQty(value) {
            if (value === 0 || !value) return '0';
            return Number(value).toLocaleString('id-ID');
        },

        tambahBahanAjar() {
            // 1. Validasi Input Form
            if (
                !this.formBaru.kode ||
                !this.formBaru.judul ||
                !this.formBaru.kategori ||
                !this.formBaru.upbjj
            ) {
                alert('Mohon lengkapi data!');
                return;
            }

            // 2. Pemetaan data baru
            const dataBaru = {
                kode: this.formBaru.kode,
                judul: this.formBaru.judul,
                kategori: this.formBaru.kategori,
                upbjj: this.formBaru.upbjj,
                lokasiRak: this.formBaru.lokasiRak || '-',
                lokasi_rak: this.formBaru.lokasiRak || '-', 
                harga: Number(this.formBaru.harga) || 0,
                qty: Number(this.formBaru.qty) || 0,
                safety: Number(this.formBaru.safety) || 10,
                catatan: this.formBaru.catatan || '',
                Catatan: this.formBaru.catatan || ''
            };

            // 3. Proses Simpan / Edit
            if (this.isEdit) {
                this.$set(
                    this.stok,
                    this.editIndex,
                    dataBaru
                );

                alert('Data berhasil diperbarui!');
                this.isEdit = false;
                this.editIndex = -1;
            } else {
                this.stok.push(dataBaru);
                alert('Bahan ajar berhasil ditambahkan!');
            }

            // 4. Reset form input kembali kosong
            this.resetForm();
        },

        editData(item) {
            this.formBaru = {
                kode: item.kode,
                judul: item.judul,
                kategori: item.kategori,
                upbjj: item.upbjj,
                lokasiRak: item.lokasi_rak || item.lokasiRak || '', 
                harga: item.harga,
                qty: item.qty,
                safety: item.safety || 10, 
                catatan: item.catatan || item.Catatan || '' 
            };

            this.editIndex = this.stok.findIndex(
                x => x.kode === item.kode
            );

            this.isEdit = true;
        },

        batalEdit() {
            this.isEdit = false;
            this.editIndex = -1;
            this.resetForm();
        },

        resetForm() {
            this.formBaru = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: '',
                qty: '',
                safety: '',
                catatan: ''
            };
        },

        hapusData(kode) {
            if (!confirm('Yakin ingin menghapus data ini?')) {
                return;
            }

            const index = this.stok.findIndex(
                item => item.kode === kode
            );

            if (index !== -1) {
                this.stok.splice(index, 1);
            }
        },

        // Cadangan: Menghindari error merah "Property or method 'hapusStok' is not defined" di console log
        hapusStok(kode) {
            this.hapusData(kode);
        }
    }
});