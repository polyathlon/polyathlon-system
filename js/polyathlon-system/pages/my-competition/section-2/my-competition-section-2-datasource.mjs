import DataSet from "./my-competition-section-2-dataset.mjs";

import { States } from "../../../../utils.js";

const storageName = 'currentCompetitionSportsman'

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
                item = this.items.find((item) => item.id == itemId)
            }
            item ??= this.items[0]
            sessionStorage.setItem(storageName, item.id)
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

    getTeamCategories(team) {
        let sum = 0
        let categories = {
            men: new Map([["МСМК", 0], ["МС", 0], ["КМС", 0], ["I", 0], ["II", 0], ["III", 0], ["I юн", 0], ["II юн", 0], ["III юн", 0], ["б/р"]]),
            women: new Map([["МСМК", 0], ["МС", 0], ["КМС", 0], ["I", 0], ["II", 0], ["III", 0], ["I юн", 0], ["II юн", 0], ["III юн", 0], ["б/р"]]),
        }
        // const categoryNames = ["МСМК", "МС", "КМС", "I", "II", "III", "I юн", "II юн", "II юн", "б/р"]
        team.forEach(athlete => {
                if (athlete?.gender == 0) {
                    let category = categories.men.get(athlete.category?.shortName) ?? 0
                    category++
                    categories.men.set(athlete.category?.shortName, category)
                } else {
                    let category = categories.women.get(athlete.category?.shortName) ?? 0
                    category++
                    categories.women.set(athlete.category?.shortName, category)
                }
        })
        return categories;
    }

    sportsCategories() {
        let categories = {
            columns: ['Разряд', 'Мужчины', 'Женщины', 'Итого'],
            indexes: ['МСМК', 'МС', 'КМС', 'I', 'II', 'III', 'I юн', 'II юн', 'III юн', 'б/р'],
            rows: Array(11).fill(0).map(item => Array(4).fill(0)),
            footer: ['Всего:', 0, 0, 0]
        }
        this.items.forEach(athlete => {
            const column = categories.columns.indexOf(athlete.gender == 0 ? 'Мужчины' : 'Женщины')
            const index = categories.indexes.indexOf(athlete.category?.shortName)
            categories.rows[index][column]++
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

    async clubTypes() {
        const ClubTypesDataset = await import('../../my-club-types/my-club-types-dataset.mjs');
        const clubTypes = await ClubTypesDataset.default.getDataSet()

        let categories = {
            columns: ['Вид', 'Мужчины', 'Женщины', 'Итого'],
            indexes: clubTypes.map(item => item.name),
            rows: Array(clubTypes.length).fill(0).map(item => Array(4).fill(0)),
            footer: ['Всего:', 0, 0, 0]
        }
        this.items.forEach(athlete => {
            const column = categories.columns.indexOf(athlete.gender == 0 ? 'Мужчины' : 'Женщины')
            const index = categories.indexes.indexOf(athlete?.club?.type?.name)
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

    getTeamPoints(team) {
        team.sort((a , b) => {
            return b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze
        })
        let sum = 0
        let gold = 0
        let silver = 0
        let bronze = 0
        team.every( (athlete, index) => {
            if (index >= 5) {
                return false
            }
            sum += +(athlete?.points ?? 0)
            gold += athlete?.gold ?? 0
            silver += athlete.silver ?? 0
            bronze += athlete.bronze ?? 0
            return true
        })
        team.medals = { gold, silver, bronze }
        return sum;
    }

    getClubPoints(team) {
        team.sort((a , b) => {
            return b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze
        })
        let sum = 0
        let gold = 0
        let silver = 0
        let bronze = 0
        team.every( (athlete, index) => {
            if (index >= 4) {
                return false
            }
            sum += +(athlete?.points ?? 0)
            gold += athlete?.gold ?? 0
            silver += athlete.silver ?? 0
            bronze += athlete.bronze ?? 0
            return true
        })
        team.medals = { gold, silver, bronze }
        return sum;
    }

    getTeamResults() {
        const teams = new Map()
        const sportDisciplines = ["shooting", "strengthTraining", "swimming", "throwing", "sprinting", "running", "skiing", "rollerSkiing", "jumping"]
        this.items.forEach(athlete => {
            const team = teams.get(athlete.region?._id) ?? []
            if (athlete.teamMember) {
                let gold = 0
                let silver = 0
                let bronze = 0
                let points = 0
                sportDisciplines.forEach(discipline => {
                    points += +(athlete[discipline]?.points ?? 0)
                    gold += athlete[discipline]?.place == 1 ? 1 : 0
                    silver += athlete[discipline]?.place == 2 ? 1 : 0
                    bronze += athlete[discipline]?.place == 3 ? 1 : 0
                })
                athlete.points = points
                athlete.medals = {gold, silver, bronze}
                team.push(athlete)
                if (team.length === 1) {
                    teams.set(athlete.region?._id, team)
                }
            }
        })
        const result = Array.from(teams.values(), team => ({
            place: 1,
            region: team[0].region,
            points: this.getTeamPoints(team),
            team: team
        }))
        result.sort((a, b) => b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze).forEach( (value, index) => value.place = index + 1)
        return result
    }

    getClubResults() {
        const teams = new Map()
        const sportDisciplines = ["shooting", "strengthTraining", "swimming", "throwing", "sprinting", "running", "skiing", "rollerSkiing", "jumping"]
        this.items.forEach(athlete => {
            const team = teams.get(athlete.club?._id) ?? []
            if (athlete.clubMember) {
                let gold = 0
                let silver = 0
                let bronze = 0
                let points = 0
                sportDisciplines.forEach(discipline => {
                    points += +(athlete[discipline]?.points ?? 0)
                    gold += athlete[discipline]?.place == 1 ? 1 : 0
                    silver += athlete[discipline]?.place == 2 ? 1 : 0
                    bronze += athlete[discipline]?.place == 3 ? 1 : 0
                })
                athlete.points = points
                athlete.medals = {gold, silver, bronze}
                team.push(athlete)
                if (team.length === 1) {
                    teams.set(athlete.club?._id, team)
                }
            }
        })
        const result = Array.from(teams.values(), team => ({
            place: 1,
            club: team[0].club,
            points: this.getClubPoints(team),
            team: team
        }))
        result.sort((a, b) => b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze).forEach( (value, index) => value.place = index + 1)
        return result
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
