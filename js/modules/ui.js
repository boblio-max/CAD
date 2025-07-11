// --- DOM Element Selection ---
const textInput = document.getElementById('textInput');
const generateBtn = document.getElementById('generateBtn');
const generateText = document.getElementById('generateText');
const detailLevelSlider = document.getElementById('detailLevel');
const detailValue = document.getElementById('detailValue');
const statusEl = document.getElementById('status');
const canvas = document.getElementById('canvas');
const shapeGrid = document.querySelector('.shape-grid');
const resetViewBtn = document.getElementById('resetViewBtn');
const toggleWireframeBtn = document.getElementById('toggleWireframeBtn');
const exportStlBtn = document.getElementById('exportStlBtn');

function initUI(generateCallback, quickShapeCallback, resetCallback, wireframeCallback) {
    generateBtn.addEventListener('click', generateCallback);
    detailLevelSlider.addEventListener('input', e => detailValue.textContent = e.target.value);
    shapeGrid.addEventListener('click', quickShapeCallback);
    resetViewBtn.addEventListener('click', resetCallback);
    toggleWireframeBtn.addEventListener('click', wireframeCallback);
    exportStlBtn.addEventListener('click', () => updateStatus('Export function coming soon!', 'processing'));
}

function setLoading(isLoading) {
    if (isLoading) {
        generateText.innerHTML = '<div class="loading-spinner"></div> Processing...';
        generateBtn.disabled = true;
    } else {
        generateText.textContent = 'Generate Model';
        generateBtn.disabled = false;
    }
}

function updateStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.style.display = 'block';

    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 4000);
    }
}

export { 
    initUI, 
    setLoading, 
    updateStatus, 
    textInput,
    detailLevelSlider,
    canvas 
};
