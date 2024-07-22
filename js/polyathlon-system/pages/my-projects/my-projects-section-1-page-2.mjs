import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/dialogs/confirm-dialog.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/upload-input.mjs'
import '../../../../components/inputs/download-input.mjs'
import '../../../../components/buttons/project-button.mjs'
import '../../../../components/inputs/avatar-input.mjs'
import '../../../../components/charts/prediction-chart.mjs'

class MyProjectsSection1Page2 extends BaseElement {
        static get properties() {
            return {
                version: { type: String, default: '1.0.0', save: true },
                dataSet: {type: Array, default: []},
                statusDataSet: {type: Map, default: null, attrubute: "status-data-set" },
                isModified: {type: Boolean, default: false},
                isReady: {type: Boolean, default: true},
                // isValidate: {type: Boolean, default: false, local: true},
                projectStatus: { type: Object, default: null, local: true },
                obj: { type: Object, default: null },
                currentPage: {type: BigInt, default: 0, attrubute: 'current-page'},
                project: {type: Object, default: null},
                chartData: { type: Array },
            }
        }

        static get styles() {
            return [
                BaseElement.styles,
                css`
                    :host {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        overflow: hidden;
                        gap: 10px;
                    }

                    header{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    #project-header{
                        grid-area: header1;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    #project-header p {
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
                        background: rgba(255, 255, 255, 0.1);
                    }

                    .left-layout project-button {
                        width: 100%;
                        height: 40px;
                    }

                    img {
                        width: 100%;
                    }

                    .right-layout {
                        grid-area: content;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-right: 20px;
                        background: rgba(255, 255, 255, 0.1);
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
                `
            ]
        }

        constructor() {
            super();
        }

        updated(changedProperties) {
            if (changedProperties.has('project') && this.project) {
                this.chartData = [];
                this.loadChartData();
            }
        }

        // update(changedProps) {
        //     super.update(changedProps);
        //     if (!changedProps) return;
        //     if (changedProps.has('project') && this.project) {
        //         this.requestUpdate()
        //     }

        // }


        render() {
            return html`
                <div>
                    <prediction-chart .data=${this.chartData}></prediction-chart>
                </div>
            `;
        }

        async loadChartData() {
            const token = await this.getToken();
            const input = this.project._id;
            const parts = input.split(":project:");
            const projectId = parts[1];

            fetch(`https://cs.rsu.edu.ru:4500/api/neural-data/${projectId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.chartData = data;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        }

        async getNewFileHandle() {
            const options = {
              types: [
                {
                  description: 'Text Files',
                  accept: {
                    'text/plain': ['.txt'],
                  },
                },
                {
                  description: 'Neural Models',
                  accept: {
                    'application/octet-stream': ['.pkl'],
                  },
                },

              ],
            };
            const handle = await window.showSaveFilePicker(options);
            return handle;
        }

        async downloadFile() {
            const token = await this.getToken();
            const projectId = this.currentProject._id;
            // const fileHandle = await window.getNewFileHandle();
            fetch(`https://cs.rsu.edu.ru:4500/api/download/${projectId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке файла: ' + response.statusText);
                }
                return response.blob();
            })
            .then(async blob => {
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob, 'model.pkl');
                } else {
                    const options = {
                        suggestedName: 'model',
                        types: [
                            {
                                description: 'Neural Model',
                                accept: {
                                  'application/octet-stream': ['.pkl']
                                }
                            },
                            {
                              description: 'Text Files',
                              accept: {
                                'text/plain': ['.txt', '.text'],
                                'text/html': ['.html', '.htm']
                              }
                            },
                            {
                              description: 'Images',
                              accept: {
                                'image/*': ['.png', '.gif', '.jpeg', '.jpg']
                              }
                            }
                            ,
                            {
                              description: 'Images 2',
                              accept: {
                                'image/png': ['.png', '.gif', '.jpeg', '.jpg']
                              }
                            },
                        ],
                        excludeAcceptAllOption: true
                    };
                    // ,
                    //         {
                    //             description: 'Text Files',
                    //             accept: {
                    //                 'text/plain': ['.txt'],
                    //             },
                    //         },
                    try {
                        // Для других браузеров
                        const fileHandle = await window.showSaveFilePicker(options);
                        const writable = await fileHandle.createWritable();
                        await writable.write(blob);
                        await writable.close();
                    } catch (err){
                        console.error(err);
                        // Для других браузеров
                        const downloadUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = 'model.pkl';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            window.URL.revokeObjectURL(downloadUrl);
                            document.body.removeChild(a);
                        }, 0);
                    }
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        }

        validateAvatar(e) {
            this.oldValues ??= new Map();
            const userProfile = this
            if (!this.oldValues.has(e.target))
                this.oldValues.set(e.target, userProfile[e.target.id])
            else {
                if (this.oldValues.get(e.target) === e.target.value) {
                    this.oldValues.delete(e.target)
                }
            }
            userProfile[e.target.id] = e.target.value
            this.isModified = this.oldValues.size !== 0;
        }

        validateInput(e) {
            if (e.target.value !== "") {
                this.oldValues ??= new Map();
                const currentProject = e.target.currentObject ?? this.currentProject
                if (!this.oldValues.has(e.target))
                    this.oldValues.set(e.target, currentProject[e.target.id])
                else {
                    if (this.oldValues.get(e.target) === e.target.value) {
                        this.oldValues.delete(e.target)
                    }
                }
                currentProject[e.target.id] = e.target.value
                this.isModified = this.oldValues.size !== 0;
            }
        }

        async getToken() {
            return localStorage.getItem('rememberMe') ?
                localStorage.getItem('accessUserToken') :
                sessionStorage.getItem('accessUserToken')
        }

        async confirmDialogShow(message) {
            return await this.renderRoot.querySelector('confirm-dialog').show(message);
        }

        async getProjectList() {
            const token = await this.getToken();
            return fetch('https://cs.rsu.edu.ru:4500/api/projects', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }

            })
            .then(response => {
                if (response.status === 419){
                    return this.refreshToken().then( token =>
                        fetch('https://cs.rsu.edu.ru:4500/api/projects', {
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
                return json.rows;
            })
            .then(projects => this.saveDataSet(projects))
            .then( () => this.getProjectStatusList() )
            .then( () => this.getProjectAvatarList() )
            // .then(() => this.modalDialogShow())
            .catch(err => {console.error(err.message)});
        }

        async saveDataSet(projects) {
            if (projects.length === 0)
                return;
            this.dataSet = projects.map(project =>
                project.doc
            ).sort( (a, b) => b._id.localeCompare(a._id) )
            this.currentProject = this.dataSet[0];
            this.requestUpdate()
        }

        async getProjectStatusList() {
            const token = await this.getToken();
            return fetch('https://cs.rsu.edu.ru:4500/api/projects-status', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }

            })
            .then(response => {
                if (response.status === 419){
                    return this.refreshToken().then( token =>
                        fetch('https://cs.rsu.edu.ru:4500/api/projects-status', {
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
            .then(projects => this.saveChildDataSet(projects))
            // .then(() => this.modalDialogShow())
            .catch(err => {console.error(err.message)});
        }

        async saveChildDataSet(statuses) {
            if (statuses.length === 0)
                return;
            this.statusDataSet = new Map();
            statuses.forEach(status => {
                this.statusDataSet.set(status._id, status)
            })
            this.requestUpdate()
        }

        async downloadAvatar() {
            const token = await this.getToken();
            return fetch(`https://cs.rsu.edu.ru:4500/api/upload/avatar`, {
                method: "GET",
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
            })
            .then(response => response.blob())
            .then(blob => {
                // if (json.error) {
                //     throw Error(json.error)
                // }
                return blob;
            })
            // .then(projectHeader => this.updateDataset(projectHeader))
            // .then(() => this.modalDialogShow())
            .catch(err => {console.error(err)});
        }


        async getProjectAvatarList() {
            const token = await this.getToken();
            return fetch('https://cs.rsu.edu.ru:4500/api/download/project-avatars', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }

            })
            .then(response => {
                if (response.status === 419){
                    return this.refreshToken().then( token =>
                        fetch('https://cs.rsu.edu.ru:4500/api/download/project-avatars', {
                            headers: {
                            'Authorization': `Bearer ${token}`
                            }

                        }).then(response => response.text())
                    )
                }
                else {
                    response.headers.forEach(a => console.log(a))
                    return response.arrayBuffer();
                }
            })
            .then(json => {
                const blob = new Blob([json], { type: "application/zip" });
                // var blobUrl = URL.createObjectURL(blob);
                // if (json.error) {
                //     throw Error(json.error)
                // }
                return blob;
            })
            .then(async blob => {
                const zipFile = new File([blob], "name.zip");
                var zip = await JSZip.loadAsync(zipFile);
                let fileList = [];
                    // async-forEach loop inspired from jszip source
                for(const filename in zip.files) {
                    // if (!zip.files.hasOwnProperty(filename)) {
                    //     continue;
                    // }
                    var blob = await zip.file( filename ).async("blob");
                    var file = new File( [blob], filename, {type : 'application/octet-stream'} );
                    this.obj = window.URL.createObjectURL(blob);
                    fileList.push(file);
                    console.log()
                    // Object key is the filename
                    // var match = filename.match( /REGEX.pdf$/ );
                    // if(match) {
                    //     var blob = await zip.file( filename ).async("blob");
                    //     var file = new File( [blob], filename, {type : 'application/pdf'} );
                    //     flist.push(file);
                    // }
                }

                console.log(fileList)

            })
            // .then(projects => this.saveChildDataSet(projects))
            // .then(() => this.modalDialogShow())
            .catch(err => {console.error(err.message)});
        }

        async saveChildDataSet(statuses) {
            if (statuses.length === 0)
                return;
            this.statusDataSet = new Map();
            statuses.forEach(status => {
                this.statusDataSet.set(status._id, status)
            })
            this.requestUpdate()
        }


        refreshToken() {
            return fetch('https://cs.rsu.edu.ru:4500/api/refresh-token', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                credentials: "include",
            })
            .then(response => response.json())
            .then(json => {
                if (json.error) {
                    throw Error(json.error)
                }
                return json.token
            })
            .then(token => this.saveToken(token))
            .catch(err => {console.error(err.message)});
        }
        async saveToken(token) {
            if (localStorage.getItem('rememberMe')) {
                localStorage.setItem('accessUserToken', token)
            }
            else {
                sessionStorage.setItem('accessUserToken', token)
            }
            return token;
        }
        async addProject() {
            const token = await this.getToken();
            const project = {name: "Новый проект"}
            return fetch(`https://cs.rsu.edu.ru:4500/api/project`, {
                method: "POST",
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(project)
            })
            .then(response => response.json())
            .then(json => {
                if (json.error) {
                    throw Error(json.error)
                }
                return json.id;
            })
            .then(projectId => this.getProject(projectId))
            .then(project => this.addToDataset(project))
            // .then(() => this.modalDialogShow())
            .catch(err => {console.error(err.message)});
        }

        async LearnModel() {
            const token = await this.getToken();
            const result = await this.uploadFile();
            if (!result) return;
            return fetch(`https://cs.rsu.edu.ru:4500/api/learn-model/${this.currentProject._id}?epochs=${this.currentProject.epochs}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(json => {
                if (json.error) {
                    throw Error(json.error)
                }
                return json;
            })
            .then(projectHeader => this.afterLearn(projectHeader))
            // .then(() => this.modalDialogShow())
            .catch(err => {console.error(err)});
        }

        afterLearn(projectHeader) {
            this.currentProject.isLearning = true;
            this.isLearning = true;
        }
        async saveProject() {
            const token = await this.getToken();
            let result = await this.uploadFile();
            if (!result) return;
            result = await this.uploadAvatarFile();
            if (!result) return;
            return fetch(`https://cs.rsu.edu.ru:4500/api/project/${this.currentProject._id}`, {
                method: "PUT",
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(this.currentProject)
            })
            .then(response => response.json())
            .then(json => {
                if (json.error) {
                    throw Error(json.error)
                }
                return json;
            })
            .then(projectHeader => this.afterSave(projectHeader))
            // .then(() => this.modalDialogShow())
            .catch(err => {console.error(err)});
        }

        async uploadFile() {
            const token = await this.getToken();
            const formData = new FormData();
            const uploadInput = this.renderRoot?.querySelector('upload-input')
            formData.append("file", uploadInput.file);
            return fetch(`https://cs.rsu.edu.ru:4500/api/upload/project/${this.currentProject._id}`, {
                method: "POST",
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
                body: formData
            })
            .then(response => response.json())
            .then(json => {
                if (json.error) {
                    throw Error(json.error)
                }
                return json;
            })
            // .then(projectHeader => this.updateDataset(projectHeader))
            // .then(() => this.modalDialogShow())
            .catch(err => {console.error(err)});
        }

        async uploadAvatarFile() {
            const token = await this.getToken();
            const formData = new FormData();
            const uploadInput = this.renderRoot?.querySelector('avatar-input')
            formData.append("file", uploadInput.value);
            return fetch(`https://cs.rsu.edu.ru:4500/api/upload/project-avatar/${this.currentProject._id}`, {
                method: "POST",
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
                body: formData
            })
            .then(response => response.json())
            .then(json => {
                if (json.error) {
                    throw Error(json.error)
                }
                return json;
            })
            // .then(projectHeader => this.updateDataset(projectHeader))
            // .then(() => this.modalDialogShow())
            .catch(err => {console.error(err)});
        }


        async deleteProject() {
            const modalResult = await this.confirmDialogShow('Вы действительно хотите удалить этот проект?')
            if (modalResult !== 'Ok')
                return;
            const token = await this.getToken();
            try {
                await this.deleteProjectFiles(token)
            } catch(err) {
                console.error(err.message)
                return
            }
            return fetch(`https://cs.rsu.edu.ru:4500/api/project/${this.currentProject._id}?rev=${this.currentProject._rev}`, {
                method: "DELETE",
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(json => {
                if (json.error) {
                    throw Error(json.error)
                }
                return json;
            })
            .then(project => this.deleteFromDS(project))
            // .then(() =>c.modalDialogShowShow())
            .catch(err => {console.error(err.message)});
        }

        async deleteProjectFiles(token) {
            return fetch(`https://cs.rsu.edu.ru:4500/api/upload/${this.currentProject._id}`, {
                method: "DELETE",
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(json => {
                if (json.error) {
                    throw Error(json.error)
                }
                return json;
            })
        }


        async cancelProject() {
            const modalResult = await this.confirmDialogShow('Вы действительно хотите отменить все изменения?')
            if (modalResult !== 'Ok')
                return
            this.oldValues.forEach( (value, key) => {
                const currentProject = key.currentObject ?? this.currentProject
                currentProject[key.id] = value;
                key.value = value;
            });
            this.oldValues.clear();
            this.isModified = false;
        }

        async deleteFromDS(project) {
            const currentIndex = this.dataSet.indexOf(this.currentProject)
            this.currentProject = this.dataSet.length === 1 ? {} :
                currentIndex === 0 ? this.dataSet[currentIndex + 1] : this.dataSet[currentIndex - 1]
            this.dataSet.splice(currentIndex, 1)
            return project
        }

        async addToDataset(project) {
            this.dataSet.unshift(project);
            this.currentProject = this.dataSet[0]
            return project
        }

        async afterSave(projectHeader) {
            this.currentProject._rev = projectHeader.rev;
            const uploadInput = this.renderRoot?.querySelector('upload-input')
            uploadInput.file = null;
            this.oldValues?.clear();
            this.isModified = false;
        }

        async getProject(projectId) {
            const token = await this.getToken();
            return fetch(`https://cs.rsu.edu.ru:4500/api/project/${projectId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(json => {
                if (json.error) {
                    throw Error(json.error)
                }
                return json;
            })
            .then(project => {
                console.log(project)
                return project
            })
            // .then(() =>c.modalDialogShowShow())
            .catch(err => {console.error(err.message)});
        }

        async firstUpdated() {
            super.firstUpdated();
        }
}

customElements.define("my-projects-section-1-page-2", MyProjectsSection1Page2);