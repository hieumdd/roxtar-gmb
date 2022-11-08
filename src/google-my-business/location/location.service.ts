import { AxiosInstance } from 'axios';

type GetLocationsOptions = {
    accountId: string;
};

type Location = {
    name: string;
    title: string;
};

type LocationsResponse = {
    nextPageToken?: string;
    locations: Location[];
};

export const getLocations = (
    client: AxiosInstance,
    { accountId }: GetLocationsOptions,
) => {
    const get = async (pageToken?: string): Promise<Location[]> => {
        const { data } = await client.request<LocationsResponse>({
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
