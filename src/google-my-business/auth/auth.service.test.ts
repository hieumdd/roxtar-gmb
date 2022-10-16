import { getToken } from './auth.service';

it('Get Token', async () => {
    return getToken().then((res) => {
        console.log(res);
        expect(res.access_token).toBeTruthy();
    });
});
