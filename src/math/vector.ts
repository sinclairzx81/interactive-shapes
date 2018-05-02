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

import { Matrix } from "./matrix"

export class Vector {
  constructor(public v: number[]) {
  }
  public static create(x: number, y: number) {
    return new Vector([x, y])
  }
  public static zero(): Vector {
    return new Vector([0, 0])
  }
  public static add(a: Vector, b: Vector): Vector {
    return new Vector([a.v[0] + b.v[0], a.v[1] + b.v[1]])
  }
  public static sub(a: Vector, b: Vector): Vector {
    return new Vector([a.v[0] - b.v[0], a.v[1] - b.v[1]])
  }
  public static scale(a: Vector, v: number): Vector {
    return new Vector([a.v[0] * v, a.v[1] * v])
  }
  public static mul(a: Vector, b: Vector) {
    return new Vector([a.v[0] * b.v[0], a.v[1] * b.v[1]])
  }
  public static div(a: Vector, b: Vector) {
    return new Vector([a.v[0] / b.v[0], a.v[1] / b.v[1]])
  }
  public static len(a: Vector) {
    return Math.sqrt(a.v[0] * a.v[0] + a.v[1] * a.v[1])
  }
  public static normalize(a: Vector): Vector {
    const length = Vector.len(a)
    return new Vector([a.v[0] / length, a.v[1] / length])
  }
  public static transform(v0: Vector, m0: Matrix): Vector {
    return new Vector([
      (((v0.v[0] * m0.v[0]) + (v0.v[1] * m0.v[1])) + m0.v[2]),
      (((v0.v[0] * m0.v[3]) + (v0.v[1] * m0.v[4])) + m0.v[5])
    ])
  }
  public clone(): Vector {
    return new Vector(this.v.map(n => n))
  }
}