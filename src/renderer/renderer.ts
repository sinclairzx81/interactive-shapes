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

import { Matrix }   from "../math/matrix"
import { Vector }   from "../math/vector"
import { Scene }    from "./scene"
import { Mesh }     from "./mesh"
import { Camera }   from "./camera"
import { Object2D } from "./object"

export class Renderer {
  private context: CanvasRenderingContext2D

  constructor(private canvas: HTMLCanvasElement) {
    this.context = this.canvas.getContext("2d")
  }

  public clear(color: string) {
    this.context.fillStyle = color
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  public render(camera: Camera, scene: Scene) {
    const center = Matrix.translate(Vector.create(
      this.canvas.width  / 2,
      this.canvas.height / 2
    ))
    const transform = Matrix.multiply(center, camera.matrix)
    this.render_objects(transform, scene.objects)
  }

  private render_object(transform: Matrix, object: Object2D) {
    const current_transform = Matrix.multiply(transform, object.matrix)
    this.render_objects(current_transform, object.objects)
  }

  private render_mesh(transform: Matrix, mesh: Mesh) {
    const current_transform = Matrix.multiply(transform, mesh.matrix)
    const geometry = mesh.geometry
    const material = mesh.material
    this.context.strokeStyle = material.color
    this.context.fillStyle   = material.color
    
    for (let i = 0; i < geometry.indices.length; i += 3) {
      this.context.beginPath()
      const index_0     = geometry.indices[i + 0]
      const index_1     = geometry.indices[i + 1]
      const index_2     = geometry.indices[i + 2]
      const vector_0    = geometry.vertices[index_0]
      const vector_1    = geometry.vertices[index_1]
      const vector_2    = geometry.vertices[index_2]
      const transform_0 = Vector.transform(vector_0, current_transform)
      const transform_1 = Vector.transform(vector_1, current_transform)
      const transform_2 = Vector.transform(vector_2, current_transform)
      this.context.moveTo(transform_0.v[0], transform_0.v[1])
      this.context.lineTo(transform_1.v[0], transform_1.v[1])
      this.context.lineTo(transform_2.v[0], transform_2.v[1])
      this.context.lineTo(transform_0.v[0], transform_0.v[1])
      this.context.closePath()
      if (material.wireframe) {
        this.context.stroke()
      } else {
        this.context.stroke()
        this.context.fill()
      }
    }

    this.render_objects(current_transform, mesh.objects)
  }

  private render_objects(transform: Matrix, objects: Object2D[]) {
    for ( const object of objects ) {
      if (object instanceof Mesh) {
        this.render_mesh(transform, object as Mesh)
      }
    }
  }
}