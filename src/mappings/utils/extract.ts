import { Call as TCall } from "@polkadot/types/interfaces";
import { EventRecord } from '@polkadot/types/interfaces';
import { SubstrateExtrinsic } from "@subql/types";
const PREFIXES = ['0x726d726b', '0x524d524b']
// import { encodeAddress } from "@polkadot/util-crypto";

export type ExtraCall = {
  section: string;
  method: string;
  args: string[];
}

export interface RemarkResult {
  value: string;
  caller: string;
  blockNumber: string;
  timestamp: Date;
  extra?: ExtraCall[];
}

export interface RemarkResultEntity extends RemarkResult {
  id: string;
}

export const isSystemRemark = (call: TCall, prefixes: string[] = PREFIXES): boolean =>
  call.section === "system" &&
  call.method === "remark" &&
  (prefixes.length < 1 ||
    prefixes.some((word) => call.args.toString().startsWith(word)));

export const isUtilityBatch = (call: TCall) =>
  call.section === "utility" &&
  (call.method === "batch" || call.method === "batchAll");

  export const isBatchInterrupted = (
    records: EventRecord[],
    extrinsicIndex?: number
  ): boolean => {
    const events = records.filter(
      ({ phase, event }) =>
        phase.isApplyExtrinsic &&
        // phase.asApplyExtrinsic.eq(extrinsicIndex) &&
        (event.method.toString() === "BatchInterrupted" ||
          event.method.toString() === "ExtrinsicFailed")
    );
  
    return Boolean(events.length);
  };

export const getRemarksFrom = (extrinsic: SubstrateExtrinsic): RemarkResult[] => {
  if (!extrinsic.success) {
    return []
  }

  const signer = extrinsic.extrinsic.signer.toString();
  const blockNumber = extrinsic.block.block.header.number.toString()
  const timestamp = extrinsic.block.timestamp;

  if (isSystemRemark(extrinsic.extrinsic.method as TCall)) {
    return [{
      value: extrinsic.extrinsic.args.toString(),
      caller: signer,
      blockNumber,
      timestamp
    }]
  }

  if (isUtilityBatch(extrinsic.extrinsic.method as TCall)) {
    if (isBatchInterrupted(extrinsic.events)) {
      return [];
    }

    return processBatch(extrinsic.extrinsic.method.args[0] as unknown as TCall[], signer, blockNumber, timestamp)
  }

  return [];
}

const RUN_ON_SUBQUERY_HOST: boolean = true;

export const processBatch = (calls: TCall[], caller: string, blockNumber: string, timestamp: Date): RemarkResult[] => {
  let extra: ExtraCall[] = [];
  let results:RemarkResult[]=[];
 
  for (const call of calls) {
    if (isSystemRemark(call)) {      
     results.push({ value: call.args.toString(), caller, blockNumber, timestamp, extra });
    } else {
      if (extra && extra.length > 100 && RUN_ON_SUBQUERY_HOST === true) {
        logger.warn(
          `extra is too large over 100 records, just take 100 records when RUN_ON_SUBQUERY_HOST==true`
        ); 
      }else{
        extra.push({ section: call.section, method: call.method, args: call.args.toString().split(',') });
      } 
    }
  }
  for (const r of results) {
    r.extra=extra; 
  }
  return results;
  
}
