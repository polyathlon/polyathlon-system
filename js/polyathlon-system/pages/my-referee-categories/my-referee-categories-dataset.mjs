import refreshToken, {getToken} from "../../refresh-token.mjs";

export default class DataSet {
    static #dataSet;

    static async getDataSet() {
        if (DataSet.#dataSet) {
            return DataSet.#dataSet
        }
        DataSet.#dataSet = await DataSet.#getItems()
        return DataSet.#dataSet
    }

    static #fetchGetItems(token) {
        return fetch('https://localhost:4500/api/referee-categories', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async #getItems() {
        const token = getToken()
        let response = await DataSet.#fetchGetItems(token)
        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.#fetchGetItems(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        const items = result.rows.map(item => {
            return item.doc;
        })
        return items
    }

    static fetchAddItem(token) {
        const newItem = {name: "Новая страна"}
        return fetch(`https://localhost:4500/api/referee-categories`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newItem)
        })
    }

    static async addItem() {
        const token = getToken();
        let response = await DataSet.fetchAddItem(token)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.fetchAddItem(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }

        const item = await DataSet.getItem(result.id)
        DataSet.addToDataset(item)
        return item
    }

    static addToDataset(item) {
        DataSet.#dataSet.unshift(item);
    }

    static #fetchGetItem(token, itemId) {
        return fetch(`https://localhost:4500/api/referee-categories/${itemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getItem(itemId) {
        const token = getToken();

        let response = await DataSet.#fetchGetItem(token, itemId)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.#fetchGetItem(token, itemId)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchSaveItem(token, item) {
        return fetch(`https://localhost:4500/api/referee-categories/${item._id}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        })
    }

    static async saveItem(item) {
        const token = getToken();

        let response = await DataSet.#fetchSaveItem(token, item)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.#fetchSaveItem(token, item)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        DataSet.#afterSave(item, result)
    }

    static #afterSave(item, itemHeader) {
        item._rev = itemHeader.rev;
    }

    static #fetchDeleteItem(token, item) {
        return fetch(`https://localhost:4500/api/referee-categories/${item._id}?rev=${item._rev}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async deleteItem(item) {
        const token = getToken();

        let response = await DataSet.#fetchDeleteItem(token, item)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.#fetchDeleteItem(token, item)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        DataSet.#deleteFromDS(item)
    }

    static #deleteFromDS(item) {
        const itemIndex = DataSet.#dataSet.indexOf(item)
        if (itemIndex === -1) {
            return
        }
        DataSet.#dataSet.splice(itemIndex, 1)
    }
}