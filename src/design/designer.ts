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

import { Interact, InteractionEvent, MouseDragEvent, MouseWheelEvent, MouseDownEvent, MouseMoveEvent } from "./interact"
import { Vector }   from "../math/vector"
import { Matrix }   from "../math/matrix"
import { Renderer } from "../renderer/index"
import { Selector } from "../renderer/index"
import { Scene }    from "../renderer/scene"
import { Camera }   from "../renderer/camera"
import { Object2D } from "../renderer/index"
import { Mesh }     from "../renderer/index"

export type TransformMode = "translate" | "rotate" | "scale"

const BACKGROUND_COLOR = "#333"
const COLOR_NORMAL     = "#DDD"
const COLOR_HOVER      = "#FFF"
const COLOR_SELECT     = "#CC0"

const null_mesh = () =>  { const mesh = new Mesh(); mesh.id = "null"; return mesh } 

export class Designer {
  private on_change: (camera: Camera, scene: Scene) => void
  private on_select: (mesh: Mesh) => void
  private camera:             Camera
  private scene:              Scene
  private transform_mode:     TransformMode
  private selected:           Mesh | undefined
  private hovering:           Mesh | undefined
  private renderer:           Renderer
  private interact:           Interact
  constructor(private canvas: HTMLCanvasElement) {
    this.camera         = new Camera()
    this.scene          = new Scene()
    this.transform_mode = "translate"
    this.hovering       = null_mesh()
    this.selected       = null_mesh()
    this.renderer       = new Renderer(this.canvas)
    this.interact       = new Interact(this.canvas)
    this.interact.subscribe(event => this.event(event))
    this.on_change = () => {}
    this.on_select = () => {}
    this.render()
  }
  public change(func: (camera: Camera, scene: Scene) => void) {
    this.on_change = func
  }
  public select(func: (mesh: Mesh) => void) {
    this.on_select = func
  }

  public set_mode(mode: TransformMode) {
    this.transform_mode = mode
    this.render()
  }

  public set_scene(scene: Scene) {
    this.scene = scene
    this.render()
  }

  public set_camera(camera: Camera) {
    this.camera = camera
    this.render()
  }

  public get_mode(): TransformMode {
    return this.transform_mode
  }

  public get_camera(): Camera {
    return this.camera
  }

  public get_scene(): Scene {
    return this.scene
  }

  public get_selected(): Mesh | undefined {
    return this.selected.id !== "null"
      ? this.selected
      : undefined
  }

  public render() {
    this.renderer.clear(BACKGROUND_COLOR)
    this.renderer.render(this.camera, this.scene)
  }

  private event(event: InteractionEvent) {
    switch(event.type) {
      case "mousemove":  this.mesh_hover  (event); break;
      case "mousedown":  this.mesh_select (event); break;
      case "mousewheel": this.camera_zoom (event); break;
      case "mousedrag": {
        if (this.selected.id === "null") {
          this.camera_translate(event)
        } else {
          switch(this.transform_mode) {
            case "translate": this.mesh_translate(event, this.selected); break;
            case "rotate":    this.mesh_rotate   (event, this.selected); break;
            case "scale":     this.mesh_scale    (event, this.selected); break;
          }
        }
      }
      break;
    }
    this.render()
  }

  // -------------------------------------------------------------
  //
  // mouse interaction stuff
  //
  // -------------------------------------------------------------

  private mesh_hover(event: MouseMoveEvent) {
    const candidates = Selector.select(this.camera, this.scene, event.position)
    if (candidates.length > 0) {
      const candidate = candidates[0] as Mesh
      // if the hovering mesh is the candidate mesh
      // then return early, we don't care.
      if(this.hovering.id === candidate.id) {
        return
      }
      this.hovering = candidate
      // next, set the hovering color ONLY if the
      // the hovering element isn't a selected
      // element.
      if (this.hovering.id !== this.selected.id) {
        this.hovering.material.color = COLOR_HOVER
      }
    } else {
      // if no candidates exist, then we reset the
      // color to normal, ONLY if the hovering
      // mesh isn't selected.
      if (this.hovering.id !== this.selected.id) {
        this.hovering.material.color = COLOR_NORMAL
      }
      this.hovering = null_mesh()
    }
    this.on_change(this.camera, this.scene)
  }

  private mesh_select(event: MouseDownEvent) {
    // reset the color on the previous selected
    // mesh. if null_mesh, this is a noop.
    this.selected.material.color = COLOR_NORMAL
    
    // set selected to hovering. If the hovering
    // is null, this is a null up.
    this.selected = this.hovering

    // set the selected color.
    this.selected.material.color = COLOR_SELECT

    this.on_change(this.camera, this.scene)

    // dispatch select event.
    if (this.selected.id !== "null") {
      this.on_select(this.selected)
    }
  }

  private mesh_translate(event: MouseDragEvent, mesh: Mesh) {
    const right   = Vector.len(Vector.create(this.camera.matrix.v[0], this.camera.matrix.v[1]))
    const up      = Vector.len(Vector.create(this.camera.matrix.v[3], this.camera.matrix.v[4]))
    const offset  = Vector.div(event.direction, Vector.create(right, up))
    mesh.matrix   = Matrix.multiply(Matrix.translate(offset), mesh.matrix)
    this.on_change(this.camera, this.scene)
  }

  private mesh_rotate(event: MouseDragEvent, mesh: Mesh) {
    const angle = event.direction.v[0] * Math.PI / 180.0
    mesh.matrix = Matrix.multiply(mesh.matrix, Matrix.rotation(-angle))
    this.on_change(this.camera, this.scene)
  }

  private mesh_scale(event: MouseDragEvent, mesh: Mesh) {
    const right   = Vector.len(Vector.create(this.camera.matrix.v[0], this.camera.matrix.v[1])) * 100
    const up      = Vector.len(Vector.create(this.camera.matrix.v[3], this.camera.matrix.v[4])) * 100
    const offset  = Vector.div(event.direction, Vector.create(right, up))
    const scale   = Matrix.scale(Vector.create(offset.v[0] + 1.0, offset.v[0] + 1.0))
    mesh.matrix = Matrix.multiply(mesh.matrix, scale)
    this.on_change(this.camera, this.scene)
  }

  private camera_translate (event: MouseDragEvent) {
    const right        = Vector.len(Vector.create(this.camera.matrix.v[0], this.camera.matrix.v[1]))
    const up           = Vector.len(Vector.create(this.camera.matrix.v[3], this.camera.matrix.v[4]))
    const offset       = Vector.div(event.direction, Vector.create(right, up))
    this.camera.matrix = Matrix.multiply(this.camera.matrix, Matrix.translate(offset))
    this.on_change(this.camera, this.scene)
  }
  private camera_zoom(event: InteractionEvent) {
    const x = event as MouseWheelEvent
    this.camera.matrix = (x.direction > 0) 
      ? Matrix.multiply(Matrix.scale(Vector.create(1.1, 1.1)), this.camera.matrix)
      : Matrix.multiply(Matrix.scale(Vector.create(0.9, 0.9)), this.camera.matrix)
    this.on_change(this.camera, this.scene)
  }
}