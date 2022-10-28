import axios from 'axios';

import { getToken } from './auth.service';

it('Get Token', async () => {
    return getToken()
        .then((res) => {
            console.log(res.access_token);
            expect(res.access_token).toBeTruthy();
        })
        .catch((err) => {
            axios.isAxiosError(err) && console.log(err.response?.data);
            return Promise.reject(err);
        });
});
