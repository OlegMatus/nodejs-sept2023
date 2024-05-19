import { removeOldTokens } from "./remove-old-tokens";
import { tesCron } from "./test.cron";

export const runCronJobs = () => {
  tesCron.start();
  removeOldTokens.start();
};
