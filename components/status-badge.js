Vue.component('status-badge', {
    props: ['qty', 'safety'],

    template: `
        <span>

            <span
                v-if="qty === 0"
                class="badge danger"
                title="Stok habis">
                ❌ Kosong
            </span>

            <span
                v-else-if="qty < safety"
                class="badge warning"
                title="Stok di bawah safety stock">
                ⚠ Menipis
            </span>

            <span
                v-else
                class="badge success"
                title="Stok aman">
                ✔ Aman
            </span>

        </span>
    `
});