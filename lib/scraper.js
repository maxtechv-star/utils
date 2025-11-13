const randomarray = async (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

async function wallpaper(title, page = '1') {
    try {
        const axios = await import('axios');
        const cheerio = await import('cheerio');
        
        const { data } = await axios.default.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`);
        const $ = cheerio.default.load(data);
        let hasil = [];
        
        $('div.grid-item').each(function (a, b) {
            hasil.push({
                title: $(b).find('div.info > a > h3').text(),
                type: $(b).find('div.info > a:nth-child(2)').text(),
                source: 'https://www.besthdwallpaper.com/' + $(b).find('div > a:nth-child(3)').attr('href'),
                image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]
            });
        });
        
        return hasil;
    } catch (error) {
        throw new Error(`Wallpaper search failed: ${error.message}`);
    }
}

async function wikimedia(title) {
    try {
        const axios = await import('axios');
        const cheerio = await import('cheerio');
        
        const res = await axios.default.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`);
        const $ = cheerio.default.load(res.data);
        let hasil = [];
        
        $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
            hasil.push({
                title: $(b).find('img').attr('alt'),
                source: $(b).attr('href'),
                image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src')
            });
        });
        
        return hasil;
    } catch (error) {
        throw new Error(`Wikimedia search failed: ${error.message}`);
    }
}

async function ringtone(title) {
    try {
        const axios = await import('axios');
        const cheerio = await import('cheerio');
        
        const get = await axios.default.get('https://meloboom.com/en/search/' + title);
        const $ = cheerio.default.load(get.data);
        let hasil = [];
        
        $('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (a, b) {
            hasil.push({ 
                title: $(b).find('h4').text(), 
                source: 'https://meloboom.com/' + $(b).find('a').attr('href'), 
                audio: $(b).find('audio').attr('src') 
            });
        });
        
        return hasil;
    } catch (error) {
        throw new Error(`Ringtone search failed: ${error.message}`);
    }
}

async function styletext(teks) {
    try {
        const axios = await import('axios');
        const cheerio = await import('cheerio');
        
        const { data } = await axios.default.get('http://qaz.wtf/u/convert.cgi?text=' + teks);
        const $ = cheerio.default.load(data);
        let hasil = [];
        
        $('table > tbody > tr').each(function (a, b) {
            hasil.push({ 
                name: $(b).find('td:nth-child(1) > span').text(), 
                result: $(b).find('td:nth-child(2)').text().trim() 
            });
        });
        
        return hasil;
    } catch (error) {
        throw new Error(`Style text conversion failed: ${error.message}`);
    }
}

module.exports = { wallpaper, wikimedia, ringtone, styletext,
randomarray 
};