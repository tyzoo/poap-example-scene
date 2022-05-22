import { POAPBoothSpawner } from "./POAPSpawner";
/**
 * See ./POAPSpawner.ts for more info.
 */
new POAPBoothSpawner({
	property: "demo-acct",
	api_key: "89f6fe5488c01167a9c237d0f661b85ce19ab71a49b2efafbe8747f70b0c4aa8",
	booths: [
		{
			event_id: 1337,
			transformArgs: {
				position: new Vector3(8,0,8),
			},
		},
	]
});