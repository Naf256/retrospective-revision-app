/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/ban-types
export const tokenExtractor = (req, _res, next: Function) => {
        const auth = req.get('authorization');

        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            req.token = auth.substring(7);
        } else {
            req.token = null;
        }

	next();

};
