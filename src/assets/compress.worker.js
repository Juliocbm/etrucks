/* // Importa JSZip utilizando importScripts
self.importScripts('/assets/jszip.min.js');

self.addEventListener('message', async (e) => {

  try {
    self.postMessage({ type: 'log', message: 'Worker ha recibido las facturas' });
    const facturas = e.data;

    // Crea una instancia de JSZip
    const zip = new JSZip();
    console.log('Worker: JSZip instancia creada', zip);

    // Por cada factura, convierte base64 a blob y añádelo al zip
    facturas.forEach((factura, index) => {
      const filename = 'factura_' + factura.numGuia + '.pdf';
      const content = factura.pdf64; // Suponiendo que 'factura.base64' es tu base64
      zip.file(filename, content, { base64: true });
      // Opcional: envía el progreso al hilo principal
      const progressAddFiles = (index + 1) / facturas.length * 50; // 50% del progreso total
      self.postMessage({ progress: progressAddFiles });
    });

    // Cuando todas las facturas estén añadidas al zip, genera el zip
    zip.generateAsync({ type: 'blob' }, (metadata) => {
      // Recibe actualizaciones de progreso de la generación del .zip
      const progressGenerateZip = 50 + metadata.percent * 0.5; // El otro 50% del progreso total
      self.postMessage({ progress: progressGenerateZip });
    }).then(content => {
      // Envía el blob resultante al hilo principal
      self.postMessage({ content });
    });

  } catch (error) {
    console.error('Worker: Error ocurrido', error);
    self.postMessage({ type: 'error', error: error.message });
  }
}); */


// Importa JSZip utilizando importScripts
self.importScripts('/assets/jszip.min.js');

self.addEventListener('message', async (e) => {
  try {
    // Indica que el worker ha empezado a procesar
    self.postMessage({ type: 'log', message: 'Worker ha recibido las facturas' });

    const obj = e.data;
    console.log('facturas',obj.facturas);
    const zip = new JSZip();

    // Por cada factura, convierte base64 a blob y añádelo al zip
    obj.facturas.forEach((factura, index) => {
      const filename = 'factura_' + factura.numGuia + '.pdf';
      const content = factura.pdf64; // Suponiendo que 'factura.pdf64' es tu base64

      const filenameXml = 'factura_' + factura.numGuia + '.xml';
      const contentXml = factura.xml64; // Suponiendo que 'factura.pdf64' es tu base64

      if (obj.tipoDescarga == 'desFacturas') {

        zip.file(filename, content, { base64: true });
        zip.file(filenameXml, contentXml, { base64: true });

      } else {

        if (factura.xml64 && factura.pdf64) {
          const folderCfdi = zip.folder("cfdi");
          folderCfdi?.file(filename, content, { base64: true });
          folderCfdi?.file(filenameXml, contentXml, { base64: true });
        }
          
        if (factura.pod64) {
          const filenamePod = factura.numGuia + '.pdf';
          const contentPod = factura.pod64;

          const folderPod = zip.folder("pod");
          folderPod?.file(filenamePod, contentPod, { base64: true });
        }          
      }

      // Envía el progreso de añadir archivos al zip (primer 50% del progreso total)
      const progressAddFiles = (index + 1) /  obj.facturas.length * 50;
      self.postMessage({  type: 'progress', id: obj.id, progress: progressAddFiles });
    });

    // Genera el zip y maneja el progreso de la generación del zip (segundo 50% del progreso total)
    zip.generateAsync({ type: 'blob' }, (metadata) => {
      const progressGenerateZip = 50 + metadata.percent * 0.5;
      self.postMessage({  type: 'progress', id: obj.id, progress: progressGenerateZip });
    }).then(content => {
      // Envía el blob resultante al hilo principal cuando la generación del zip está completa
      self.postMessage({ type: 'completed', id: obj.id, content: content });
    });

  } catch (error) {
    // Maneja errores y envía mensajes de error al hilo principal
    console.error('Worker: Error ocurrido', error);
    self.postMessage({ type: 'error', error: error.message });
  }
});
