import { AxiosInstance } from 'axios';

type TGetLocationOptions = {
    accountId: string;
};

type TLocation = {
    name: string;
    title: string;
};

type TLocationResponse = {
    nextPageToken?: string;
    locations: TLocation[];
};

export const getLocations = (
    client: AxiosInstance,
    { accountId }: TGetLocationOptions,
) => {
    const get = async (pageToken?: string): Promise<TLocation[]> => {
        const { data } = await client.request<TLocationResponse>({
            url: `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
            params: {
                readMask: ['name', 'title'].join(','),
                pageSize: 100,
                pageToken,
            },
        });
        const { nextPageToken, locations } = data;

        return nextPageToken
            ? [...locations, ...(await get(nextPageToken))]
            : locations;
    };

    return get();
};
