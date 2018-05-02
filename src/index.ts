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

import { Renderer }                       from "./renderer/index"
import { Scene }                          from "./renderer/index"
import { Camera }                         from "./renderer/index"
import { Mesh }                           from "./renderer/index"
import { Matrix, Vector }                 from "./math/index"
import { Triangle, Square, Circle, Star } from "./shapes/index"
import { Designer }                       from "./design/index"
import { Store }                          from "./storage/index"

// -----------------------------------------------------
// resolves a scene, either from local storage, or 
// from a computed initial scene.
// -----------------------------------------------------
const resolve_scene = (): [Camera, Scene] => {
  const result = Store.load()
  if (result === undefined) {
    const scene      = new Scene()
    const camera     = new Camera()
    const triangle   = new Triangle()
    const square     = new Square()
    const circle     = new Circle()
    const star       = new Star()
    triangle.matrix  = Matrix.translate(Vector.create(-180, 16))
    square.matrix    = Matrix.translate(Vector.create(-58,  0))
    circle.matrix    = Matrix.translate(Vector.create( 60,  0))
    star.matrix      = Matrix.translate(Vector.create( 180, 0))
    scene.objects.push(triangle)
    scene.objects.push(square)
    scene.objects.push(circle)
    scene.objects.push(star)
    Store.save(camera, scene)
    return Store.load()
  } else {
    return result
  }
}

// -----------------------------------------------------
// create a designer and loads it with the resolved scene.
// -----------------------------------------------------
const canvas   = document.getElementById("canvas")    as HTMLCanvasElement
const designer = new Designer(canvas)
const [camera, scene] = resolve_scene()
designer.set_camera(camera)
designer.set_scene(scene)
designer.change((camera, scene) => Store.save(camera, scene))
designer.select((mesh) => { /* maybe do something with the mesh? */})

// ----------------------------------------------
// setup UI events.
// ----------------------------------------------
const i_reset      = document.getElementById("reset")     as HTMLButtonElement
const i_translate  = document.getElementById("translate") as HTMLButtonElement
const i_rotate     = document.getElementById("rotate")    as HTMLButtonElement
const i_scale      = document.getElementById("scale")     as HTMLButtonElement
const i_wire       = document.getElementById("wire")      as HTMLButtonElement
const i_triangle   = document.getElementById("triangle")  as HTMLButtonElement
const i_square     = document.getElementById("square")      as HTMLButtonElement
const i_circle     = document.getElementById("circle")    as HTMLButtonElement
const i_star       = document.getElementById("star")      as HTMLButtonElement
const i_delete     = document.getElementById("delete")    as HTMLButtonElement
i_reset.addEventListener("click", () => {
  Store.clear()
  const [camera, scene] = resolve_scene()
  designer.set_camera(camera)
  designer.set_scene(scene)
})
i_translate.addEventListener("click", () => designer.set_mode("translate"))
i_rotate.addEventListener("click", () => designer.set_mode("rotate"))
i_scale.addEventListener("click", () => designer.set_mode("scale"))
i_wire.addEventListener("click", () => {
  const scene    = designer.get_scene()
  const selected = designer.get_selected()
  if (selected !== undefined) {
    const object = scene.objects.find(object => object.id === selected.id) as Mesh
    object.material.wireframe = !object.material.wireframe
    designer.set_scene(scene)
  }
})
i_triangle.addEventListener("click", () => {
  const scene = designer.get_scene()
  scene.objects.push(new Triangle())
  designer.set_scene(scene)
})

i_square.addEventListener("click", () => {
  const scene = designer.get_scene()
  scene.objects.push(new Square())
  designer.set_scene(scene)
})
i_circle.addEventListener ("click", () => {
  const scene = designer.get_scene()
  scene.objects.push(new Circle())
  designer.set_scene(scene)
})
i_star.addEventListener("click", () => {
  const scene = designer.get_scene()
  scene.objects.push(new Star())
  designer.set_scene(scene)
})

i_delete.addEventListener("click", () => {
  const scene    = designer.get_scene()
  const selected = designer.get_selected()
  if (selected !== undefined) {
    scene.objects = scene.objects.filter(object => 
      object.id !== selected.id)
    designer.set_scene(scene)
  }
})
