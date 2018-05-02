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

import { Vector } from "./vector"

const mi = {
  m11: 0, m12: 1, m13: 2,
  m21: 3, m22: 4, m23: 5,
  m31: 6, m32: 7, m33: 8,
}
export class Matrix {
  constructor(public v: number[]) {
  }
  public static identity(): Matrix {
    return new Matrix([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ])
  }
  public static rotation(r: number): Matrix {
    return new Matrix([
      Math.cos(r),  Math.sin(r), 0,
     -Math.sin(r),  Math.cos(r), 0,
      0,            0,           1
    ])
  }
  public static translate(v: Vector): Matrix {
    return new Matrix([
      1, 0, v.v[0],
      0, 1, v.v[1],
      0, 0, 1
    ])
  }
  public static scale(v: Vector): Matrix {
    return new Matrix([
      v.v[0], 0,      0,
      0,      v.v[1], 0,
      0,      0,      1
    ])
  }
  public static multiply(a: Matrix, b: Matrix): Matrix {
    return new Matrix([
      (((a.v[mi.m11] * b.v[mi.m11]) + (a.v[mi.m12] * b.v[mi.m21])) + (a.v[mi.m13] * b.v[mi.m31])),
      (((a.v[mi.m11] * b.v[mi.m12]) + (a.v[mi.m12] * b.v[mi.m22])) + (a.v[mi.m13] * b.v[mi.m32])),
      (((a.v[mi.m11] * b.v[mi.m13]) + (a.v[mi.m12] * b.v[mi.m23])) + (a.v[mi.m13] * b.v[mi.m33])),
      (((a.v[mi.m21] * b.v[mi.m11]) + (a.v[mi.m22] * b.v[mi.m21])) + (a.v[mi.m23] * b.v[mi.m31])),
      (((a.v[mi.m21] * b.v[mi.m12]) + (a.v[mi.m22] * b.v[mi.m22])) + (a.v[mi.m23] * b.v[mi.m32])),
      (((a.v[mi.m21] * b.v[mi.m13]) + (a.v[mi.m22] * b.v[mi.m23])) + (a.v[mi.m23] * b.v[mi.m33])),
      (((a.v[mi.m31] * b.v[mi.m11]) + (a.v[mi.m32] * b.v[mi.m21])) + (a.v[mi.m33] * b.v[mi.m31])),
      (((a.v[mi.m31] * b.v[mi.m12]) + (a.v[mi.m32] * b.v[mi.m22])) + (a.v[mi.m33] * b.v[mi.m32])),
      (((a.v[mi.m31] * b.v[mi.m13]) + (a.v[mi.m32] * b.v[mi.m23])) + (a.v[mi.m33] * b.v[mi.m33]))
    ])
  }

  public clone(): Matrix {
    return new Matrix(this.v.map(n => n))
  }
}