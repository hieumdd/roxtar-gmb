import axios from 'axios';
import axiosThrottle from 'axios-request-throttle';

import { getSecret } from '../../secret-manager/secret-manager.service';

type TToken = {
    access_token: string;
};

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export const getToken = async () => {
    const [clientId, clientSecret, refreshToken] = await Promise.all(
        [
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'GOOGLE_REFRESH_TOKEN',
        ].map((name) => getSecret(name)),
    );

    return axios
        .request<TToken>({
            method: 'POST',
            url: TOKEN_URL,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: {
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            },
        })
        .then((res) => res.data);
};

export const getAuthClient = async () =>
    getToken().then(({ access_token: token }) => {
        const client = axios.create({
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        axiosThrottle.use(axios, { requestsPerSecond: 8 });

        return client;
    });
