// Initialize Quill Editor with custom toolbar
var quill = new Quill('#editor', {
    modules: {
      toolbar: '#toolbar'
    },
    theme: 'snow'
  });
  
  // Enable image uploading and embedding
  quill.getModule('toolbar').addHandler('image', () => {
    selectLocalImage();
  });
  
  // Function to upload image
  function selectLocalImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = () => {
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        saveToServer(file);
      } else {
        console.warn('You can only upload images.');
      }
    };
  }
  
  function saveToServer(file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      insertToEditor(base64String);
    };
    reader.readAsDataURL(file);
  }
  
  function insertToEditor(url) {
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', url);
  }
  
  // Change page background color based on user selection
  document.getElementById('pageColor').addEventListener('input', function() {
    const editor = document.getElementById('editor');
    editor.style.backgroundColor = this.value;
  });
  
  // Font size change functionality
  document.getElementById('font-size').addEventListener('change', function() {
    const size = this.value + 'px';
    quill.format('size', size);
  });
  
  // Download the document in the selected format
  document.getElementById('download-btn').addEventListener('click', function() {
    const format = document.getElementById('downloadFormat').value;
  
    if (format === 'html') {
      downloadAsHTML();
    } else if (format === 'pdf') {
      downloadAsPDF();
    } else if (format === 'docx') {
      downloadAsDOCX();
    }
  });
  
  // Download as HTML function
  function downloadAsHTML() {
    const text = quill.root.innerHTML; // Get content in HTML format
    const blob = new Blob([text], { type: 'text/html' }); // Save as HTML file
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html'; // Name the file
    document.body.appendChild(a);
    a.click();
  
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
  
  // Download as PDF function using jsPDF
  function downloadAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    const content = quill.root.innerText; // Use plain text for PDF
    doc.text(content, 10, 10); // Adjust position if needed
    doc.save('document.pdf'); // Save as PDF
  }
  
  // Download as DOCX function using docx.js
  function downloadAsDOCX() {
    const doc = new docx.Document();
    const text = quill.root.innerText; // Use plain text for DOCX format
  
    doc.addSection({
      children: [
        new docx.Paragraph({
          text: text,
        }),
      ],
    });
  
    docx.Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.docx'; // Save as DOCX
      document.body.appendChild(a);
      a.click();
  
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    });
  }
  
  // Clear the editor to start a new document
  document.getElementById('new-doc-btn').addEventListener('click', function() {
    quill.setContents([]); // Clear the editor
    document.getElementById('editor').style.backgroundColor = '#ffffff'; // Reset background color
  });
  