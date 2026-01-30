/**
 * Helpers pour la gestion des fichiers
 * Upload, download, conversion, validation
 */

/**
 * Valider un fichier PDF
 */
export function validatePDF(file) {
  const maxSize = 2 * 1024 * 1024; // 2 Mo

  if (!file) {
    throw new Error('Aucun fichier sélectionné');
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Seuls les fichiers PDF sont acceptés');
  }

  if (file.size > maxSize) {
    throw new Error('Le fichier est trop volumineux (max 2 Mo)');
  }

  return true;
}

/**
 * Convertir base64 en Blob
 */
export function base64ToBlob(base64, type) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
}

/**
 * Télécharger un fichier
 */
export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Télécharger un CV généré (PDF et/ou DOCX)
 */
export function downloadGeneratedCV(result, selectedFormats) {
  const downloadedFormats = [];

  // Télécharger PDF si demandé
  if (selectedFormats.pdf && result.data.pdf) {
    const pdfBlob = base64ToBlob(result.data.pdf, 'application/pdf');
    downloadFile(pdfBlob, `${result.data.filename}.pdf`);
    downloadedFormats.push('PDF');
  }

  // Télécharger DOCX si demandé
  if (selectedFormats.docx && result.data.docx) {
    const docxBlob = base64ToBlob(
      result.data.docx,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    downloadFile(docxBlob, `${result.data.filename}.docx`);
    downloadedFormats.push('DOCX');
  }

  return downloadedFormats;
}