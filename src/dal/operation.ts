import DownloadModel, { Download } from '../models/download';
import MerchantKeyModel, { Merchantkey } from '../models/merchantkeys';
import ConfigModel, { Config } from '../models/configs';
import { Document } from 'mongoose';
import { SearchType, optConfig } from '../types/db_search_types'

export async function save(
    data: Download | Config | Merchantkey,
    model: typeof DownloadModel | typeof ConfigModel | typeof MerchantKeyModel
): Promise<Document> {
    const new_doc = new model(data);
    return new_doc.save();
}

export async function find(
    data: object,
    model: any,
    searchType: string,
    projection?: string | string[] | { [key: string]: number },
    options?: optConfig,
): Promise<any> {

    let result: any = {};
    if (searchType === SearchType.ONE) {
        result = await model
            .findOne(data)
            .lean()
            .select(projection || '');
    } else {
        result = await model
            .find(data)
            .lean()
            .limit(options?.limit || 10)
            .skip(options?.skip || 0)
            .select(projection || '')
            .sort(options?.sort || 'createdAt');
    }
    return result;
}

export async function update(
    filter: object,
    data: any,
    model: any
): Promise<any> {
    return await model.findOneAndUpdate(filter, data, { new: true });
}

export async function remove(data: object, model: any): Promise<any> {
    return await model.findOneAndDelete(data);
}


export async function countDocument(data: object, model: any) {
    return await model.where(data).countDocuments();
}