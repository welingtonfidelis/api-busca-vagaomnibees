const axios = require('axios').default;

module.exports = {
    async searchByDate(req, res) {
        const { CheckIn, CheckOut } = req.body;

        console.log(CheckIn, CheckOut);

        try {
            const params = new URLSearchParams();
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

            const resp = await axios.get("https://myreservations.omnibees.com/default.aspx", {params})
            console.log(resp.data);

            res.status(200).send({status: true,response: resp.data});

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            res.status(500).send({ status: false, response: err });
            console.log(err);
        }
    }
}