const Utils = {
  // -------------------------------------
  // Parse a url and break it into resource, id and verb
  // -------------------------------------
  parseRequestURL: () => {
    let url = location.hash.slice(1).toLowerCase() || '/'
    let r = url.split('/')
    let request = {
      resource: null,
      id      : null,
      verb    : null
    }
    request.resource  = r[1]
    request.id        = r[2]
    request.verb      = r[3]

    return request
  },
  // -----------------------------------
  // Simple sleep implementation
  // -----------------------------------
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  data: async () => {
    var response = await fetch('./js/data.json')
    var data = await response.json()
    return Utils.expand(data)
  },

  datum: async(id) => {
    var data = await Utils.data()
    return data.find(datum => Utils.slim(datum.id) === Utils.slim(id))
  },

  slim: (id) => id.toLowerCase().trim(),

  mlp_filter: (data) => {
    var mapped = data.map(datum => datum.filter)
    var set = new Set(mapped)
    return [...set]
  },

  expand: (skus) => {
    return skus.map(sku => Utils.json(sku.split('|')))
    .map(sku => { return { ...sku, filter: Utils.id(sku.author) } })
  },

  json: (skuDetails) => {
    var obj = {}
    skuDetails.map(property => {
      var keyValue = property.split('=')
      obj[keyValue[0]] = keyValue[1]
    })
    return obj
  },

  replacePattern: (pattern, str) => {
    var re = new RegExp(pattern, 'g')
    var replaced = str.replace(re, '-')
    return replaced
  },

  id: (name) => {
    var replacedApos = Utils.replacePattern("'", name)
    var replaceAmp = Utils.replacePattern('&', replacedApos)
    var replacePercnt = Utils.replacePattern('%', replaceAmp)
    return replacePercnt.toLowerCase().split(' ').join('-')
  },

  YTThumbnail: (id) => `https://img.youtube.com/vi/${id}/0.jpg`
}

export default Utils