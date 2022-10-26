import { RemarkEntity } from "../types";
import { SubstrateExtrinsic } from "@subql/types";
import { getRemarksFrom } from './utils';
import NFTUtils, { hexToString } from './utils/NftUtils';


export async function handleRemark(extrinsic: SubstrateExtrinsic): Promise<void> {
  const records = getRemarksFrom(extrinsic);
  logger.info(`finish getRemarksFrom`);

  //save remark entity
  let remarkEntities: RemarkEntity[] = [];
  for (let index = 0; index < records.length; index++) {
    const r = records[index];
    let interaction = NFTUtils.getAction(hexToString(r.value));
    logger.info(`finish getAction`);
    let extra = JSON.stringify(r.extra || []);
    logger.info(`finish extra`);
    let specVersion = NFTUtils.getRmrkSpecVersion(hexToString(r.value));
    logger.info(`finish getRmrkSpecVersion`);

    let d = {
      ...r,
      id: `${r.blockNumber}-${index}`,
      interaction: interaction,
      extra: extra,
      specVersion: specVersion,
      processed: 0
    };

    remarkEntities.push(RemarkEntity.create(d));
  }

  logger.info(`start save remarkEntity`);
  for (const remarkEntity of remarkEntities) {
    try {
      await remarkEntity.save();
      logger.info(`[Saved RMRK Remark] ${remarkEntity.id}`);
    } catch (e) {
      logger.warn(`[ERR] Can't save RMRK Remark at block ${remarkEntity.blockNumber} because \n${e}`);
    }
  }

  return;


}




