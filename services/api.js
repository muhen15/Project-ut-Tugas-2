const ApiService = {

    loadData() {

        return fetch('data/dataBahanAjar.json')
            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        'Gagal memuat data'
                    );

                }

                return response.json();

            });

    }

};