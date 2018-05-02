/*--------------------------------------------------------------------------

interactive shapes

The MIT License (MIT)

Copyright (c) 2018 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { Scene }    from "../renderer/index"
import { Camera }   from "../renderer/index"
import { Mesh }     from "../renderer/index"
import { Geometry } from "../renderer/index"
import { Material } from "../renderer/index"
import { Object2D } from "../renderer/index"
import { Matrix }   from "../math/index"
import { Vector }   from "../math/index"

export class Pack {

  public static pack(camera: Camera, scene: Scene): string {
    return JSON.stringify({ camera, scene })
  }

  public static unpack(data: string): [Camera, Scene] {
    const object = JSON.parse(data)
    const camera  = new Camera()
    const scene   = new Scene()
    camera.matrix = new Matrix(object.camera.matrix.v)
    scene.matrix  = new Matrix(object.scene.matrix.v)
    Pack.read_objects(object.scene.objects, scene.objects)
    return [camera, scene]
  }

  private static read_object(source: any): Object2D {
    const object = new Object2D()
    object.matrix = new Matrix(source.matrix.v)
    object.type   = source.type
    object.id     = source.id
    Pack.read_objects(source.objects, object.objects)
    return object
  }
  private static read_geometry(source: any): Geometry {
    const vertices = source.vertices.map(vertex => Vector.create(vertex.v[0], vertex.v[1]))
    const indices  = source.indices
    return new Geometry(vertices, indices)
  }

  private static read_material(source: any): Material {
    const material     = new Material()
    material.id        = source.id
    material.wireframe = source.wireframe
    material.color     = source.color
    return material
  }

  private static read_mesh(source: any): Mesh {
    const geometry = this.read_geometry(source.geometry)
    const material = this.read_material(source.material)
    const mesh  = new Mesh(geometry, material)
    mesh.matrix = new Matrix(source.matrix.v)
    mesh.type   = source.type
    mesh.id     = source.id
    Pack.read_objects(source.objects, mesh.objects)
    return mesh
  }

  private static read_objects(sources: any[], targets: Array<Object2D>) {
    for (const source of sources) {
      switch (source.type) {
        case "object": targets.push(Pack.read_object(source)); break;
        case "mesh":   targets.push(Pack.read_mesh(source));   break;
      }
    }
  }
}