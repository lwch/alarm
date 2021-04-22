import axios from 'axios';
import moment = require('moment');
const description = 'vscode alarm extension logs';
const url = 'https://api.github.com/gists';

type mp = {[key: string]: string}

export class gists {
    token: string;
    headers: mp;

    constructor(token: string) {
        this.token = token;
        this.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token '+token
        };
    }

    append(content: string) {
        if (!this.token) {
            return;
        }
        let dt = new Date();
        exists(this.headers).then((result) =>  {
            if (!result) {
                create(this.headers, dt);
            } else {
                update(this.headers, result, dt);
            }
            append(this.headers, result, dt, content);
        });
    }
};

async function exists(headers: mp) {
    let page = 1;
    while (true) {
        let list = await axios({
            method: 'GET',
            url: url+'?page='+page,
            headers: headers
        });
        if (list.data.length == 0) {
            return false;
        }
        for (let i in list.data) {
            let obj = list.data[i];
            if (obj.description != description) {
                continue;
            }
            return obj.id;
        }
        page++;
    }
}

function create(headers: mp, dt: Date) {
    axios({
        method: 'POST',
        url: url,
        headers: headers,
        data: {
            'description': description,
            'files': {
                'vscode.alarm.logs': {
                    name: 'vscode.alarm.logs',
                    content: JSON.stringify({'lastUpload':dt})
                }
            }
        }
    });
}

function update(headers: mp, id: string, dt: Date) {
    axios({
        method: 'PATCH',
        url: url+'/'+id,
        headers: headers,
        data: {
            'files': {
                'vscode.alarm.logs': {
                    name: 'vscode.alarm.logs',
                    content: JSON.stringify({'lastUpload':dt})
                }
            }
        }
    });
}

async function append(headers: mp, id: string, dt: Date, content: string) {
    let name = moment(dt).format('YYYYMMDD')+'.log';
    let result = await axios({
        method: 'GET',
        url: url+'/'+id,
        headers: headers
    });
    if (result.data.files[name]) {
        content = result.data.files[name].content+"\n"+content;
    }
    axios({
        method: 'PATCH',
        url: url+'/'+id,
        headers: headers,
        data: {
            'files': {
                [ name ]: {
                    name: name,
                    content: content
                }
            }
        }
    });
}