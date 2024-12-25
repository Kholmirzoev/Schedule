const app = Vue.createApp({
    data() {
        return {
            schedules: JSON.parse(localStorage.getItem('schedules')) || [],
            newSchedule: { name: '', shift: '', date: '', photo: '' },
            searchQuery: '',
            sortOption: '',
            showModal: false,
            editableSchedule: null,
            editIndex: null
        };
    },
    computed: {
        filteredSchedules() {
            let result = [...this.schedules];

            if (this.searchQuery) {
                result = result.filter(schedule =>
                    schedule.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            if (this.sortOption) {
                result.sort((a, b) => {
                    if (a[this.sortOption] < b[this.sortOption]) return -1;
                    if (a[this.sortOption] > b[this.sortOption]) return 1;
                    return 0;
                });
            }

            return result;
        }
    },
    methods: {
        addSchedule() {
            if (this.newSchedule.name && this.newSchedule.shift && this.newSchedule.date) {
                this.schedules.push({ ...this.newSchedule });
                this.saveToLocalStorage();
                this.resetForm();
            } else {
                alert('Заполните все поля!');
            }
        },
        resetForm() {
            this.newSchedule = { name: '', shift: '', date: '', photo: '' };
        },
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.newSchedule.photo = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        deleteSchedule(index) {
            if (confirm('Удалить запись?')) {
                this.schedules.splice(index, 1);
                this.saveToLocalStorage();
            }
        },
        openEditModal(index) {
            this.editIndex = index;
            this.editableSchedule = { ...this.schedules[index] };
            this.showModal = true;
        },
        saveEdit() {
            if (this.editableSchedule) {
                this.schedules.splice(this.editIndex, 1, { ...this.editableSchedule });
                this.saveToLocalStorage();
                this.closeModal();
            }
        },
        closeModal() {
            this.showModal = false;
            this.editableSchedule = null;
            this.editIndex = null;
        },
        saveToLocalStorage() {
            localStorage.setItem('schedules', JSON.stringify(this.schedules));
        }
    }
});

app.mount('#app');
