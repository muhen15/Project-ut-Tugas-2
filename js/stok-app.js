    var app = new Vue({
    el: '#app',

    data: {

        keyword: "",

        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],

        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],

        pengirimanList: [
        { kode: "REG", nama: "Reguler (3-5 hari)" },
        { kode: "EXP", nama: "Ekspres (1-2 hari)" }
        ],

        paket: [
        {
            kode: "PAKET-UT-001",
            nama: "PAKET IPS Dasar",
            isi: ["EKMA4116","EKMA4115"],
            harga: 120000
        }
        ],

        stok: [
        {
            kode: "EKMA4116",
            judul: "Pengantar Manajemen",
            kategori: "MK Wajib",
            upbjj: "Jakarta",
            lokasiRak: "R1-A3",
            harga: 65000,
            qty: 28,
            safety: 20,
            catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
        },

        {
            kode: "EKMA4115",
            judul: "Pengantar Akuntansi",
            kategori: "MK Wajib",
            upbjj: "Jakarta",
            lokasiRak: "R1-A4",
            harga: 60000,
            qty: 7,
            safety: 15,
            catatanHTML: "<strong>Cover baru</strong>"
        }
        ]
    },

    computed: {

        filteredStok() {

        return this.stok.filter(item =>

            item.judul.toLowerCase()
            .includes(this.keyword.toLowerCase())

        );

        }

    },

    watch: {

        keyword(newValue) {

        console.log("Keyword berubah:", newValue);

        },

        stok: {

        handler() {

            console.log("Data stok berubah");

        },

        deep: true

        }

    }

    });