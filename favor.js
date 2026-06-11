let container = document.querySelector('#container')

let savedNews = JSON.parse(localStorage.getItem('savedNews')) || []

if (savedNews.length === 0) {
    container.innerHTML = '<p class="loading">Список пуст. Добавьте новости с главной страницы...</p>'
} else {
    savedNews.forEach((item, index) => {
        let card = document.createElement("div")
        card.className = "news-card"

        card.innerHTML = `
            <h3 class="news-title"><a href="${item.link}" target="_blank">${item.title}</a></h3>
            <p>${item.snippet}</p>
            <div class="news-date">${item.date}</div>
            <button class="remove-btn" data-index="${index}">Удалить из списка</button>
        `

        container.appendChild(card)
    })


    let removeButtons = document.querySelectorAll('.remove-btn')

    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            let index = this.dataset.index

            savedNews.splice(index, 1)

            localStorage.setItem('savedNews', JSON.stringify(savedNews))

            location.reload()
        })
    })
}