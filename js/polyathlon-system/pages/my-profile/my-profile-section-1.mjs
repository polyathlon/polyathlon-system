import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/dialogs/confirm-dialog.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/upload-input.mjs'
import '../../../../components/inputs/download-input.mjs'
import '../../../../components/buttons/country-button.mjs'
import '../../../../components/inputs/avatar-input.mjs'
import './my-profile-section-1-page-1.mjs'
// import './my-competitions-section-1-page-2.mjs'

class MyProfileSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0', save: true },
            dataSet: {type: Array, default: []},
            statusDataSet: {type: Map, default: null },
            oldValues: {type: Map, default: null },
            currentItem: {type: Object, default: null},
            isModified: {type: Boolean, default: "", local: true},
            isReady: {type: Boolean, default: true},
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            obj: { type: Object, default: null },
            currentPage: {type: BigInt, default: 0},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: grid;
                    width: 100%;
                    grid-template-columns: 3fr 9fr;
                    grid-template-rows: 50px 1fr 50px;
                    grid-template-areas:
                        "header1 header2"
                        "sidebar content"
                        "footer  footer";
                    gap: 0 20px;
                    background: linear-gradient(180deg, var(--header-background-color) 0%, var(--gradient-background-color) 100%);
                }

                header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                #competition-header{
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                #competition-header p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                    margin: 0;
                }

                #property-header{
                    grid-area: header2;
                }

                .left-layout {
                    grid-area: sidebar;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: var(--layout-background-color);
                }

                .left-layout country-button {
                    width: 100%;
                    height: 40px;
                }

                img {
                    width: 100%;
                }

                .right-layout {
                    grid-area: content;
                    display: flex;
                    /* justify-content: space-between; */
                    justify-content: center;
                    align-items: center;
                    /* margin-right: 20px; */
                    background: var(--layout-background-color);
                    overflow: hidden;
                    gap: 10px;
                }

                h1 {
                    font-size: 3.4375rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin: 20px 0 0;
                }

                h2 {
                    font-weight: 300;
                    line-height: 1.2;
                    font-size: 1.25rem;
                }

                p {
                    font-size: 1.25rem;
                    margin: 20px 207px 20px 0;
                    overflow-wrap: break-word;
                }

                a {
                    display: inline-block;
                    text-transform: uppercase;
                    color: var(--native-color);
                    margin: 20px auto 0 0;
                    background-color: var(--background-green);
                    letter-spacing: 1px;
                    text-decoration: none;
                    white-space: nowrap;
                    padding: 10px 30px;
                    border-radius: 0;
                    font-weight: 600;
                }

                a:hover {
                    background-color: var(--button-hover-color);
                }

                footer {
                    grid-area: footer;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-right: 20px;
                    gap: 10px;
                }

                footer simple-button {
                    height: 40px;
                }
                #drop_zone {
                    border: 5px solid blue;
                    width: 200px;
                    height: 100px;
                }
                avatar-input {
                    height: 50px;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
                }
                .left-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }
                .right-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }
                simple-icon[visible] {
                    display: none;
                }

                // simple-icon {
                //     visibility: hidden;
                // }

                // simple-icon:hover {
                //     visibility: visible;
                // }
                country-button[selected] {
                    background: rgba(255, 255, 255, 0.1)
                }
                country-button:hover {
                    background: rgba(255, 255, 255, 0.1)
                }
            `
        ]
    }

    constructor() {
        super();
        this.statusDataSet = new Map()
        this.pageNames = ['Country property']
        this.oldValues = new Map();
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._rev, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentCountryItem')) {
            this.currentPage = 0;
        }
    }

    async showItem(index, itemId) {
        if (this.isModified) {
            const modalResult = await this.confirmDialogShow('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok')
                this.saveItem().then(() => this.currentItem = this.dataSet[index]);
        }
        else {
            this.setCurrentItem(this.dataSet[index])
        }
    }

    #page() {
        return cache(this.currentPage === 0 ? this.#page1() : this.#page2());
    }

    #page1() {
        return html`
            <my-profile-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-profile-section-1-page-1>
        `;
    }

    #page2() {
        return html`
            <my-profile-section-1-page-1 .item=${this.currentItem}></my-profile-section-1-page-1>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    render() {
        return html`
            <confirm-dialog></confirm-dialog>
            <header id="competition-header"><p>Country ${this.currentItem?.name}</p></header>
            <header id="property-header">${this.#pageName}</header>
            <div class="left-layout">
                ${this.dataSet.map((item, index) =>
                    html `<country-button
                                label=${item?.name}
                                title=${item?._rev}
                                .logotype=${item?.flag && 'https://hatscripts.github.io/circle-flags/flags/' + item.flag + '.svg' }
                                .status=${this.statusDataSet.get(item?._rev)}
                                ?selected=${this.currentItem === item}
                                @click=${() => this.showItem(index, item?._rev)}
                            >
                            </country-button>
                `)}
            </div>
            <div class="right-layout">
                ${this.#page()}
            </div>
            <footer>
                <simple-button label=${this.isModified ? "Сохранить": "Удалить"} @click=${this.isModified ? this.saveItem: this.deleteItem}></simple-button>
                <simple-button label=${this.isModified ? "Отменить": "Добавить"} @click=${this.isModified ? this.cancelItem: this.addItem}></simple-button>
            </footer>
        `;
    }
    async getUserProfile() {
        const token = await this.getToken();
        return fetch('https://localhost:4500/api/user-profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }

        })
        .then(response => {
            if (response.status === 419){
                return this.refreshToken().then( token =>
                    fetch('https://localhost:4500/api/user-profile', {
                        headers: {
                        'Authorization': `Bearer ${token}`
                        }

                    }).then(response => response.json())
                )
            }
            else {
                return response.json()
            }
        })
        .then(json => {
            if (json.error) {
                throw Error(json.error)
            }
            return json;
        })
        .then(userProfile => this.saveDataSet(userProfile))
        .catch(err => {console.error(err.message)});
    }
    nextPage() {
        this.currentPage++;
    }
    prevPage() {
        this.currentPage--;
    }

    validateInput(e) {
        if (e.target.value !== "") {
            this.oldValues ??= new Map();
            const currentItem = e.target.currentObject ?? this.currentItem
            if (!this.oldValues.has(e.target))
                this.oldValues.set(e.target, currentItem[e.target.id])
            else if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
            }
            currentItem[e.target.id] = e.target.value
            this.isModified = this.oldValues.size !== 0;
        }
    }

    getToken() {
        return localStorage.getItem('rememberMe') ? localStorage.getItem('accessUserToken') : sessionStorage.getItem('accessUserToken')
    }

    async confirmDialogShow(message) {
        return await this.renderRoot.querySelector('confirm-dialog').show(message);
    }

    fetchGetItems(token) {
        return fetch('https://localhost:4500/api/user-profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    async getItems() {
        const token = this.getToken()
        let response = await this.fetchGetItems(token)
        if (response.status === 419) {
            const token = await this.refreshToken()
            response = await this.fetchGetItems(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        const items = [result];
        this.saveDataSet(items)
    }

    async refreshToken() {
        const response = await fetch('https://localhost:4500/api/refresh-token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: "include",
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }

        const token = result.token
        this.saveToken(token)
        return token
    }

    saveToken(token) {
        if (localStorage.getItem('rememberMe')) {
            localStorage.setItem('accessUserToken', token)
        }
        else {
            sessionStorage.setItem('accessUserToken', token)
        }
        return token;
    }

    saveDataSet(items) {
        if (items.length === 0)
            return;
        this.dataSet = items.map(item => {
            return item;
        }).sort( (a, b) => b._rev.localeCompare(a._rev) )
        this.currentItem = this.getCurrentItem();
        this.requestUpdate()
    }

    getCurrentItem(){
        // const item = sessionStorage.getItem('currentCountry')
        // if (item) {
        //     return this.dataSet.find(p => p._rev === item)
        // }
        // else {
        //     sessionStorage.setItem('currentCountry', this.dataSet[0]._rev)
        //     return this.dataSet[0]
        // }
        return this.dataSet[0]
    }

    setCurrentItem(item) {
        sessionStorage.setItem('currentCountry', item._rev)
        this.currentItem = item;
    }

    fetchAddItem(token) {
        const newItem = {name: "Новая страна"}
        return fetch(`https://localhost:4500/api/country`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newItem)
        })
    }

    async addItem() {
        const token = this.getToken();
        let response = await this.fetchAddItem(token)

        if (response.status === 419) {
            const token = await this.refreshToken()
            response = await this.fetchAddItem(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }

        const item = await this.getItem(result.id)
        this.addToDataset(item)
    }

    addToDataset(item) {
        this.dataSet.unshift(item);
        this.currentItem = this.dataSet[0]
    }

    fetchGetItem(token, itemId) {
        return fetch(`https://localhost:4500/api/country/${itemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    async getItem(itemId) {
        const token = this.getToken();

        let response = await this.fetchGetItem(token, itemId)

        if (response.status === 419) {
            const token = await this.refreshToken()
            response = await this.fetchGetItem(token, itemId)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    fetchSaveItem(token) {
        return fetch(`https://localhost:4500/api/country/${this.currentItem._rev}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(this.currentItem)
        })
    }

    async saveItem() {
        const token = this.getToken();

        let response = await this.fetchSaveItem(token)

        if (response.status === 419) {
            const token = await this.refreshToken()
            response = await this.fetchSaveItem(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        this.afterSave(result)
    }

    async afterSave(projectHeader) {
        this.currentItem._rev = projectHeader.rev;
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelItem() {
        const modalResult = await this.confirmDialogShow('Вы действительно хотите отменить все изменения?')
        if (modalResult !== 'Ok')
            return
        this.oldValues.forEach( (value, key) => {
            const currentItem = key.currentObject ?? this.currentItem.personalInfo
            currentItem[key.id] = value;
            key.value = value;
        });
        this.oldValues.clear();
        this.isModified = false;
    }

    fetchDeleteItem(token) {
        return fetch(`https://localhost:4500/api/country/${this.currentItem._rev}?rev=${this.currentItem._rev}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    async deleteItem() {
        const modalResult = await this.confirmDialogShow('Вы действительно хотите удалить этот проект?')
        if (modalResult !== 'Ok')
            return;

        const token = this.getToken();

        let response = await this.fetchDeleteItem(token)

        if (response.status === 419) {
            const token = await this.refreshToken()
            response = await this.fetchDeleteItem(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        this.deleteFromDS(result)
    }

    deleteFromDS(item) {
        const currentIndex = this.dataSet.indexOf(this.currentItem)
        if (this.dataSet.length === 1) {
            this.currentItem = {}
        }
        else if (currentIndex === 0) {
            this.currentItem = this.dataSet[currentIndex + 1]
        }
        else {
            this.currentItem = this.dataSet[currentIndex - 1]
        }
        this.dataSet.splice(currentIndex, 1)
    }

    async firstUpdated() {
        super.firstUpdated();
        await this.getItems();
    }
}

customElements.define("my-profile-section-1", MyProfileSection1);