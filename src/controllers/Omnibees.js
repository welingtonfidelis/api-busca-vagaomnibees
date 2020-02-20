const axios = require('axios').default;

module.exports = {
    async searchByDate(req, res) {
        const { CheckIn, CheckOut } = req.body;

        console.log(CheckIn, CheckOut);

        try {                
            let params = new URLSearchParams();
            params.append('q', '5462');
            params.append('version', 'MyReservation');
            params.append('sid', 'b3295dd8-02c3-49c1-b546-c3aadea5495c#/');
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
            let resp = await axios.get("https://myreservations.omnibees.com/default.aspx", {params})


            const now = new Date().getTime();
            const sidPosition = (resp.data).search(/RoomSearch/)
            let infos = (resp.data).substring(sidPosition+11, sidPosition+64);
            infos = infos.replace(/['" ]+/g, '');
            let sid = infos.split(',');
            sid = sid[3]
            // console.log(sid);
            
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
            params.append('rnd', now)
            // const url = `https://myreservations.omnibees.com/Handlers/ajaxLoader.ashx?ucUrl=SearchResultsByRoom&diff=false&CheckIn=28022020&CheckOut=29022020&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-&q=5462&sid=${sid}&rnd=${now}`;
            const url = `https://myreservations.omnibees.com/Handlers/ajaxLoader.ashx`;
            // console.log(url, now);
            
            resp = await axios.get(url, {params})
            console.log(resp);
   
            res.status(200).send(resp.data);

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            res.status(500).send({ status: false, response: err });
            console.log(err);
        }
    }
}