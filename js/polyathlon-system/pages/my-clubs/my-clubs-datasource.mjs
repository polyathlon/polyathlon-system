import DataSet from "./my-clubs-dataset.mjs";

import { States } from "../../../utils.js";

const storageName = 'currentClub'

export default class DataSource {
    #lock = false
    #oldItem
    sortDirection = true
    constructor(component, dataSet) {
        this.component = component
        this.items = [...dataSet]
        this.dataSet = dataSet
        this.sort(this.sortDirection)
        this.init()
        this.state = States.BROWSE
    }

    init() {
        if (this.items.length) {
            let itemId = sessionStorage.getItem(storageName)
            let item
            if (itemId) {
                item = this.items.find((item) => item.id == itemId)
            }
            item ??= this.items[0]
            sessionStorage.setItem(storageName, item?.id)
            this.component.currentItem = item
        } else {
            this.component.currentItem = {}
        }
    }

    sort(sortDirection) {
        this.sortDirection = sortDirection
        if (sortDirection === undefined) {
            this.items.sort((a, b) => a.sortOrder - b.sortOrder || a._id?.localeCompare(b._id))
            return
        }
        this.items.sort( (a, b) => {
            [a, b] = sortDirection ? [a, b] : [b, a]
            let r = a.name?.localeCompare(b.name)
            if (r) {
                return r
            }
            return 0
        })
    }

    async filter(currentFilter) {
        this.items = (await DataSet.getDataSet()).filter(item =>
            (!('name' in currentFilter) || currentFilter?.name == item.name)
            &&(!('region' in currentFilter) || currentFilter?.region?._id == item.region?._id)
            &&(!('city' in currentFilter) || currentFilter.city && (currentFilter?.city?._id == item.city?._id))
            &&(!('type' in currentFilter) || currentFilter.type && (currentFilter?.type?._id == item.type?._id))
            &&(!('clubPC' in currentFilter) || currentFilter?.clubPC == item.clubPC)
        )
        this.sort(this.sortDirection)
        return this.items?.[0]
    }

    async clearFilter() {
        this.items = await DataSet.getDataSet()
        this.sort(this.sortDirection)
        return this.items?.[0]
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

    getCurrentItem(){
        const item = sessionStorage.getItem(storageName)
        if (item) {
            return this.items.find(p => p._id === item)
        } else {
            sessionStorage.setItem(storageName, this.items[0]?._id)
            return this.items?.[0]
        }
    }

    setCurrentItem(item) {
        sessionStorage.setItem(storageName, item?._id)
        this.component.currentItem = item
    }

    async saveFirstItem(item) {
        const newItem = await DataSet.addItem(item)
        if (!this.#lock) {
            this.addToDataSource(newItem)
        }
    }

    async addNewItem(item) {
        this.#oldItem = this.component.currentItem
        this.state = States.NEW
        this.component.currentItem = {}
    }

    async addItem(item) {
        const newItem = await DataSet.addItem(item)
        if (!this.#lock) {
            this.addToDataSource(newItem)
        }
    }

    addToDataSource(item) {
        this.items.push(item)
        this.sort(this.sortDirection)
        this.setCurrentItem(item)
    }

    async saveNewItem(item) {
        const newItem = await DataSet.addItem(item)
        if (!this.#lock) {
            this.addToDataSource(newItem)
        }
        this.state = States.BROWSE
    }

    cancelNewItem() {
        this.component.currentItem = this.#oldItem
        this.state = States.BROWSE
    }

    lock() {
        this.#lock = true;
    }

    async unlock() {
        if (this.#lock) {
            this.items = [...this.dataSet]
            this.sort(this.sortDirection)
            await this.init()
            this.#lock = false;
        }
    }

    async saveItem(item) {
        await DataSet.saveItem(item)
        this.state = States.BROWSE
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
        this.state = States.BROWSE
    }
}
