new Vue({
    el: "#app",

    data: {
        nomorDO: "",
        pesanError: "",
        dataTracking: null,

        // DATA CONTOH (dummy database)
        dummy: [
            {
                nomor: "DO001",
                nim: "123456",
                nama: "Budi Santoso",
                status: "Dalam Pengiriman",
                ekspedisi: "JNE",
                tanggalKirim: "20-05-2026",
                paket: "Buku Modul UT",
                total: 150000,
                perjalanan: [
                    { waktu: "08:00", keterangan: "Paket diproses di gudang" },
                    { waktu: "12:00", keterangan: "Paket dikirim ke ekspedisi" },
                    { waktu: "18:00", keterangan: "Dalam perjalanan ke kota tujuan" }
                ]
            },
            {
                nomor: "DO002",
                nim: "789101",
                nama: "Siti Aminah",
                status: "Sampai",
                ekspedisi: "J&T",
                tanggalKirim: "18-05-2026",
                paket: "Modul UT Semester",
                total: 200000,
                perjalanan: [
                    { waktu: "09:00", keterangan: "Paket diproses" },
                    { waktu: "15:00", keterangan: "Sampai di tujuan" }
                ]
            }
        ]
    },

    computed: {
        totalPerjalanan() {
            if (!this.dataTracking) return 0;
            return this.dataTracking.perjalanan.length + " update perjalanan";
        }
    },

    methods: {

        cekTracking() {
            if (!this.nomorDO) {
                this.pesanError = "Masukkan nomor DO terlebih dahulu!";
                return;
            }

            let hasil = this.dummy.find(item => item.nomor === this.nomorDO);

            if (!hasil) {
                this.dataTracking = null;
                this.pesanError = "Nomor DO tidak ditemukan!";
            } else {
                this.dataTracking = hasil;
                this.pesanError = "";
            }
        },

        resetTracking() {
            this.nomorDO = "";
            this.dataTracking = null;
            this.pesanError = "";
        }
    }
});