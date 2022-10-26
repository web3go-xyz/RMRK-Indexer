import { RemarkEntity } from "../types";
import { SubstrateExtrinsic } from "@subql/types";
import { getRemarksFrom } from './utils';
import NFTUtils, { hexToString } from './utils/NftUtils';


export async function handleRemark(
  extrinsic: SubstrateExtrinsic
): Promise<void> {
  const records = getRemarksFrom(extrinsic);
  logger.info(`finish getRemarksFrom`);

  if (records) {
    logger.info(`check records.length=${records.length}`);
  }
  //save remark entity
  for (let index = 0; index < records.length; index++) {
    let r = records[index];
    try {
      let interaction = NFTUtils.getAction(hexToString(r.value));
      // logger.info(`finish getAction`);

      let extra = "";
      if (r.extra && r.extra.length > 0) {
        logger.info(`check r.extra.length=${r.extra.length}`);
        extra = JSON.stringify(r.extra || []);
      }
      // logger.info(`finish extra`);
      let specVersion = NFTUtils.getRmrkSpecVersion(hexToString(r.value));
      // logger.info(`finish getRmrkSpecVersion`);

      let d = {
        value: r.value,
        caller: r.caller,
        blockNumber: r.blockNumber,
        timestamp: r.timestamp,
        id: `${r.blockNumber}-${index}`,
        interaction: interaction,
        extra: extra,
        specVersion: specVersion,
        processed: 0,
      };

      let remarkEntity = RemarkEntity.create(d);

      await remarkEntity.save();
      logger.info(`[Saved RMRK Remark] ${remarkEntity.id}`);
    } catch (e) {
      logger.warn(
        `[ERR] Can't save RMRK Remark at block ${r.blockNumber} ${hexToString(r.value)} because \n${e}`
      );
    }
  }

  return;

}
