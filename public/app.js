// blowerio-sms-sandbox
// Sandbox for Blower.io SMS
//
// Copyright (C) 2018  https://github.com/KillWolfVlad
//
// This file is part of blowerio-sms-sandbox.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

function clearMessages() {
    document.getElementById("messages").innerHTML = "";
}

function appendMessages(data) {
    let result = "";
    data.forEach((item) => {
        result = `
<div style="padding-bottom: 15px;">
    <div class="card">
        <div class="card-header">
            Receiver: <b>${item.receiver}</b> <i>#${item.id}</i>
        </div>
        <div class="card-body">
            <p class="card-text">${item.message}</p>
        </div>
        <div class="card-footer text-muted">
            ${new Date(item.date).toLocaleString()}
        </div>
    </div>
</div>
            ` + result;
    });
    $("#messages").prepend(result);
}

const app = new Vue({
    el: "#app",
    data: {
        to: "",
        message: "",
    },
    methods: {
        async erase() {
            const root_password = prompt("Enter password");
            if (!root_password)
                return;
            try {
                await axios({
                    method: "delete",
                    url: "/api/v0/messages",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        "accepts": "application/json"
                    },
                    data: `root_password=${encodeURIComponent(root_password)}`
                });
            } catch (error) {
                alert(error.response.data.message);
            }
        },
        async submit() {
            try {
                await axios({
                    method: "post",
                    url: "/api/v0/messages",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        "accepts": "application/json"
                    },
                    data: `to=${encodeURIComponent(this.to)}&message=${encodeURIComponent(this.message)}`
                });
                this.message = "";
            } catch (error) {
                appendMessages([{
                    date: new Date().toString(),
                    id: "?",
                    message: error.response.data.message,
                    receiver: "Error",
                }]);
            }
        }
    }
});

const socket = io({
    transports: ["websocket"]
});

socket.on("connect", clearMessages);
socket.on("clear", clearMessages);
socket.on("messages", appendMessages);
