
export let makeAFileAndDowlnload = (base64String,filename='export_data')=>{
  let binaryString = atob(base64String);
  let uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([uint8Array]);

  let downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename +".blob.type";
  downloadLink.click();
}
