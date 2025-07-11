// This module simulates a backend AI service.
// It takes a text prompt and returns a structured list of modeling operations.

// Helper to find numerical values (e.g., "50mm", "24 teeth")
const findDim = (text, regex) => {
    const match = text.match(regex);
    return match ? parseFloat(match[1]) : null;
}

function processPrompt(prompt) {
    const text = prompt.toLowerCase();
    let operations = [];

    // --- Case 1: Cube with a cylindrical hole ---
    if (text.includes('cube') && (text.includes('hole') || text.includes('cutout'))) {
        const cubeSize = findDim(text, /(\d+\.?\d*)\s*mm\s*cube/) || findDim(text, /cube\s*of\s*(\d+\.?\d*)/) || 40;
        const holeDiameter = findDim(text, /(\d+\.?\d*)\s*mm\s*diameter\s*hole/) || findDim(text, /(\d+\.?\d*)\s*mm\s*hole/) || cubeSize / 3;

        operations = [
            {
                operation: "create",
                shape: "cube",
                params: { size: cubeSize },
                id: "baseCube" // Give it an ID to reference later
            },
            {
                operation: "create",
                shape: "cylinder",
                params: { radius: holeDiameter / 2, height: cubeSize * 1.5 }, // Make it longer to ensure a clean cut
                id: "cutterCylinder"
            },
            {
                operation: "subtract", // Boolean operation
                target: "baseCube",   // The object to cut from
                tool: "cutterCylinder" // The object to use for cutting
            }
        ];
    
    // --- Case 2: A simple gear ---
    } else if (text.includes('gear')) {
        const diameter = findDim(text, /(\d+\.?\d*)\s*mm\s*diameter/) || 60;
        const teeth = findDim(text, /(\d+)\s*teeth/) || 24;
        const thickness = findDim(text, /(\d+\.?\d*)\s*mm\s*thick/) || 10;
        
        operations = [{
            operation: "create",
            shape: "gear",
            params: { radius: diameter / 2, teeth, thickness },
            id: "final"
        }];

    // --- Case 3: A pipe flange ---
    } else if (text.includes('flange')) {
        const outerDia = 80;
        const innerDia = 30;
        const thickness = 15;
        const holeDia = 8;
        const holePatternDia = 55;

        operations = [
            { operation: "create", shape: "cylinder", params: { radius: outerDia / 2, height: thickness }, id: "baseFlange" },
            { operation: "create", shape: "cylinder", params: { radius: innerDia / 2, height: thickness * 1.5 }, id: "centerHole" },
            { operation: "subtract", target: "baseFlange", tool: "centerHole", id: "flangeWithHole" },
            { operation: "create", shape: "cylinder", params: { radius: holeDia / 2, height: thickness * 1.5 }, id: "boltHoleCutter" },
            { operation: "pattern", shape: "circular", count: 4, radius: holePatternDia / 2, tool: "boltHoleCutter", id: "allBoltHoles" },
            { operation: "subtract", target: "flangeWithHole", tool: "allBoltHoles" }
        ];

    // --- Fallback: A simple cube ---
    } else {
         const size = findDim(text, /(\d+\.?\d*)\s*mm/) || 30;
         operations = [{
            operation: "create",
            shape: "cube",
            params: { size },
            id: "final"
         }];
    }

    if (operations.length === 0) {
        throw new Error("I'm sorry, I couldn't understand that instruction. Please be more specific.");
    }
    
    return { success: true, operations };
}


// This function simulates making a network request to a real AI service.
// In a real application, this would use `fetch()` to call your backend.
function getModelInstructions(prompt) {
    console.log("Simulating AI Request with prompt:", prompt);
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const result = processPrompt(prompt);
                console.log("Simulated AI Response:", result);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }, 1000); // Simulate network latency
    });
}


export { getModelInstructions };
