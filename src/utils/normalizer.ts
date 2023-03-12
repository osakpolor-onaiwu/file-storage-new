export const normalizer = {
    
    uploads:(data:any)=>{
        return {
            id: data._id,
            account_id:data.accountid,
            file_name:data.file,
            file_url:data.url,
            key:data.key,
            type:data.type,
            date_created:data.createdAt
        }
    
    }
}