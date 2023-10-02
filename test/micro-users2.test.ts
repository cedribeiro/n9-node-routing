import { end, init, urlPrefix } from './fixtures/helper.js';
import { User } from './fixtures/micro-users/models/users.models.js';

const microUsersFolder = 'micro-users';

const context: { user?: User; session?: string } = {};

describe('Test jest', () => {
	it('check simple esm', async () => {
		const { prometheusServer, server, httpClient } = await init(microUsersFolder);
		const userCreated = await httpClient.post<User>([urlPrefix, 'users'], {
			firstName: 'Neo',
			lastName: 'Nine',
			email: 'neo@neo9.fr',
			password: 'password-long',
		});

		expect(userCreated.firstName).toBe('Neo');
		expect(userCreated.lastName).toBe('Nine');
		expect(userCreated.email).toBe('neo@neo9.fr');
		expect(userCreated.password).toBeFalsy();

		// Add to context
		context.user = userCreated;
		context.session = JSON.stringify({
			userId: userCreated._id,
		});
		await end(server, prometheusServer);
	});
});
