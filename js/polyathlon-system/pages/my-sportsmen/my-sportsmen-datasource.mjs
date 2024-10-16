import DataSet from "./my-sportsmen-dataset.mjs";

import { States } from "../../../utils.js";

export default class DataSource {

    #lock = false

    #newItem
    #oldItem
    #oldListItem

    constructor(component, dataSet) {
        this.component = component
        this.items = [...dataSet]
        this.state = States.BROWSE
    }

    async init() {
        if (this.items.length) {
            let itemId = sessionStorage.getItem('currentSportsman')
            let listItem
            if (itemId) {
                listItem = this.items.find((item) => item.id == itemId)
            }
            listItem ??= this.items[0]
            const item = await DataSet.getItem(listItem.id)
            sessionStorage.setItem('currentSportsman', listItem.id)
            this.component.currentItem = item
            this.component.listItem = listItem
        } else {
            this.component.currentItem = {}
            this.component.listItem = {}
        }
    }

    filter(value) {
        this.items = this.dataSet.filter(item => {
            return item?.country?.name === value?.name;
        }).sort( (a, b) => a.name.localeCompare(b.name) )
    }

    async getCurrentItem(item_id){
        return await this.setCurrentItem(item_id)
    }

    async setCurrentItem(listItem) {
        const item = await DataSet.getItem(listItem.id)
        sessionStorage.setItem('currentSportsman', listItem.id)
        this.component.currentItem = item
        this.component.listItem = listItem
    }

    async saveFirstItem(item) {
        const newItem = await DataSet.addItem(item)
        const listItem = DataSet.addToDataset(newItem)
        this.addTo(newItem, listItem)
    }

    async addNewItem(item) {
        this.#oldItem = this.component.currentItem
        this.#oldListItem = this.component.listItem
        this.#newItem = {key: "Новый спортсмен"}
        this.state = States.NEW
        this.component.currentItem = {}
        this.component.listItem = this.#newItem
    }

    async addItem(item) {
        const newItem = await DataSet.addItem(item)
        const listItem = DataSet.addToDataset(newItem)
        if (!this.#lock) {
            this.addToDataSource(newItem, listItem)
        }
    }

    async saveNewItem(item) {
        const newItem = await DataSet.addItem(item)
        const listItem = DataSet.addToDataset(newItem)
        this.addToDataSource(newItem, listItem)
        this.state = States.BROWSE
    }

    addToDataSource(newItem, listItem) {
        this.items.push(listItem)
        this.items.sort( (a, b) => a.key.localeCompare(b.key))
        sessionStorage.setItem('currentSportsman', listItem.id)
        this.component.currentItem = newItem
        this.component.listItem = listItem
    }

    cancelNewItem() {
        this.component.currentItem = this.#oldItem
        this.component.listItem = this.#oldListItem
        this.state = States.BROWSE
    }

    lock() {
        this.#lock = true;
    }

    async unlock() {
        if (this.#lock) {
            this.items = this.dataSet.map(item => {
                return item;
            }).sort( (a, b) => a.key.localeCompare(b.key) )
            await this.init()
            this.#lock = false;
        }
    }

    async saveItem(item, listItem) {
        await DataSet.saveItem(item)
        listItem.key = item.lastName
        if (item.firstName) {
            listItem.key += ' ' + item.firstName[0] + '.'
        }
        if (item.middleName) {
            listItem.key += item.middleName[0] + '.'
        }
        listItem.value.hashNumber = item.hashNumber
        listItem.value.gender = item.gender
        this.state = States.BROWSE
    }

    async deleteItem(item, listItem) {
        await DataSet.deleteItem(item, listItem)
        this.deleteFrom(listItem)
    }

    deleteFrom(listItem) {
        const currentIndex = this.items.indexOf(listItem)
        if (this.items.length === 1) {
            sessionStorage.removeItem('currentSportsman')
            this.component.currentItem = {}
            this.component.listItem = {}
        }
        else if (currentIndex === 0) {
            this.setCurrentItem(this.items[currentIndex + 1])
        }
        else {
            this.setCurrentItem(this.items[currentIndex - 1])
        }
        this.items.splice(currentIndex, 1)
        this.state = States.BROWSE
    }
}
