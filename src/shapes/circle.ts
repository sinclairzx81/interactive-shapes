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

export class Circle extends Mesh {
  constructor() {
    const ring = []
    const points = 12
    for(let i = 0; i < points; i++) {
      const x = Math.cos((i * (360 / points)) * Math.PI / 180) * 50
      const y = Math.sin((i * (360 / points)) * Math.PI / 180) * 50
      ring.push(Vector.create(x, y))
    }
    const vertices = []
    for(let i = 0; i < points; i++) {
      vertices.push(Vector.create(0, 0))
      vertices.push(ring[i])
      vertices.push(ring[(i + 1) % points]) 
    }
    const indices = []
    for(let i = 0; i < points * 3; i++) {
      indices.push(i)
    }


    super(new Geometry(vertices, indices), new Material())
  }
}