import { AxiosInstance } from 'axios';

import { getAuthClient } from '../auth/auth.service';
import { getReviews } from './review.service';

describe('Review', () => {
    let client: AxiosInstance;
    const accountId = `102502012296490759042`;
    const locationId = `1118203103520952847`;

    beforeAll(async () => {
        client = await getAuthClient();
    });

    it('Get Reviews', async () => {
        return getReviews(client, { accountId, locationId })
            .then((reviews) => {
                console.log(reviews);
                reviews.forEach((review) => {
                    expect(review).toBeTruthy();
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
});
