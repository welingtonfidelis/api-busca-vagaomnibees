const axios = require('axios').default;
const cheerio = require('cheerio');
const crawler = require('crawler');

module.exports = {
    async searchByDate(req, res) {
        const { CheckIn, CheckOut } = req.body;

        console.log(CheckIn, CheckOut);

        try {         
            //primeira requisição - recuperar id de sessão (sid)       
            // let params = new URLSearchParams();
            // params.append('q', '5462');
            // params.append('version', 'MyReservation');
            // // params.append('sid', 'b3295dd8-02c3-49c1-b546-c3aadea5495c#/');
            // params.append('diff', 'false');
            // params.append('CheckIn', CheckIn);
            // params.append('CheckOut', CheckOut);
            // params.append('Code', ' ');
            // params.append('group_code', ' ');
            // params.append('loyality_card', ' ');
            // params.append('NRooms', '1');
            // params.append('ad', '1');
            // params.append('ch', '0');
            // params.append('ag', '-');
            // let resp = await axios.get("https://myreservations.omnibees.com/default.aspx", {params})

            // const now = new Date().getTime();
            // const sidPosition = (resp.data).search(/RoomSearch/)
            // let infos = (resp.data).substring(sidPosition+11, sidPosition+64);
            // infos = infos.replace(/['" ]+/g, '');
            // let sid = infos.split(',');
            // sid = sid[3]

            // const cookies = resp.headers['set-cookie'];
            // let aspSession = (cookies[1]+'').split(';');
            // console.log(sid, aspSession[0]);
            
            
            //segunda requisição - recupera html com informações dos quartos
            // params = new URLSearchParams();
            // params.append('ucUrl', 'SearchResultsByRoom')
            // params.append('diff', false)
            // params.append('CheckIn', CheckIn);
            // params.append('CheckOut', CheckOut);
            // params.append('Code', '')
            // params.append('group_code', '')
            // params.append('loyality_card', '')
            // params.append('NRooms', 1)
            // params.append('ad', 1)
            // params.append('ch', 0)
            // params.append('ag', '-')
            // params.append('q', 5462)
            // params.append('sid', sid)
            // params.append('rnd', now)

            // const headers = {
            //     cookie: aspSession[0],
            // }
            // const url = `https://myreservations.omnibees.com/Handlers/ajaxLoader.ashx`;
            // resp = await axios.get(url, {params, headers})
            

            //modo estático de requisição à segunda api
            let url = `https://myreservations.omnibees.com/Handlers/ajaxLoader.ashx?ucUrl=SearchResultsByRoom&&diff=false&CheckIn=${CheckIn}&CheckOut=${CheckOut}&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-&q=5462&sid=8d0ace22-ae70-4206-9edd-7dce5e18f4f3&rnd=1582221535448`;
            let resp = await axios.get(url, {headers: {cookie: 'ASP.NET_SessionId=i15f3i22zithcpzmo2xbuvbl'}});
                    
            const body = resp.data;
            const $ = cheerio.load(body);
            let statsTable = $('.maintable > tbody > .roomName');
            
            const returnJson = [];
            statsTable.each(function() {
                let name = $(this).find('.excerpt > h5 > a').text();
                let description = $(this).find('.excerpt > p > a').text();
                let price = $(this).find('.sincePrice > div > h6').text();
       
                const images = [];
                let imgHtml = $(this).find('.thumb > .roomSlider > div');
                imgHtml.each(function() {
                    let image = 'https://myreservations.omnibees.com/' + $(this).find('.slide > a').prop('href');
                    images.push(image);
                });
            
                console.log(' -> ', name, description, price, imgHtml.length);
                
                returnJson.push({
                    name, description, images
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