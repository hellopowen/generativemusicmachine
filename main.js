function saveSketch(sketchId, sketchName) {
    const canvas = document.querySelector(`#canvas-container-${sketchId} canvas`);
    const dataURL = canvas.toDataURL();

    const sketchList = document.getElementById('sketch-list');
    const savedSketch = document.createElement('div');
    savedSketch.className = 'saved-sketch';

    const img = document.createElement('img');
    img.src = dataURL;
    img.alt = sketchName;

    const caption = document.createElement('p');
    caption.textContent = `${sketchName} - ${new Date().toLocaleString()}`;

    savedSketch.appendChild(img);
    savedSketch.appendChild(caption);
    sketchList.appendChild(savedSketch);
}