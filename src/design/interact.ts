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

import { Vector } from "../math/vector"

export type MouseButton    = "left" | "middle" | "right" | "none"
export type MouseDirection = 1 | -1

export type MouseUpEvent    = { type: "mouseup",    position: Vector, button: MouseButton }
export type MouseDownEvent  = { type: "mousedown",  position: Vector, button: MouseButton }
export type MouseWheelEvent = { type: "mousewheel", position: Vector, direction: MouseDirection }
export type MouseMoveEvent  = { type: "mousemove",  position: Vector, direction: Vector }
export type MouseDragEvent  = { type: "mousedrag",  position: Vector, direction: Vector, button: MouseButton }
export type InteractionEvent = 
  | MouseMoveEvent
  | MouseUpEvent
  | MouseDownEvent
  | MouseWheelEvent
  | MouseDragEvent

export class Interact {
  private position:      Vector
  private last_position: Vector
  private direction:         Vector
  private origin:        Vector
  private button:        MouseButton
  private subscribers:   Array<(event: InteractionEvent) => void>
  constructor(private canvas: HTMLCanvasElement) {
    this.subscribers   = []
    this.position      = Vector.create(0, 0)
    this.last_position = Vector.create(0, 0)
    this.direction         = Vector.create(0, 0)
    this.origin        = Vector.create(0, 0)
    this.button        = "none"
    this.canvas.addEventListener("mousedown", event => this.mousedown (event))
    this.canvas.addEventListener("mouseup",   event => this.mouseup   (event))
    this.canvas.addEventListener("mousemove", event => this.mousemove (event))
    this.canvas.addEventListener("wheel",     event => this.wheel(event))
    this.canvas.addEventListener("contextmenu", event => event.preventDefault())
  }
  public subscribe(func: (event: InteractionEvent) => void) {
    this.subscribers.push(func)
  }
  private mousemove (event: MouseEvent) {
    this.last_position = this.position
    this.position      = this.get_position(event)
    this.direction     = Vector.sub(this.position, this.last_position)
    this.dispatch({ 
      type:      "mousemove", 
      position:  this.position, 
      direction: this.direction 
    })
    if (this.button !== "none") {
      this.dispatch({
        type:      "mousedrag",
        button:    this.button,
        position:  this.position, 
        direction: this.direction 
      })
    }
  }
  private mouseup(event: MouseEvent) {
    this.button    = "none"
    this.origin    = Vector.create(0, 0)
    const position = this.get_position(event)
    const button   = this.get_button(event)
    this.dispatch({ type: "mouseup", position, button })
  }
  private mousedown(event: MouseEvent) {
    this.origin    = this.get_position(event)
    this.button    = this.get_button(event)
    const position = this.origin
    const button   = this.button
    this.dispatch({ type: "mousedown", position, button })
  }
  private wheel(event: WheelEvent) {
    const position  = this.get_position(event)
    const direction = this.get_direction(event)
    this.dispatch({ type: "mousewheel", position, direction })
  }
  private get_direction(event: WheelEvent): MouseDirection {
    return (event.wheelDelta < 0) ? -1 : 1
  }
  private get_button(event: MouseEvent): MouseButton {
    switch(event.button) {
      case 0: return "left"
      case 1: return "middle"
      case 2: return "right"
      default: return "none"
    }
  }
  private get_position(event: MouseEvent) : Vector {
    const center_x = this.canvas.width  * 0.5
    const center_y = this.canvas.height * 0.5
    const offset_x = event.offsetX - center_x
    const offset_y = event.offsetY - center_y
    return Vector.create(
      offset_x, offset_y
    )
  }
  private dispatch(event: InteractionEvent) {
    for (const subscriber of this.subscribers) {
      subscriber(event)
    }
  }
}