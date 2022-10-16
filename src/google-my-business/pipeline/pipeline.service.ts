import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'

import { load } from '../../bigquery/bigquery.service';
import { getAuthClient } from '../auth/auth.service';
import { getLocations } from '../location/location.service';
import { DailyMetric, getInsights } from '../insight/insight.service';
import { locationSchema, insightSchema } from './pipeline.schema';

dayjs.extend(utc);

type TPipelineOptions = {
    start?: string;
    end?: string;
};

const parseDateRange = ({ start, end }: TPipelineOptions) => [
    start ? dayjs.utc(start) : dayjs.utc().subtract(1, 'year'),
    end ? dayjs.utc(end) : dayjs.utc(),
];

export const pipeline = async (options: TPipelineOptions) => {
    const accountId = '102502012296490759042';
    const [start, end] = parseDateRange(options);

    const client = await getAuthClient();

    const locations = await getLocations(client, { accountId });

    const insights = await Promise.all(
        locations.flatMap(({ name }) =>
            Object.values(DailyMetric).flatMap((dailyMetric) => {
                const [_, locationId] = name.split('/');
                return getInsights(client, {
                    locationId,
                    dailyMetric,
                    start,
                    end,
                });
            }),
        ),
    ).then((data) => data.flat());

    return Promise.all([
        load(locations, { table: 'Location', schema: locationSchema }),
        load(insights, { table: 'Insight', schema: insightSchema }),
    ]).then(() => ({ location: locations.length, insight: insights.length }));
};
