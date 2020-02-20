const axios = require('axios').default;
const cheerio = require('cheerio');

module.exports = {
    async searchByDate(req, res) {
        const { CheckIn, CheckOut } = req.body;

        try {
            //primeira requisição - recuperar id de sessão (sid)       
            let params = new URLSearchParams();
            params.append('q', '5462');
            params.append('version', 'MyReservation');
            params.append('diff', 'false');
            params.append('CheckIn', CheckIn);
            params.append('CheckOut', CheckOut);
            params.append('Code', ' ');
            params.append('group_code', ' ');
            params.append('loyality_card', ' ');
            params.append('NRooms', '1');
            params.append('ad', '1');
            params.append('ch', '0');
            params.append('ag', '-');
            let resp = await axios.get("https://myreservations.omnibees.com/default.aspx", {params});          


            //segunda requisição - recupera html com informações dos quartos
            const cookies = resp.headers['set-cookie'];
            let aspSession = (cookies[1]+'').split(';');
            aspSession = aspSession[0];

            let sid = (cookies[2]+'').split('=');
            sid = sid[1].replace('; expires', '');
            console.log(`Entrada: ${CheckIn}, Saida: ${CheckOut}, SesId: ${sid}, AspSesi: ${aspSession}`);

            params = new URLSearchParams();
            params.append('ucUrl', 'SearchResultsByRoom')
            params.append('diff', false)
            params.append('CheckIn', CheckIn);
            params.append('CheckOut', CheckOut);
            params.append('Code', '')
            params.append('group_code', '')
            params.append('loyality_card', '')
            params.append('NRooms', 1)
            params.append('ad', 1)
            params.append('ch', 0)
            params.append('ag', '-')
            params.append('q', 5462)
            params.append('sid', sid)

            const headers = {
                cookie: aspSession,
            }
            const url = `https://myreservations.omnibees.com/Handlers/ajaxLoader.ashx`;
            resp = await axios.get(url, {params, headers})





            //modo estático de requisição à segunda api
            // let url = `https://myreservations.omnibees.com/Handlers/ajaxLoader.ashx?ucUrl=SearchResultsByRoom&&diff=false&CheckIn=${CheckIn}&CheckOut=${CheckOut}&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-&q=5462&sid=1b4d1050-a9a6-45f9-93b1-2d385cd32732&rnd=1582237654784`;
            // let resp = await axios.get(url, { headers: { cookie: 'ASP.NET_SessionId=5vaqmrg50bl3sq3bgxyxlnek' } });

            const body = resp.data;
            const $ = cheerio.load(body);
            let statsTable = $('.maintable > tbody > .roomName');

            const returnJson = [];
            statsTable.each(function (index) {
                let name = $(this).find('.excerpt > h5 > a').text();
                let description = $(this).find('.excerpt > p > a').text();

                const prices = [];
                let priceHtml = $(`#jsRoom_${index}`);
                priceHtml.each(function () {
                    let price = $(this).find('.ratePriceTable > tbody > tr > td > a').text();
                    prices.push(price);
                });

                const images = [];
                let imgHtml = $(this).find('.thumb > .roomSlider > div');
                imgHtml.each(function () {
                    let image = 'https://myreservations.omnibees.com/' + $(this).find('.slide > a').prop('href');
                    images.push(image);
                });

                console.log(' -> ', name, description, prices.length, imgHtml.length);

                returnJson.push({
                    name, description, prices, images
                })
            })


            res.status(200).send(returnJson);

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            res.status(500).send({ status: false, response: err });
            console.log(err);
        }
    }
}