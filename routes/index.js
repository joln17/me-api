const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const data = {
        data: {
            text: `Jag heter Johnny och bor i den nordväst-skånska lilla staden Ängelholm.
                Till vardags jobbar jag på prisjämförelse­sajten Prisjakt med att ta fram och
                analysera data.

                Vid sidan av jobbet så läser jag just nu kursen [jsramverk](https://jsramverk.me/)
                som ingår i programmet [Webbprogrammering](https://www.bth.se/utbildning/program/distansutbildningar/webbprogrammering/)
                vid Blekinge Tekniska Högskola. I övrigt på min fritid gillar jag att träna, främst
                padel, cykling och löpning.`
        }
    };

    res.json(data);
});

module.exports = router;
