async function upload_product_images_blob(req_files_logo) {
    try {
        console.log("upload_product_images_blob", req_files_logo)
        const buffer = req_files_logo.data;
        const filename = req_files_logo.name;
        const mimetype = req_files_logo.mimetype;
        const blobname = Date.now() + "_" + filename;
        // const stream = Readable.from(buffer);
        // console.log({
        //     "buffer": buffer,
        //     "filename": filename,
        //     "mimetype": mimetype,
        //     "blobname": blobname,
        //     // "stream": stream

        // })
        const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(productImageContainer);
        const blockBlobClient = containerClient.getBlockBlobClient(blobname);
        const upload = await blockBlobClient.uploadStream(buffer, 4 * 1024 * 1024, 20, { blobHTTPHeaders: { blobContentType: mimetype } });
        console.log("Photo uploaded to azure blob storage logs", upload)
        const url = "https://igoportalnodejs.blob.core.windows.net/add-products-images-from-gdrive/" + blobname;
        // console.log(url)
        return { "url": url, "success": true };

    } catch (err) {
        console.log(err)
        return err
    }
}

async function downloadFile(gdriveLink) {
        console.log("GOOGLE DOWNLOAD")
        oauth2Client.setCredentials({ refresh_token: REFREH_TOKEN });
        const service = google.drive({
            version: "v3",
            auth: oauth2Client,
        });
        var fileId = gdriveLink.split("id=")[1];
        try {
            const file = await service.files.get({
                fileId: fileId,
                alt: 'media'
            }, {
                responseType: 'blob',
            });
            // console.log(file)
            const result = file.data
            // console.log(result.stream() )
            const fileinfo = {
                "data": file.data.stream(),
                "name": `${gdriveLink.split("id=")[1]}.jpg`,
                "mimetype": 'image/jpeg'
            }
            var data=await upload_product_images_blob(fileinfo)

            // return file;
        } catch (err) {
            console.log(err)
            throw err;
        }
    console.log("data", data)
    return(data)
}
const gdriveLink = "https://drive.google.com/uc?export=view&id=1qU_vmqFXglDM1rVBFr2QV3WLbGfOasVi" 
downloadFile(gdriveLink)