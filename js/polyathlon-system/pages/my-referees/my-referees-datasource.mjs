import DataSet from "./my-referees-dataset.mjs";

export default class DataSource {

    constructor(component, dataSet) {
        this.component = component;
        this.dataSet = dataSet;
        this.items = this.dataSet.map(item => {
            return item;
        }).sort( (a, b) => a.lastName.localeCompare(b.lastName) )
        this.component.currentItem = this.getCurrentItem();
    }

    filter(value) {
        this.items = this.dataSet.filter(item => {
            return item?.country?.name === value?.name;
        }).sort( (a, b) => a.name.localeCompare(b.name) )
    }

    find(value) {
        return this.items.find(item =>
            item.lastName?.includes(value?.lastName)
        )
    }

    findIndex(value) {
        return this.items.findIndex(item =>
            item.lastName?.includes(value?.lastName)
        )
    }

    sort(sortDirection) {
        this.items.sort( (a, b) =>
            sortDirection ? a.lastName.localeCompare(b.lastName) : b.lastName.localeCompare(a.lastName)
        )
    }

    getCurrentItem(){
        const item = sessionStorage.getItem('currentReferee')
        if (item) {
            return this.items.find(p => p._id === item)
        }
        else {
            sessionStorage.setItem('currentReferee', this.items[0]?._id)
            return this.items?.[0]
        }
    }

    setCurrentItem(item) {
        sessionStorage.setItem('currentReferee', item._id)
        this.component.currentItem = item
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
