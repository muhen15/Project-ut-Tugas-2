Vue.component('app-modal', {

    props: ['show'],

    template: `
    <div
        v-if="show"
        class="modal-overlay">

        <div class="modal-box">

            <h3>Konfirmasi</h3>

            <p>
                Apakah Anda yakin ingin menghapus data ini?
            </p>

            <div class="modal-actions">

                <button
                    class="btn btn-danger"
                    @click="$emit('confirm')">

                    Hapus

                </button>

                <button
                    class="btn"
                    @click="$emit('close')">

                    Batal

                </button>

            </div>

        </div>

    </div>
    `
});