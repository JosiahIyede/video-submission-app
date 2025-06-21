async function uploadVideo() {
  const file = document.getElementById("videoFile").files[0];
  const progressFill = document.getElementById("progressFill");
  const statusText = document.getElementById("statusText");
  const videoPreview = document.getElementById("videoPreview");

  if (!file) return (statusText.textContent = "Please select a file.");
  if (!["video/mp4", "video/avi", "video/quicktime"].includes(file.type)) {
    return (statusText.textContent = "Allowed formats: .mp4, .avi, .mov");
  }
  if (file.size > 200 * 1024 * 1024) {
    return (statusText.textContent = "Max file size is 200MB.");
  }

  const blobName = encodeURIComponent("Videos/" + file.name);
  const sasToken = "sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacuptfx&se=2025-07-31T20:38:05Z&st=2025-06-21T12:38:05Z&sip=0.0.0.0&spr=https&sig=9qh7TxwQ0SBjTu8Gyjx2qRKUgslWimu%2FH7HGPmTPnog%3D";
  const uploadUrl = `https://hrvideos.blob.core.windows.net/vdeos/${blobName}?${sasToken}`;

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", uploadUrl, true);
  xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressFill.style.width = percent + "%";
      progressFill.textContent = Math.round(percent) + "%";
    }
  };

  xhr.onload = () => {
    statusText.textContent = xhr.status === 201 ? "Upload successful!" : "Upload failed.";
    if (xhr.status === 201) {
      videoPreview.src = uploadUrl.split("?")[0];
      videoPreview.style.display = "block";
    }
  };

  xhr.onerror = () => {
    statusText.textContent = "Error during upload.";
  };

  xhr.send(file);
}
