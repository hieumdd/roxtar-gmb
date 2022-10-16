import { AxiosInstance } from 'axios';
import dayjs from 'dayjs';

import { getAuthClient } from '../auth/auth.service';
import { DailyMetric, getInsights } from './insight.service';

const dailyMetricCases = Object.values(DailyMetric).map((metric) => [
    metric,
]) as DailyMetric[][];

describe('Insight', () => {
    let client: AxiosInstance;
    const locationId = `1118203103520952847`;

    beforeAll(async () => {
        client = await getAuthClient();
    });

    it.each(dailyMetricCases)('Get Insights %s', async (dailyMetric) => {
        const start = dayjs('2022-09-01');
        const end = dayjs('2022-10-01');

        return getInsights(client, { locationId, dailyMetric, start, end })
            .then((insights) => {
                console.log(insights);
                insights.forEach((insight) => {
                    expect(insight.location_id).toBe(locationId);
                    expect(insight.metric).toBe(dailyMetric);
                    expect(insight.date).toBeTruthy();
                });
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    });
});
