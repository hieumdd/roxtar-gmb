import axios from 'axios';

import { pipeline } from './pipeline.service';

const pipelineCases: [string, [string, string] | [undefined, undefined]][] = [
    // ['auto', [undefined, undefined]],
    ['manual', ['2022-01-01', '2023-01-01']],
];

describe('Pipeline', () => {
    it.each(pipelineCases)('Service %p', async (mode, [start, end]) => {
        return pipeline({ start, end })
            .then((insights) => {
                console.log(insights);
                expect(insights.insight).toBeGreaterThan(0);
            })
            .catch((err) => {
                axios.isAxiosError(err) && console.log(err.response?.data);
                return Promise.reject(err);
            });
    });
});
