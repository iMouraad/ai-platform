const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'node_modules', '@xenova', 'transformers', 'src', 'env.js');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix isEmpty function
    const oldCode = 'function isEmpty(obj) {\n    return Object.keys(obj).length === 0;\n}';
    const newCode = 'function isEmpty(obj) {\n    return !obj || Object.keys(obj).length === 0;\n}';
    
    if (content.includes(oldCode)) {
        content = content.replace(oldCode, newCode);
        fs.writeFileSync(filePath, content);
        console.log('✅ @xenova/transformers (env.js) patched successfully.');
    } else if (content.includes(newCode)) {
        console.log('ℹ️ @xenova/transformers (env.js) is already patched.');
    } else {
        console.log('⚠️ Could not find the exact code block to patch in env.js. Check the file content.');
    }
} else {
    console.log('❌ Could not find @xenova/transformers/src/env.js. Make sure the package is installed.');
}
