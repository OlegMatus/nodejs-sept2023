import { CronJob } from "cron";

const handler = async () => {
  console.log("Test");
};
export const tesCron = new CronJob("* * 5 * *", handler);
