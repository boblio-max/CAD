
import { initViewer, controls, camera } from './modules/viewer.js';
import { parseText } from './modules/parser.js';
import { createModel, toggleWireframe } from './modules/geometry.js';
import { initUI, setLoading, updateStatus, textInput, detailLevelSlider, canvas } from './modules/ui.js';

// --- App Initialization ---
function init() {
    // Initialize modules
    initViewer(canvas);
    initUI(
        onGenerateModel, 
        onQuickShapeClick, 
        resetView,
        onToggleWireframe
    );

    // Create the initial model
    handleModelCreation("a 20mm cube");
}

// --- Event Handlers & Core Logic ---
function onGenerateModel() {
    const prompt = textInput.value;
    if (!prompt.trim()) {
        updateStatus('Please enter a description.', 'error');
        return;
    }
    
    setLoading(true);
    updateStatus('AI is analyzing your request...', 'processing');

    // Simulate AI processing time
    setTimeout(() => {
        handleModelCreation(prompt);
        setLoading(false);
    }, 1500); 
}

function handleModelCreation(prompt) {
    try {
        const params = parseText(prompt);
        const detailSegments = parseInt(detailLevelSlider.value);
        createModel(params, detailSegments);
        updateStatus('Model generated successfully!', 'success');
        resetView();
    } catch (error) {
        updateStatus(error.message, 'error');
    }
}

function onQuickShapeClick(e) {
    if (e.target.tagName === 'BUTTON') {
        const shape = e.target.dataset.shape;
        const examples = {
            cube: 'a 30mm wide cube',
            sphere: 'a sphere with 25mm radius',
            cylinder: 'a cylinder 50mm tall with a 20mm diameter',
            gear: 'a gear with 24 teeth, 60mm diameter and 10mm thickness',
        };
        textInput.value = examples[shape];
        onGenerateModel();
    }
}

function onToggleWireframe() {
    const isWireframe = toggleWireframe();
    updateStatus(`Wireframe mode ${isWireframe ? 'ON' : 'OFF'}`, 'success');
}

function resetView() {
    controls.reset();
    camera.position.set(60, 60, 60);
}

// --- Start the App ---
init();
