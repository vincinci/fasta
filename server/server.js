const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const momoConfig = {
    apiKey: 'your_api_key',
    userId: 'your_user_id',
    primaryKey: 'your_primary_key',
    callbackUrl: 'your_callback_url',
    baseUrl: 'https://sandbox.momodeveloper.mtn.com/collection/v1_0'
};

// Get API user key (execute once)
app.post('/get-api-user', async (req, res) => {
    try {
        const response = await axios.post(`${momoConfig.baseUrl}/apiuser`, {
            providerCallbackHost: momoConfig.callbackUrl
        }, {
            headers: {
                'Ocp-Apim-Subscription-Key': momoConfig.apiKey
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Get API key (execute once)
app.post('/get-api-key', async (req, res) => {
    try {
        const response = await axios.post(`${momoConfig.baseUrl}/apiuser/${momoConfig.userId}/apikey`, {}, {
            headers: {
                'Ocp-Apim-Subscription-Key': momoConfig.apiKey
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Request to pay
app.post('/pay', async (req, res) => {
    const { amount, currency, externalId, payer, payerMessage, payeeNote } = req.body;
    try {
        const response = await axios.post(`${momoConfig.baseUrl}/requesttopay`, {
            amount,
            currency,
            externalId,
            payer,
            payerMessage,
            payeeNote
        }, {
            headers: {
                'X-Reference-Id': externalId,
                'X-Target-Environment': 'sandbox',
                'Ocp-Apim-Subscription-Key': momoConfig.apiKey,
                'Authorization': `Bearer ${momoConfig.primaryKey}`,
                'Content-Type': 'application/json'
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

// Check payment status
app.get('/pay-status/:id', async (req, res) => {
    try {
        const response = await axios.get(`${momoConfig.baseUrl}/requesttopay/${req.params.id}`, {
            headers: {
                'Ocp-Apim-Subscription-Key': momoConfig.apiKey,
                'Authorization': `Bearer ${momoConfig.primaryKey}`,
                'X-Target-Environment': 'sandbox'
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.response.data);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
