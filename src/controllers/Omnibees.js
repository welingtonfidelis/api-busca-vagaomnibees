const axios = require('axios').default;
const cheerio = require('cheerio');

module.exports = {
    async searchByDate(req, res) {
        let { checkin, checkout, adults, childs, rooms, age } = req.body;

        checkin = checkin.replace(/[\/-]/g, '');
        checkout = checkout.replace(/[\/-]/g, '');
        adults = adults ? adults : 1;
        childs = childs ? childs : 0;
        age = age ? age : '-0';
        rooms = rooms ? rooms : 1;

        console.log(`Entrada: ${checkin}, Saida: ${checkout}`);
        console.log(`Qrt: ${rooms}, Adt: ${adults}, Cri: ${childs}, Idad: ${age}`);

        try {
            //Recupera o primeiro html para retirada dos ids de sessão (sid e aspSession)
            let resp = await firstRequest();

            //retira sid e aspSession dos cookies
            const cookies = resp.headers['set-cookie'];
            let aspSession = (cookies[1] + '').split(';');
            aspSession = aspSession[0];

            let sid = (cookies[2] + '').split('=');
            sid = sid[1].replace('; expires', '');

            //Recupera o segundo html para retirada das informações relevantes 
            //ao usuário (tipo de quarto, descrição, preço, imagens)
            resp = await secondRequest(checkin, checkout, adults, childs, age, rooms, sid, aspSession);

            //Constrói json com dados retirados da segunda requisção e devolve ao cliente
            res.status(200).send(createJsonResp(resp.data));

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            res.status(500).send({ status: false, response: err });
            console.log(err);
        }
    }
}

//primeira requisição - recuperar id de sessão (sid e aspSession)       
async function firstRequest() {
    const params = new URLSearchParams();
    params.append('q', '5462');
    const url = "https://myreservations.omnibees.com/default.aspx";
    return await axios.get(url, { params });
}

//segunda requisição - recupera html com informações dos quartos
async function secondRequest(CheckIn, CheckOut, ad, ch, ag, NRooms, sid, aspSession) {
    const params = new URLSearchParams();
    params.append('ucUrl', 'SearchResultsByRoom');
    params.append('diff', false);
    params.append('CheckIn', CheckIn);
    params.append('CheckOut', CheckOut);
    params.append('Code', '');
    params.append('group_code', '');
    params.append('loyality_card', '');
    params.append('NRooms', NRooms);
    params.append('ad', ad);
    params.append('ch', ch);
    params.append('ag', ag);
    params.append('q', 5462)
    params.append('sid', sid);

    const headers = {
        cookie: aspSession,
    }
    const url = "https://myreservations.omnibees.com/Handlers/ajaxLoader.ashx";
    return await axios.get(url, { params, headers });
}

//Buscar no html informações sobre os quartos (tipo, descrição, preço e imagens)
//e construir um json para retornar ao cliente
function createJsonResp(html) {
    const $ = cheerio.load(html);
    const statsTable = $('.maintable > tbody > .roomName');

    const json = [];
    statsTable.each(function (index) {
        const name = $(this).find('.excerpt > h5 > a').text();
        const description = $(this).find('.excerpt > p > a').text();

        const prices = [], priceHtml = $(`#jsRoom_${index}`);
        priceHtml.each(function () {
            const price = $(this).find('.ratePriceTable > tbody > tr > td > a').text();
            prices.push(price);
        });

        const images = [], imgHtml = $(this).find('.thumb > .roomSlider > div');
        imgHtml.each(function () {
            const image = 'https://myreservations.omnibees.com/' + $(this).find('.slide > a').prop('href');
            images.push(image);
        });

        json.push({
            name, description, prices, images
        })
    })

    return json;
}