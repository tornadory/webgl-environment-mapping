import {
  vec3,
  mat4,
} from 'gl-matrix';

export default class Camera {
  private _ASPECT_RATIO: number = 1;
  private _FOVY: number = Math.PI / 2;
  private _NEAR: number = 1e-2;
  private _FAR: number = 1e4;

  public at: vec3;
  public eye: vec3;
  public up: vec3;

  public perspective: mat4;

  constructor() {
    this.at = vec3.fromValues(0, 0, -1);
    this.eye = vec3.fromValues(0, 0, 1);
    this.up = vec3.fromValues(0, 1, 0);

    this.perspective = mat4.perspective(mat4.create(), this._ASPECT_RATIO, this._FOVY, this._NEAR, this._FAR);
  }

  public setAt(x: number, y: number, z: number): void {
    this.at = vec3.set(this.at, x, y, z);
  }

  public setEye(x: number, y: number, z: number): void {
    this.eye = vec3.set(this.eye, x, y, z);
  }

  public setUp(x: number, y: number, z: number): void {
    this.up = vec3.set(this.up, x, y, z);
  }

  public getLookAt(): mat4 {
    return mat4.lookAt(mat4.create(), this.eye, this.at, this.up);
  }
}