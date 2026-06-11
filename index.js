let e = require('express')
let rss = require('rss-parser')
let cors = require('cors')
let path = require('path')

let app = e()
app.use(cors())
let rss_parser = new rss()
app.use(e.static('view'))

let news_sites = [
    { url: 'https://habr.com/ru/rss/articles/' }
]


async function get_access_to_news() {
    const promises = news_sites.map(async (event) => {
        try {
            let massiv_rss_parser = await rss_parser.parseURL(event.url)

            let items = massiv_rss_parser.items.map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                snippet: item.content || 'Описание отсутствует'
            }))
            return items
        }
        catch (error) {
            console.error("Ничего не загрузилось, сегодня вы без новостей:D")
            console.error("Ошибка:", error.message)
            return []
        }

    })
    const results = await Promise.all(promises);

    return results.flat()
}


app.get('/news', async (req, res) => {
    try {
        const news = await get_access_to_news();
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Не удалось загрузить новости' });
    }
});


app.listen(8080)