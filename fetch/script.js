
async function get(url) {
  var response = await fetch(url)
  return response.text()
}
function json(data) {
  var content = document.querySelector('.-content')
  content.innerHTML = data
  var verses = content.querySelectorAll('p span.text')
  var book_json = Array.from(verses).map(datum => {
    var text_content = datum.textContent
    var id = datum.className.split(' ')[1]
    var id_pieces = id.split('-')
    var book = id_pieces[0]
    var chapter = id_pieces[1]
    var verse = id_pieces[2]
    return { book, chapter, verse, text_content }
  })
  console.log('book json', book_json)
  return book_json
}

var books = {
  matthew: {
    verse_count: 28
  }
}
var verse = 1

function update() {
  var url = `https://www.biblegateway.com/passage/?search=matthew${verse}&version=TPT`
    get(url).then(data => {
      books.matthew[`matthew-${verse}`] = json(data)
      verse !== books.matthew.verse_count ? update() : reset()
      verse++;
      console.log('verse', verse);
    })
}

function reset() {
  verse = 1
  console.log('books', books)
  localStorage.setItem('books', JSON.stringify(books))
}
update()