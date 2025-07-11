function parseText(text) {
    text = text.toLowerCase();
    const params = { shape: null };

    // Helper to find numerical values with units
    const findDim = (regex) => {
        const match = text.match(regex);
        return match ? parseFloat(match[1]) : null;
    }

    if (text.includes('gear')) {
        params.shape = 'gear';
        params.diameter = findDim(/(\d+\.?\d*)\s*mm\s*diameter/) || findDim(/(\d+\.?\d*)\s*mm/);
        params.teeth = findDim(/(\d+)\s*teeth/) || findDim(/(\d+)\s*tooth/);
        params.thickness = findDim(/(\d+\.?\d*)\s*mm\s*thick/);
        params.hole = findDim(/(\d+\.?\d*)\s*mm\s*(?:center|central|inner)?\s*hole/);
        if (!params.diameter || !params.teeth) throw new Error("For a gear, please specify diameter and number of teeth.");

    } else if (text.includes('sphere')) {
        params.shape = 'sphere';
        params.radius = findDim(/(\d+\.?\d*)\s*mm\s*radius/) || findDim(/(\d+\.?\d*)\s*mm/);
        if (!params.radius) throw new Error("For a sphere, please specify a radius.");

    } else if (text.includes('cylinder')) {
        params.shape = 'cylinder';
        params.diameter = findDim(/(\d+\.?\d*)\s*mm\s*diameter/);
        params.height = findDim(/(\d+\.?\d*)\s*mm\s*(?:tall|height|high)/);
        if (!params.diameter || !params.height) throw new Error("For a cylinder, please specify diameter and height.");
    
    } else if (text.includes('cube') || text.includes('box')) {
         params.shape = 'cube';
         params.size = findDim(/(\d+\.?\d*)\s*mm/);
         if (!params.size) throw new Error("For a cube, please specify a size (e.g., 20mm).");
    
    } else {
        throw new Error("Could not determine the shape. Try 'cube', 'sphere', 'cylinder', or 'gear'.");
    }
    return params;
}

export { parseText };
