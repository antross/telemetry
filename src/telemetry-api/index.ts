import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import { sendPendingData, trackEvent } from '../common/analytics';

export const run: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    context.log('Processing telemetry log request');

    if (!req.body || !req.body.data) {
        context.res = {
            body: 'Invalid request',
            status: 400
        };
    }

    try {
        for (const telemetry of req.body.data) {
            trackEvent(telemetry.name, telemetry.properties);
        }

        await sendPendingData();

        context.res = {
            body: 'Request completed successfully',
            status: 200
        };
    } catch (err) {
        context.res = {
            body: 'Error logging telemetry',
            status: 500
        };
        throw err;
    }

    context.done();
};