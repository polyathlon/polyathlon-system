import DataSet from "./my-competition-section-6-dataset.mjs";

import { States } from "../../../../utils.js";

const storageName = 'currentCompetitionResultSportsman'

export default class DataSource {
    #lock = false
    #oldItem
    sortDirection = true
    constructor(component, dataSet) {
        this.component = component
        this.items = [...dataSet]
        this.sort(this.sortDirection)
        this.init()
        this.state = States.BROWSE
    }

    init() {
        if (this.items.length) {
            let itemId = sessionStorage.getItem(storageName)
            let item
            if (itemId) {
                item = this.items.find((item) => item._id == itemId)
            }
            item ??= this.items[0]
            sessionStorage.setItem(storageName, item._id)
            this.component.currentItem = item
        } else {
            this.component.currentItem = {}
        }
    }

    sort(sortDirection) {
        this.sortDirection = sortDirection
        this.items.sort( (a, b) => {
            [a, b] = sortDirection ? [a, b] : [b, a]
            let r = a.lastName?.localeCompare(b.lastName)
            if (r) {
                return r
            }
            r = a.firstName?.localeCompare(b.firstName)
            if (r) {
                return r
            }
            r = a.middleName?.localeCompare(b.middleName)
            if (r) {
                return r
            }
            return 0
        })
    }

    async refereeCategories() {
        const Dataset = await import('../../my-referee-categories/my-referee-categories-dataset.mjs');
        const dataset = await Dataset.default.getDataSet()

        let categories = {
            columns: ['Вид', 'Мужчины', 'Женщины', 'Итого'],
            indexes: dataset.map(item => item.name),
            rows: Array(dataset.length).fill(0).map(item => Array(4).fill(0)),
            footer: ['Всего:', 0, 0, 0]
        }
        this.items.forEach(athlete => {
            const column = categories.columns.indexOf(athlete.gender == 0 ? 'Мужчины' : 'Женщины')
            const index = categories.indexes.indexOf(athlete?.category?.name)
            if (index != -1) {
                categories.rows[index][column]++
            }
        })
        categories.rows.forEach(element => {
            element[categories.columns.length - 1] = element[1] + element[2]
            categories.footer[1] += element[1]
            categories.footer[2] += element[2]
            categories.footer[3] += element[categories.columns.length - 1]
        });
        categories.rows = categories.rows.filter( (item, index) => {
            if (item.at(-1) == 0) {
                categories.indexes[index] = ''
                return false
            }
            return true
        })
        categories.indexes = categories.indexes.filter(value => value)
        return categories
    }

    async filter(currentFilter) {
        this.items = (await DataSet.getDataSet()).filter(item =>
                (!('lastName' in currentFilter) || currentFilter?.lastName == item.lastName)
                &&(!('firstName' in currentFilter) || currentFilter?.firstName == item.firstName)
                &&(!('middleName' in currentFilter) || currentFilter?.middleName == item.middleName)
                &&(!('gender' in currentFilter) || currentFilter?.gender == item.gender)
                &&(!('category' in currentFilter) || currentFilter?.category?._id == item.category?._id)
                &&(!('position' in currentFilter) || currentFilter?.position?._id == item.position?._id)
                &&(!('region' in currentFilter) || currentFilter?.region?._id == item.region?._id)
                &&(!('city' in currentFilter) || currentFilter.city && (currentFilter?.city?._id == item.city?._id))
                &&(!('sortOrder' in currentFilter) || currentFilter?.sortOrder == item.sortOrder)
                &&(!('refereePC' in currentFilter) || currentFilter?.refereePC == item.refereePC)
        )
        this.sort(this.sortDirection)
        return this.items?.[0]
    }

    async clearFilter() {
        this.items = await DataSet.getDataSet()
        this.sort(this.sortDirection)
        return this.items?.[0]
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
        sessionStorage.setItem(storageName, item._id)
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

    async saveItem(item, listItem) {
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
        } else {
            this.setCurrentItem(this.items[currentIndex - 1])
        }
        this.items.splice(currentIndex, 1)
        this.state = States.BROWSE
    }
}
