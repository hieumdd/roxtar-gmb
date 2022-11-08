import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { load } from '../../bigquery/bigquery.service';
import { getAuthClient } from '../auth/auth.service';
import { getLocations } from '../location/location.service';
import { DailyMetric, getInsights } from '../insight/insight.service';
import { getReviews } from '../review/review.service';
import { locationSchema, insightSchema, reviewSchema } from './pipeline.schema';

dayjs.extend(utc);

type PipelineOptions = {
    start?: string;
    end?: string;
};

const parseDateRange = ({ start, end }: PipelineOptions) => [
    start ? dayjs.utc(start) : dayjs.utc().subtract(1, 'year'),
    end ? dayjs.utc(end) : dayjs.utc(),
];

export const pipeline = async (options: PipelineOptions) => {
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

    const reviews = await Promise.all(
        locations.map((location) =>
            getReviews(client, { accountId, locationId: location.name }),
        ),
    ).then((locationReviews) => locationReviews.flat());

    return Promise.all([
        load(locations, { table: 'Location', schema: locationSchema }),
        load(insights, { table: 'Insight', schema: insightSchema }),
        load(reviews, { table: 'Review', schema: reviewSchema }),
    ]).then(() => ({
        location: locations.length,
        insight: insights.length,
        review: reviews.length,
    }));
};
