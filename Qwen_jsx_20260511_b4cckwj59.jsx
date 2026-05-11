// Import3D_Helper.jsx
// Place in: [AE Install Folder]/Support Files/Scripts/
// Run via: File > Scripts > Import3D_Helper.jsx

{
    app.beginUndoGroup("Import 3D Model (OBJ/GLB)");
    
    // Check AE version for native GLB support (v24.0+)
    var aeVersion = parseFloat(app.version);
    var supportsGLB = aeVersion >= 24.0;
    
    // File filter based on version
    var filter = supportsGLB ? 
        "3D Files:*.glb;*.obj;*.fbx;*.c4d" : 
        "3D Files:*.obj;*.fbx;*.c4d";
    
    var file = File.openDialog("Select your 3D model (OBJ/GLB)", filter);
    
    if (file) {
        var item = app.project.importFile(new ImportOptions(file));
        
        if (item) {
            // Create new composition if none exists
            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) {
                comp = app.project.items.addComp("3D_Model_Comp", 1920, 1080, 1, 10, 30);
            }
            
            // Add layer to comp
            var layer = comp.layers.add(item);
            
            // Enable 3D for the layer (if not already a 3D model layer)
            if (layer.canSetProperty && layer.property("ADBE Root Vectors Group")) {
                // Native 3D Model layer (AE 2024+) - auto-configured
                layer.property("ADBE Root Vectors Group").setValue(true);
            } else {
                // Fallback: enable 3D switch for OBJ/FBX via Cineware/Element3D
                layer.threeDLayer = true;
            }
            
            // Select the new layer
            layer.selected = true;
            alert("✅ Imported: " + file.name + "\n\n💡 Tips:\n• Use Effect Controls to adjust materials\n• Add HDRI environment for realistic lighting\n• For OBJ in older AE: Use Cineware or Element 3D plugin");
        } else {
            alert("❌ Failed to import: " + file.name + "\n\nPossible reasons:\n• File is corrupted\n• Format not supported in your AE version\n• Try converting to FBX via Blender");
        }
    }
    
    app.endUndoGroup();
}