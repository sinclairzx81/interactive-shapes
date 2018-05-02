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

import { Matrix } from "../math/index"
import { Vector } from "../math/index"

export class Camera {

  public matrix: Matrix
  constructor() {
    this.matrix = Matrix.identity()
  }
  public lookAt(x: number, y: number, z: number) {
    const translate = Matrix.translate(Vector.create(-x, -y))
    const scale     = Matrix.scale(Vector.create(1.0 / z, 1.0 / z))
    this.matrix     = Matrix.multiply(translate, scale)
  }

  public clone(): Camera {
    const camera = new Camera()
    camera.matrix = this.matrix.clone()
    return camera
  }
}