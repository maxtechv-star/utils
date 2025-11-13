const MAX_FILE_SIZE_MB = 200;
async function uploadMedia(buffer) {
  try {

    const fileType = await import('file-type');
    const { ext } = await fileType.default.fromBuffer(buffer);  
    
    const FormData = (await import('form-data')).default;
    
    const fetch = (await import('node-fetch')).default;

    const bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, "file." + ext);
    bodyForm.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: bodyForm,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}: ${res.statusText}`);
    }

    const data = await res.text();
    return data;
  } catch (error) {
    console.error("Error during media upload:", error);
    throw new Error('Failed to upload media');
  }
}

async function handleMediaUpload(quoted, Cyber, mime) {

  if (!quoted || !mime) {
    throw new Error('No valid media to upload!');
  }

  try {

    const media = await Cyber.downloadAndSaveMediaMessage(quoted);

    const fs = await import('fs');
    
    const buffer = fs.readFileSync(media);

   
    const fileSizeMB = buffer.length / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      fs.unlinkSync(media); 
      return `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`;
    }

    const mediaUrl = await uploadMedia(buffer);

    fs.unlinkSync(media);

    return mediaUrl;
  } catch (error) {
    console.error('Error handling media upload:', error);
    throw new Error('Failed to handle media upload');
  }
}

module.exports = {
  uploadMedia,
  handleMediaUpload,
};