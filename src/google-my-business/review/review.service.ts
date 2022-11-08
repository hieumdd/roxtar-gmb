import { AxiosInstance } from 'axios';

type GetReviewsOptions = {
    accountId: string;
    locationId: string;
};

type Review = Record<string, string>;

type ReviewsResponse = {
    reviews: Review[];
    nextPageToken?: string;
};

export const getReviews = async (
    client: AxiosInstance,
    { accountId, locationId }: GetReviewsOptions,
) => {
    const _get = async (pageToken?: string): Promise<Review[]> => {
        const { reviews, nextPageToken } = await client
            .request<ReviewsResponse>({
                url: `https://mybusiness.googleapis.com/v4/accounts/${accountId}/${locationId}/reviews`,
                params: { pageToken },
            })
            .then((res) => res.data);

        return nextPageToken
            ? [...reviews, ...(await _get(nextPageToken))]
            : reviews;
    };

    return _get().then((rows) =>
        rows.map((row) => ({ ...row, accountId, locationId })),
    );
};
