import DataSet from "./my-disciplines-dataset.mjs";

export default class DataSource {

    constructor(component, dataSet) {
        this.component = component;
        this.dataSet = dataSet;
        this.items = this.dataSet.map(item => {
            return item;
        }).sort( (a, b) => a.name.localeCompare(b.name) )
        this.component.currentItem = this.getCurrentItem();
    }

    getCurrentItem(){
        const item = sessionStorage.getItem('currentDiscipline')
        if (item) {
            return this.items.find(p => p._id === item)
        }
        else {
            sessionStorage.setItem('currentDiscipline', this.items[0]?._id)
            return this.items?.[0]
        }
    }

    setCurrentItem(item) {
        sessionStorage.setItem('currentDiscipline', item._id)
        this.component.currentItem = item;
    }

    async addItem(item) {
        const newItem = await DataSet.addItem(item)
        this.addTo(newItem)
    }

    addTo(item) {
        this.items.unshift(item)
        this.setCurrentItem(item)
    }

    async saveItem(item) {
        await DataSet.saveItem(item)
    }

    async deleteItem(item) {
        await DataSet.deleteItem(item)
        this.deleteFrom(item)
    }

    deleteFrom(item) {
        const currentIndex = this.items.indexOf(item)
        if (this.items.length === 1) {
            this.setCurrentItem({})
        }
        else if (currentIndex === 0) {
            this.setCurrentItem(this.items[currentIndex + 1])
        }
        else {
            this.setCurrentItem(this.items[currentIndex - 1])
        }
        this.items.splice(currentIndex, 1)
    }
}
