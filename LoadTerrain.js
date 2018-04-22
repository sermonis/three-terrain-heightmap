function loadTerrain(res, multiplier, terrainProfile) {
    var c = document.getElementById('heightMap');
    var ctx = c.getContext('2d')
    var img = document.getElementById('heightImage');
    ctx.drawImage(img, 0, 0);
    var sizeWidth = ctx.canvas.clientWidth;
    var sizeHeight = ctx.canvas.clientHeight;
    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    var data = imgData.data;
    console.log(data)
    var minValue = 0;
    var maxValue = 0;
    var imageData = [];
    for (var i=0; i<data.length/4; i++) {
        imageData.push(data[i*4])
        if (data[i*4] >maxValue) {
            maxValue = data[i*4]
        }
        if (data[i*4] <minValue) {
            minValue = data[i*4]
        }
    }
    var imageResult = [];
    for (var x=0; x<imageData.length; x+=sizeWidth) {
        imageResult.push(imageData.slice(x, x+sizeHeight))
    }
    console.log(imageResult)
    var meshArray = []
    console.log('Starting render call')
    for (var x=0; x<imageResult.length-res; x+=res) {
        for (var y=0; y<imageResult[x].length-res; y+=res) {
            var geom = new THREE.Geometry();

            var v1 = new THREE.Vector3(x, imageResult[x][y]-minValue, y)
            var v2 = new THREE.Vector3(x+res, imageResult[x+res][y]-minValue, y)
            var v3 = new THREE.Vector3(x, imageResult[x][y+res]-minValue, y+res)
            var v4 = new THREE.Vector3(x+res, imageResult[x+res][y]-minValue, y)
            var v5 = new THREE.Vector3(x+res, imageResult[x+res][y+res]-minValue, y+res)
            var v6 = new THREE.Vector3(x, imageResult[x][y+res]-minValue, y+res)
            var vertices = [v1.clone(), v2.clone(), v3.clone(), v4.clone(), v5.clone(), v6.clone()]
            geom.vertices.push(v1)
            geom.vertices.push(v2)
            geom.vertices.push(v3)
            geom.vertices.push(v4)
            geom.vertices.push(v5)
            geom.vertices.push(v6)
            
            geom.faces.push(new THREE.Face3(0, 1, 2))
            geom.faces.push(new THREE.Face3(3, 4, 5))
            geom.translate(-imageResult.length, 0, -imageResult[x].length)
            geom.scale(1, multiplier, 1)
            geom.computeFaceNormals();
            geom.computeVertexNormals();
            var meanVector = new THREE.Vector3(0, 0, 0)
            for (var i=0; i < vertices.length; i++) {
                meanVector.add(vertices[i])
            }
            meanVector.divideScalar(vertices.length)
            var meanHeight = meanVector.y;
            var heightDec = meanHeight/maxValue;
            for (var i=0; i<terrainProfile.length; i++){
                if (heightDec < terrainProfile[i].level) {
                    var color = new THREE.Color(terrainProfile[i].colour.toString())
                    break;
                }
            }
            var material = new THREE.MeshLambertMaterial({})
            material.color = color
            var object = new THREE.Mesh(geom, material);
            object.renderOrder = 0
            object.material.side = THREE.DoubleSide;
            object.position -= 256
            meshArray.push(object)
            scene.add(object)
            
        }
    }
    console.log(meshArray)
    console.log('Finished render call')
    return meshArray
}