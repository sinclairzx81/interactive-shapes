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

import { Vector, Matrix } from "../math/index"
import { Mesh }           from "../renderer/mesh"
import { Geometry }       from "../renderer/geometry"
import { Material }       from "../renderer/material"

export class Star extends Mesh {
  constructor() {
    const vertices = []

    const large = 60
    const small = 23
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72)
      const x = Math.sin(angle * Math.PI / 180) * large
      const y = Math.cos(angle * Math.PI / 180) * large
      vertices.push(Vector.create(x, -y))
    }
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72)
      const x = Math.sin(angle * Math.PI / 180) * small
      const y = Math.cos(angle * Math.PI / 180) * small
      vertices.push(Vector.create(x, y))
    }

    const indices = [
      // outer
      0, 7, 8,
      1, 6, 7,
      2, 5, 6,
      3, 9, 5,
      4, 8, 9,
      // inside
      8, 5, 9,
      5, 8, 7,
      7, 6, 5
    ]
    super(new Geometry(vertices, indices), new Material())
  }
}