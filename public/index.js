function getEndpoints() {
    return [
        '/api/profiles',
        '/api/profiles/1',
        '/api/profiles/stats/byLocation',
        '/api/locations',
        '/api/locations/1',
        '/api/queries'
    ].sort()
}
async function getAllEndpoints(endpoints) {
    return await Promise.all(
        endpoints.map(ep =>
            axios.get(ep)
                .catch(err => err)
        )
    )
}
async function runTests() {
    var ResponsesContainer = document.querySelector('.ResponsesContainer')
    ResponsesContainer.innerHTML = null
    var endpoints = getEndpoints()
    function run(ep) {
        return axios.get(ep).catch(err => err.response).then(response => {
            var res = UI.Response(response)
            ResponsesContainer.appendChild(res)
        })
    }
    for (var i in endpoints) {
        await run(endpoints[i])
    }
}

var UI = (function UI() {
    function Response(response) {
        var div = document.createElement('div')
        div.className = 'ResponseData ' + (response.status === 200 ? '' : 'error')
        div.appendChild(ResponseDataURL(response.config.url))
        div.appendChild(ResponseStatus(response.status, JSON.stringify(response.data.data)))
        return div
    }
    function ResponseDataURL(url) {
        var div = document.createElement('div')
        div.innerHTML = url
        return div
    }
    function ResponseStatus(status, title) {
        var el = document.createElement('span')
        el.title = title
        el.innerHTML = status === 200 ? 'OK' : 'ERR'
        return el
    }
    function ResponseBody(data) {
        var el = document.createElement('pre')
        el.innerHTML = JSON.stringify(data)
        return el
    }
    return {
        Response
    }
})()

runTests()

var Actions = (function Actions() {
    function populate(){
        return axios.get('/api/tasks/populate')
    }
    return {
        populate
    }
})()
