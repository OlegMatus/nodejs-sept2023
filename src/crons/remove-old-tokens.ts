import { CronJob } from "cron";

import { TimeHelper } from "../helpers/time.helper";
import { tokenRepository } from "../repositiries/token.repository";

const handler = async () => {
  try {
    console.log("[START CRON] Remove old tokens");
    await tokenRepository.deleteByParams({
      createdAt: { $lte: TimeHelper.subtractByParams(8, "days") },
    });
  } catch (e) {
    console.error("removeOldTokens", e);
  } finally {
    console.log("[END CRON] Remove old tokens");
  }
};

export const removeOldTokens = new CronJob("* * 4 * * *", handler);
