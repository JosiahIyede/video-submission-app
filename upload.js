async function uploadVideo() {
  const file = document.getElementById("videoFile").files[0];
  const progressBar = document.getElementById("progressBar");
  const statusText = document.getElementById("statusText");
  const videoPreview = document.getElementById("videoPreview");

  if (!file) return (statusText.textContent = "Please select a file.");

  const allowedTypes = ["video/mp4", "video/avi", "video/quicktime"];
  if (!allowedTypes.includes(file.type)) {
    return (statusText.textContent = "Allowed formats: .mp4, .avi, .mov");
  }

  if (file.size > 200 * 1024 * 1024) {
    return (statusText.textContent = "Max file size is 200MB.");
  }

  const blobName = encodeURIComponent(file.name);
  const sasToken = "sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-07-31T21:27:49Z&st=2025-06-21T13:27:49Z&spr=https&sig=5oEEB8z659yKQ8ekBqVz3x29ZsV1NxABbshvIq18bqI%3D";
  const uploadUrl = `https://hrvideos.blob.core.windows.net/vdeos/${blobName}?${sasToken}`;

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", uploadUrl, true);
  xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = percent + "%";
    }
  };

  xhr.onload = () => {
    if (xhr.status === 201) {
      statusText.textContent = "✅ Upload successful!";
      videoPreview.src = uploadUrl.split("?")[0];
      videoPreview.style.display = "block";
    } else {
      statusText.textContent = "❌ Upload failed. Check your SAS token.";
    }
  };

  xhr.onerror = () => {
    statusText.textContent = "❌ Network or server error during upload.";
  };

  xhr.send(file);
}
