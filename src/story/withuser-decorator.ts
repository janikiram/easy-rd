import { initUserContext } from '$lib/store';
import { me } from '$lib/fixture/member';

function WidthUser(story: () => JSX.Element) {
	initUserContext(me);

	return story();
}

export default WidthUser;
