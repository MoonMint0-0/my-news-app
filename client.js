fetch('http://localhost:8080/news')
    .then(response => response.json())
    .then(news => {
        let container = document.getElementById('container');

        news.forEach(item => {


            let card = document.createElement("div")
            card.className = "news-card"

            let tempDiv = document.createElement("div");
            tempDiv.innerHTML = item.snippet;

            let images = tempDiv.getElementsByTagName("img");
            while (images.length > 0) {
                images[0].remove();
            }

            let all_tempDiv = tempDiv.innerHTML

            let date = new Date(item.pubDate).toLocaleString("ru-RU");

            card.innerHTML = `
                <h3 class="news-title"><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${all_tempDiv}</p>
                <div class="news-date">${date}</div>
                <button class="chitat_late">Добавить в список</button>`

            let button = card.querySelector('.chitat_late')
            button.dataset.title = item.title
            button.dataset.link = item.link
            button.dataset.snippet = all_tempDiv
            button.dataset.date = date

            container.appendChild(card)
        })



        let buttons = document.querySelectorAll('.chitat_late')
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                this.classList.toggle('added')

                if (this.classList.contains('added')) {
                    this.textContent = 'Добавлено в избранное'

                    let savedNews = JSON.parse(localStorage.getItem('savedNews')) || []

                    let newNews = {
                        title: this.dataset.title,
                        link: this.dataset.link,
                        snippet: this.dataset.snippet,
                        date: this.dataset.date
                    }

                    savedNews.push(newNews)
                    localStorage.setItem('savedNews', JSON.stringify(savedNews))


                } else {
                    this.textContent = 'Добавить в список'

                    let savedNews = JSON.parse(localStorage.getItem('savedNews')) || [];
                    savedNews = savedNews.filter(n => n.link !== this.dataset.link);
                    localStorage.setItem('savedNews', JSON.stringify(savedNews))
                }
            })
        })


        let searchInput = document.getElementById('search-input')
        searchInput.addEventListener("input", function () {
            let poisk = this.value.toLowerCase().trim()
            let cards = document.querySelectorAll('.news-card')

            cards.forEach(card => {
                let title = card.querySelector('.news-title').textContent.toLowerCase()

                let button = card.querySelector('.chitat_late')
                let snippet = button.dataset.snippet.toLowerCase()

                let tempDiv = document.createElement('div')
                tempDiv.innerHTML = snippet
                let snippetText = tempDiv.textContent.toLowerCase()

                if (title.includes(poisk) || snippetText.includes(poisk)) {
                    card.classList.remove('hidden')
                } else {
                    card.classList.add('hidden')
                }
            })
        })
    })
    .catch(error => {
        document.getElementById('container').innerHTML = '<div class="loading">Ошибка загрузки новостей. Убедитесь, что сервер запущен.</div>'
        console.error(error)
    })


