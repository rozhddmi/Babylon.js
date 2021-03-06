module INSPECTOR{
    
    export class MeshTab extends PropertyTab {
                
        constructor(tabbar:TabBar, inspector:Inspector) {
            super(tabbar, 'Mesh', inspector); 
        }

        /* Overrides super */
        protected _getTree() : Array<TreeItem> {
            let arr = [];
            // Tab containign mesh already in results
            let alreadyIn = [];

            // Recursive method building the tree panel
            let createNode = (obj : BABYLON.AbstractMesh) => {
                let descendants = obj.getDescendants(true);

                if (descendants.length > 0) {
                    let node = new TreeItem(this, new MeshAdapter(obj));
                    alreadyIn.push(obj);
                    for (let child of descendants) {     
                        if (child instanceof BABYLON.AbstractMesh) {
                            if (!Helpers.IsSystemName(child.name)) {  
                                let n = createNode(child);
                                node.add(n); 
                            }
                        }
                    }
                    node.update();
                    return node;
                } else {
                    alreadyIn.push(obj);
                    return new TreeItem(this, new MeshAdapter(obj));
                }
            };
            
            // get all meshes from the first scene
            let instances = this._inspector.scene;
            for (let mesh of instances.meshes) {
                if (alreadyIn.indexOf(mesh) == -1 && !Helpers.IsSystemName(mesh.name)) {
                    let node = createNode(mesh);
                    arr.push(node);
                }
            }
            return arr;
        }  
    }
    
}