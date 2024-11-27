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

    static find(name, value) {
        const index = DataSet.#dataSet.findIndex(element =>
            element[name] === value || element[name].toLowerCase() === value
        )
        return index === -1 ? null : DataSet.#dataSet[index]
    }

    static #fetchGetItems(token) {
        return fetch('https://localhost:4500/api/referees', {
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

    static fetchAddItem(token, item) {
        return fetch(`https://localhost:4500/api/referee`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        })
    }

    static async addItem(item) {
        const token = getToken();
        let response = await DataSet.fetchAddItem(token, item)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.fetchAddItem(token, item)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }

        const newItem = await DataSet.getItem(result.id)
        DataSet.addToDataset(newItem)
        return newItem
    }

    static addToDataset(item) {
        DataSet.#dataSet.unshift(item);
    }

    static #fetchGetItem(token, itemId) {
        return fetch(`https://localhost:4500/api/referee/${itemId}`, {
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

    static #fetchGetItemByRefereeId(token, itemId) {
        return fetch(`https://localhost:4500/api/referee-id/${itemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getItemByRefereeId(itemId) {
        const token = getToken();

        let response = await DataSet.#fetchGetItemByRefereeId(token, itemId)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.#fetchGetItemByRefereeId(token, itemId)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchGetItemByLastName(token, itemId) {
        return fetch(`https://localhost:4500/api/referee/last-name/${itemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getItemByLastName(itemId) {
        const token = getToken();

        let response = await DataSet.#fetchGetItemByLastName(token, itemId)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.#fetchGetItemByLastName(token, itemId)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchSaveItem(token, item) {
        return fetch(`https://localhost:4500/api/referee/${item._id}`, {
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
        return fetch(`https://localhost:4500/api/referee/${item._id}?rev=${item._rev}`, {
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

    static fetchCreateHashNumber(token, item) {
        return fetch(`https://localhost:4500/api/referee-id`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        })
    }

    static async createHashNumber(item) {
        const token = getToken();
        let response = await DataSet.fetchCreateHashNumber(token, item)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.fetchCreateHashNumber(token, item)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result.number
    }

    static fetchGetQRCode(token, data) {
        return fetch(`https://localhost:4500/api/qr-code?data=${data}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
        })
    }

    static async getQRCode(data) {
        const token = getToken();
        let response = await DataSet.fetchGetQRCode(token, data)

        if (response.status === 419) {
            const token = await refreshToken()
            response = await DataSet.fetchGetQRCode(token, data)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result.qr
    }
}
