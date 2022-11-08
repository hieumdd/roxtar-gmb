import axios, { AxiosInstance } from 'axios';
import dayjs, { Dayjs } from 'dayjs';

export enum DailyMetric {
    // DAILY_METRIC_UNKNOWN = 'DAILY_METRIC_UNKNOWN',

    BUSINESS_IMPRESSIONS_DESKTOP_MAPS = 'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
    BUSINESS_IMPRESSIONS_DESKTOP_SEARCH = 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
    BUSINESS_IMPRESSIONS_MOBILE_MAPS = 'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
    BUSINESS_IMPRESSIONS_MOBILE_SEARCH = 'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
    BUSINESS_CONVERSATIONS = 'BUSINESS_CONVERSATIONS',
    BUSINESS_DIRECTION_REQUESTS = 'BUSINESS_DIRECTION_REQUESTS',
    CALL_CLICKS = 'CALL_CLICKS',
    WEBSITE_CLICKS = 'WEBSITE_CLICKS',
    BUSINESS_BOOKINGS = 'BUSINESS_BOOKINGS',
    BUSINESS_FOOD_ORDERS = 'BUSINESS_FOOD_ORDERS',
}

type GetInsightsOptions = {
    locationId: string;
    dailyMetric: DailyMetric;
    start: Dayjs;
    end: Dayjs;
};

type InsightsResponse = {
    timeSeries: {
        datedValues: {
            date: {
                year: number;
                month: number;
                day: number;
            };
            value: string;
        }[];
    };
};

export const getInsights = (
    client: AxiosInstance,
    { locationId, dailyMetric, start, end }: GetInsightsOptions,
) =>
    client
        .request<InsightsResponse>({
            url: `https://businessprofileperformance.googleapis.com/v1/locations/${locationId}:getDailyMetricsTimeSeries`,
            params: {
                dailyMetric,
                'dailyRange.start_date.year': start.year(),
                'dailyRange.start_date.month': start.month() + 1,
                'dailyRange.start_date.day': start.date(),
                'dailyRange.end_date.year': end.year(),
                'dailyRange.end_date.month': end.month() + 1,
                'dailyRange.end_date.day': end.date(),
            },
        })
        .then((res) => res.data)
        .then((data) =>
            data.timeSeries.datedValues.map(({ date, value }) => ({
                location_id: locationId,
                metric: dailyMetric,
                date: dayjs()
                    .year(date.year)
                    .month(date.month - 1)
                    .date(date.day)
                    .format('YYYY-MM-DD'),
                value,
            })),
        )
        .catch((err) => {
            if (axios.isAxiosError(err) && err.response?.status === 403) {
                console.log(JSON.stringify({ locationId, dailyMetric }));
                return [];
            }

            return Promise.reject(err);
        });
