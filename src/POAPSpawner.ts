import { AlertSystem, POAPBooth } from 'zootools';
import { getCurrentRealm, Realm } from '@decentraland/EnvironmentAPI';
import { getUserData, UserData } from '@decentraland/Identity';
import { signedFetch } from '@decentraland/SignedFetch';

/**
 *  NOTE:

	Ensure your project has the appropriate dependencies..run:

		npm install -b dcldash@latest zootools@latest 

	Bring in the ./poap_assets/ folder into your projects root directory
	
	Also, reference the tsconfig.json in this file compared to your own
 */

/**
 * Alert system to display feedback
 */
export const alertSystem = new AlertSystem();

/**
 * Class to handle creation of POAP booths
 */
export class POAPBoothSpawner {
	private userData!: UserData | null;
	private realm: Realm | undefined;
	private booth_number: number = 0;
	constructor(private props: {
		property: string,
		api_key: string,
		booths: {
			event_id: number,
			transformArgs: TranformConstructorArgs,
		}[]
	}){
		executeTask(async () => {
			//If you ALSO use these user data functions elsewhere in your app
			//you may need to refactor to only use them once time each.
			// i.e. if you receive error, "cannot read property getUserData of undefined..etc"
			this.userData = await getUserData();
			this.realm = await getCurrentRealm();
			this.props.booths.forEach(booth=> {
				this.spawn(
					booth.event_id, 
					booth.transformArgs,
				);
			})
		})
	}
	private spawn(
		event_id: number,
		transformArgs: TranformConstructorArgs,
		wrapTexturePath: string = "poap_assets/images/wrap1.png"
	): POAPBooth {
		const booth = new POAPBooth({
				transformArgs,
				wrapTexturePath
			},
			{
				event_id,
				booth_number: this.booth_number,
				property: this.props.property,
				api_key: this.props.api_key,
				userData: this.userData!,
				realm: this.realm!,
			},
			alertSystem,
			signedFetch,
		);
		engine.addEntity(booth);
		this.booth_number++;
		onRealmChangedObservable.add(async () => {
			const realm = await getCurrentRealm();
			if(!realm) return;
			booth.setRealm(realm);
		})
		return booth;
	}
}