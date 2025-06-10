import { initUserContext } from '$lib/store';
import { me } from '$lib/fixture/member';

function WidthUser(story: () => any) {
	initUserContext(me);

	return story();
}

export default WidthUser;
