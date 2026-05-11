// Import3D_Helper.jsx - Fixed & Optimized for AE 2022-2026
{
    app.beginUndoGroup("Import 3D Model (OBJ/GLB)");
    
    try {
        // Ensure a project exists
        if (!app.project) { app.newProject(); }
        
        // Detect AE version
        var aeVer = parseFloat(app.version);
        var isAE24Plus = aeVer >= 24.0;
        
        // File filter
        var filter = isAE24Plus ? 
            "3D Files:*.glb,*.obj,*.fbx,*.c4d" : 
            "3D Files:*.obj,*.fbx,*.c4d";
            
        var file = File.openDialog("Select your 3D model", filter, false);
        if (!file) { app.endUndoGroup(); exit(); }
        
        // ✅ Proper AE import setup
        var io = new ImportOptions(file);
        io.importAs = ImportAsType.FOOTAGE;
        io.sequence = false;
        
        var item = app.project.importFile(io);
        if (!item) throw new Error("Import returned null. File may be unsupported.");
        
        // Create or reuse composition
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            comp = app.project.items.addComp("3D_Model_Comp", 1920, 1080, 1, 10, 30);
        }
        
        var layer = comp.layers.add(item);
        
        // Enable 3D switch (AE auto-handles native GLB layers)
        if (!layer.hasProperty("ADBE Root Vectors Group")) {
            layer.threeDLayer = true;
        }
        
        alert("✅ Imported: " + file.name + 
              "\n\n💡 AE 2024+: GLB works natively.\n⚠️ AE 2023 or older: GLB not supported. Convert to FBX/OBJ via Blender first.");
              
    } catch (e) {
        alert("❌ Script Error:\n" + e.message + 
              "\n\nFixes:\n• Run AE as Administrator\n• Update to AE 2024+ for native GLB\n• Convert .glb → .fbx using Blender if on older AE");
    }
    
    app.endUndoGroup();
}