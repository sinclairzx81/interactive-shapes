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

import { Vector }   from "../math/index"
import { Matrix }   from "../math/index"
import { Scene }    from "./scene"
import { Camera }   from "./camera"
import { Object2D } from "./object"
import { Mesh }     from "./mesh"

export class Selector {
  private static intersect(p: Vector, v0: Vector, v1: Vector, v2: Vector): boolean {
    // deltas a dot products
    const cx   = p.v[0]
    const cy   = p.v[1]
    const t0   = v0.v
    const t1   = v1.v
    const t2   = v2.v
    const dx_0 = t2[0] - t0[0] 
    const dy_0 = t2[1] - t0[1]
    const dx_1 = t1[0] - t0[0]
    const dy_1 = t1[1] - t0[1]
    const dx_2 = cx    - t0[0]
    const dy_2 = cy    - t0[1]
    const dot_00 = dx_0 * dx_0 + dy_0 * dy_0
    const dot_01 = dx_0 * dx_1 + dy_0 * dy_1
    const dot_02 = dx_0 * dx_2 + dy_0 * dy_2
    const dot_11 = dx_1 * dx_1 + dy_1 * dy_1
    const dot_12 = dx_1 * dx_2 + dy_1 * dy_2

    // barycentric coordinate
    const b   = (dot_00 * dot_11 - dot_01 * dot_01)
    const inv = b === 0 ? 0 : (1 / b)
    const u   = (dot_11 * dot_02 - dot_01 * dot_12) * inv
    const v   = (dot_00 * dot_12 - dot_01 * dot_02) * inv
    return u >= 0 && v >= 0 && (u + v < 1)
  }
  private static select_mesh(transform: Matrix, mesh: Mesh, position: Vector): Object2D[] {
    const result = []
    const current_transform = Matrix.multiply(transform, mesh.matrix)
    const geometry          = mesh.geometry
    for (let i = 0; i < geometry.indices.length; i += 3) {
      const index_0     = geometry.indices[i + 0]
      const index_1     = geometry.indices[i + 1]
      const index_2     = geometry.indices[i + 2]
      const vector_0    = geometry.vertices[index_0]
      const vector_1    = geometry.vertices[index_1]
      const vector_2    = geometry.vertices[index_2]
      const transform_0 = Vector.transform(vector_0, current_transform)
      const transform_1 = Vector.transform(vector_1, current_transform)
      const transform_2 = Vector.transform(vector_2, current_transform)
      if (Selector.intersect(position, transform_0, transform_1, transform_2)) {
        result.push(mesh)
        break
      }
    }
    result.push(...Selector.select_objects(current_transform, mesh.objects, position))
    return result
  }
  private static select_objects(transform: Matrix, objects: Object2D[], position: Vector): Object2D[] {
    const result = []
    for ( const object of objects ) {
      if (object instanceof Mesh) {
        result.push(...Selector.select_mesh(transform, object as Mesh, position))
      }
    }
    return result
  }
  public static select(camera: Camera, scene: Scene, position: Vector): Object2D[] {
    return Selector.select_objects(camera.matrix, scene.objects, position)
  }
}
