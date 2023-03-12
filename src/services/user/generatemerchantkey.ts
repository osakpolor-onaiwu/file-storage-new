import { User } from "../../models/user";
import { save } from "../../dal/operation";
import MerchantKeyModel from '../../models/merchantkeys';
import throwcustomError from '../../utils/customerror';
import { validateSchema } from '../../utils/validatespec';
import joi from 'joi';
import md5 from 'md5';

const spec = joi.object({
    account_id: joi.string().required(),
    keyname: joi.string().required(),
})

export default async function Merchantkey(data: object) {

    try {
        const params = validateSchema(spec, data);
        const prefix = process.env.ENVIRONMENT !== 'production' ? "_TEST-" : "-";
        params.uuid = "FS00" + md5(params.account_id + '%$' + Date.now()) + "VE";
        params.public_key = "FS_PUBK" + prefix + md5(params.account_id + 'JP904' + new Date().getTime()) + "-X";
        params.secret_key = "FS_SECK" + prefix + md5(params.account_id + 'JQ904' + new Date().getTime()) + "-X";
        params.keyname = params.keyname || "FS-KEY-" + md5(Date.now() + " %0%");

        const savekey = save({
            keyname: params.keyname,
            uuid: params.uuid,
            secret_key: params.secret_key,
            public_key: params.public_key,
            account_id:params.account_id
        }, MerchantKeyModel)
        return savekey
    } catch (error: any) {
        throwcustomError(error.message);
    }
}
