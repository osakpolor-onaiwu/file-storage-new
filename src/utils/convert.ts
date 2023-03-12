import csvtojson from "csvtojson";
import puppeteer from 'puppeteer';
import jsonexport from "jsonexport";
import joi from 'joi';
import { validateSchema } from './validatespec';
import Logger from './Logger';
import throwcustomError from './customerror'

const spec = joi.object({
    from: joi.string().trim(),
    to: joi.string(),
    data_to_convert: joi.any().required()
})

export const convert= async(data:any)=>{

    let converted, flag;
    try {
        const params = validateSchema(spec, data);
        if (params.from && params.from === 'csv') {
            flag = 'json';
            converted = await csvtojson().fromString(params.data_to_convert);
            if (!converted) throw new Error('Data is not a valid CSV');
    
        }else if (params.from && params.from === 'html') {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(params.data_to_convert, { waitUntil: 'domcontentloaded' });
            converted = await page.pdf({ format: params?.options?.pdfFormat || 'A3' });
            if (!converted) throw new Error('error converting data from html to pdf');
            await browser.close();
        }else if(params.from && params.from == 'json') {
            flag = 'csv';
            converted = await jsonexport(params.data_to_convert, { verticalOutput: false });
            if (!converted) throw new Error('Data is not a valid JSON');
        }else {
            converted = params.data_to_convert
        }
        return { converted, flag };
    } catch (error:any) {
        if(error.message.includes('Unable to parse the JSON object')) error.message = 'Data is not a valid JSON';
        Logger.error([error, error.stack, new Date().toJSON()], 'CONVERT-FILE-ERROR');
        throw error;
    }
   
}