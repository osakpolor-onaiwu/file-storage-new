import QueueModel, { Queue } from '../models/queue';
import { Document } from 'mongoose';
import { SearchType, optConfig} from '../types/db_search_types'

export async function saveQueueItem(data: Queue, model: typeof QueueModel): Promise<Document> {
    const new_QueueItem = new model(data);
    return new_QueueItem.save();
}

export async function findQueueItem(
    data: object,
    model: typeof QueueModel,
    searchType: string,
    projection?: string | string[] | { [key: string]: number },
    options?: optConfig,
) {
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

export async function updateQueueItem(filter: object, data: any, model: typeof QueueModel): Promise<any> {
    return await model.findOneAndUpdate(filter, data, { new: true });
}

export async function deleteQueueItem(data: object, model: typeof QueueModel): Promise<any> {
    return await model.findOneAndDelete(data);
}


export async function countDocument(data: object, model: any) {
    return await model.where(data).countDocuments();
}