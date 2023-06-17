const cheerio = require('cheerio');
const axios = require('axios').default;

const results = {}

const encyclopediaContentRoutes = ['SUCCULENTS', 'CACTI', 'BULBS']

const getEncyclopediaByContentRoute = async (encyclopediaPageRoute) => {
    console.log('scraping route: ', encyclopediaPageRoute)
    const response = await axios.get(`http://www.llifle.com/Encyclopedia/${encyclopediaPageRoute}/content`)
    return response
}

const getEncyclopediaByRoute = async (route) => {
    console.log('scraping route: ', route)
    const response = await axios.get(`http://www.llifle.com${route}`)
    return response
}

const loadSpeciesList = async () => {
    const response = await axios.post(`http://www.llifle.com/interactive/load_species_list`, {
        genus: "",
        Selected_Category: "7",
        Encyclopedia: "Cacti"
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': 'Llifle=6sbtpo0af6a0nitoo7n4jfk3p4; cookieconsent_status=dismiss',
        }
    })
    return response
}

const scrapeEncyclopediaSpecies = async (encyclopediaPageRoute) => {
    const speciesResults = []
    // const speciesData = await getEncyclopediaByRoute(encyclopediaPageRoute)
    // const $ = cheerio.load(speciesData.data);

    // console.log($.html())

    // $('#species_list_ul li').each((index, value) => {
    //     const title = $(value).find('a').attr('title')
    //     const linkUrl = $(value).find('a').attr('href')
    //     const imgUrl = $(value).find('img').attr('src')
    //     // TODO: seems like i can replace /thumbnail with /photos
    //     speciesResults.push({ title, linkUrl, imgUrl })
    // })

    const speciesData2 = await loadSpeciesList()

    console.log('speciesData2', speciesData2)

    return speciesResults
}

const scrapeEncyclopediaContent = async (encyclopediaPageRoute) => {
    results[encyclopediaPageRoute] = {
        categories: []
    }
    const encyclopediaData = await getEncyclopediaByContentRoute(encyclopediaPageRoute)
    const $ = cheerio.load(encyclopediaData.data);

    // loop over list item and extract link text and link url
    $('#generic_main ul li').each((index, value) => {
        const linkText = $(value).find('a').text()
        const linkUrl = $(value).find('a').attr('href')
        console.log({ [linkText]: linkUrl })
        results[encyclopediaPageRoute]['categories'][linkText] = {
            route: linkUrl
        }
    })

    // Object.keys(results[encyclopediaPageRoute]['categories']).map(async (key) => {
    //     const route = results[encyclopediaPageRoute]['categories'][key].route
    //     const speciesResults = await scrapeEncyclopediaSpecies(route)
    //     console.log('speciesResults',)
    // })

    console.log('results', JSON.stringify(results))
}

// scrapeEncyclopediaContent(encyclopediaContentRoutes[0])
// scrapeEncyclopediaContent(encyclopediaContentRoutes[1])
// scrapeEncyclopediaContent(encyclopediaContentRoutes[2])

scrapeEncyclopediaSpecies('/Encyclopedia/BULBS/Species/Variegated/')